const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Meeting = require('../models/Meeting');
const MeetingParticipant = require('../models/MeetingParticipant');

// In-memory map of active rooms -> Map(socketId -> participant info)
// This is intentionally in-memory since it only tracks live socket
// presence; durable state (meeting/participant records) lives in MongoDB.
const rooms = new Map();

const getRoom = (meetingId) => {
  if (!rooms.has(meetingId)) {
    rooms.set(meetingId, new Map());
  }
  return rooms.get(meetingId);
};

const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication error: no token provided'));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new Error('Authentication error: user not found'));
    }
    socket.user = {
      id: user._id.toString(),
      name: user.name,
      avatar: user.avatar,
    };
    next();
  } catch (error) {
    next(new Error('Authentication error: invalid token'));
  }
};

const initMeetingSocket = (io) => {
  io.use(socketAuth);

  io.on('connection', (socket) => {
    let currentMeetingId = null;

    socket.on('join-meeting', async ({ meetingId }, callback) => {
      try {
        const meeting = await Meeting.findOne({
          meetingId: meetingId?.toUpperCase(),
        });

        if (!meeting) {
          if (callback) callback({ success: false, message: 'Meeting not found' });
          return;
        }

        if (meeting.locked && meeting.host.toString() !== socket.user.id) {
          if (callback)
            callback({ success: false, message: 'Meeting is locked' });
          return;
        }

        currentMeetingId = meeting.meetingId;
        socket.join(currentMeetingId);

        const room = getRoom(currentMeetingId);

        const isHost = meeting.host.toString() === socket.user.id;

        const participantInfo = {
          socketId: socket.id,
          userId: socket.user.id,
          name: socket.user.name,
          avatar: socket.user.avatar,
          isHost,
          micOn: true,
          cameraOn: true,
          handRaised: false,
          screenSharing: false,
        };

        room.set(socket.id, participantInfo);

        // Send existing participants to the new joiner
        const existingParticipants = Array.from(room.values()).filter(
          (p) => p.socketId !== socket.id
        );

        if (callback) {
          callback({
            success: true,
            participants: existingParticipants,
            isHost,
          });
        }

        // Notify others in the room
        socket.to(currentMeetingId).emit('user-joined', participantInfo);
      } catch (error) {
        if (callback) {
          callback({ success: false, message: 'Failed to join meeting' });
        }
      }
    });

    // WebRTC signaling relay
    socket.on('offer', ({ to, offer }) => {
      io.to(to).emit('offer', { from: socket.id, offer });
    });

    socket.on('answer', ({ to, answer }) => {
      io.to(to).emit('answer', { from: socket.id, answer });
    });

    socket.on('ice-candidate', ({ to, candidate }) => {
      io.to(to).emit('ice-candidate', { from: socket.id, candidate });
    });

    // Media state toggles
    socket.on('toggle-mic', ({ micOn }) => {
      if (!currentMeetingId) return;
      const room = getRoom(currentMeetingId);
      const participant = room.get(socket.id);
      if (participant) {
        participant.micOn = micOn;
        socket
          .to(currentMeetingId)
          .emit('participant-mic-toggled', { socketId: socket.id, micOn });
      }
    });

    socket.on('toggle-camera', ({ cameraOn }) => {
      if (!currentMeetingId) return;
      const room = getRoom(currentMeetingId);
      const participant = room.get(socket.id);
      if (participant) {
        participant.cameraOn = cameraOn;
        socket
          .to(currentMeetingId)
          .emit('participant-camera-toggled', { socketId: socket.id, cameraOn });
      }
    });

    socket.on('toggle-screen-share', ({ screenSharing }) => {
      if (!currentMeetingId) return;
      const room = getRoom(currentMeetingId);
      const participant = room.get(socket.id);
      if (participant) {
        participant.screenSharing = screenSharing;
        socket.to(currentMeetingId).emit('participant-screen-share-toggled', {
          socketId: socket.id,
          screenSharing,
        });
      }
    });

    socket.on('toggle-hand', ({ handRaised }) => {
      if (!currentMeetingId) return;
      const room = getRoom(currentMeetingId);
      const participant = room.get(socket.id);
      if (participant) {
        participant.handRaised = handRaised;
        socket
          .to(currentMeetingId)
          .emit('participant-hand-toggled', { socketId: socket.id, handRaised });
      }
    });

    // Chat
    socket.on('send-message', ({ text }) => {
      if (!currentMeetingId || !text || !text.trim()) return;
      const message = {
        id: `${socket.id}-${Date.now()}`,
        socketId: socket.id,
        senderId: socket.user.id,
        senderName: socket.user.name,
        text: text.trim(),
        timestamp: new Date().toISOString(),
      };
      io.to(currentMeetingId).emit('receive-message', message);
    });

    // Host controls
    socket.on('mute-participant', ({ socketId }) => {
      if (!currentMeetingId) return;
      const room = getRoom(currentMeetingId);
      const requester = room.get(socket.id);
      if (!requester || !requester.isHost) return;
      const target = room.get(socketId);
      if (target) {
        target.micOn = false;
        io.to(socketId).emit('force-mute');
        io.to(currentMeetingId).emit('participant-mic-toggled', {
          socketId,
          micOn: false,
        });
      }
    });

    socket.on('remove-participant', ({ socketId }) => {
      if (!currentMeetingId) return;
      const room = getRoom(currentMeetingId);
      const requester = room.get(socket.id);
      if (!requester || !requester.isHost) return;
      const target = room.get(socketId);
      if (target) {
        io.to(socketId).emit('removed-from-meeting');
        room.delete(socketId);
        io.to(currentMeetingId).emit('user-left', { socketId });
        const targetSocket = io.sockets.sockets.get(socketId);
        if (targetSocket) {
          targetSocket.leave(currentMeetingId);
        }
      }
    });

    socket.on('end-meeting', async () => {
      if (!currentMeetingId) return;
      const room = getRoom(currentMeetingId);
      const requester = room.get(socket.id);
      if (!requester || !requester.isHost) return;

      try {
        const meeting = await Meeting.findOne({ meetingId: currentMeetingId });
        if (meeting) {
          meeting.status = 'ended';
          meeting.endedAt = new Date();
          await meeting.save();
          await MeetingParticipant.updateMany(
            { meeting: meeting._id, leftAt: null },
            { $set: { leftAt: new Date() } }
          );
        }
      } catch (error) {
        console.error('Error ending meeting:', error.message);
      }

      io.to(currentMeetingId).emit('meeting-ended');
      rooms.delete(currentMeetingId);
    });

    socket.on('leave-meeting', () => {
      handleDisconnect();
    });

    socket.on('disconnect', () => {
      handleDisconnect();
    });

    function handleDisconnect() {
      if (!currentMeetingId) return;
      const room = rooms.get(currentMeetingId);
      if (room) {
        room.delete(socket.id);
        if (room.size === 0) {
          rooms.delete(currentMeetingId);
        }
      }
      socket.to(currentMeetingId).emit('user-left', { socketId: socket.id });
      socket.leave(currentMeetingId);
      currentMeetingId = null;
    }
  });
};

module.exports = initMeetingSocket;
