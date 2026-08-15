const bcrypt = require('bcryptjs');
const Meeting = require('../models/Meeting');
const MeetingParticipant = require('../models/MeetingParticipant');
const generateMeetingId = require('../utils/generateMeetingId');

// @desc    Create a new meeting
// @route   POST /api/meetings
// @access  Private
const createMeeting = async (req, res, next) => {
  try {
    const {
      title,
      description,
      meetingType,
      scheduledAt,
      duration,
      password,
      waitingRoom,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Meeting title is required',
      });
    }

    // Ensure unique meeting ID
    let meetingId;
    let exists = true;
    let attempts = 0;
    while (exists && attempts < 10) {
      meetingId = generateMeetingId();
      exists = await Meeting.findOne({ meetingId });
      attempts += 1;
    }
    if (exists) {
      return res.status(500).json({
        success: false,
        message: 'Could not generate a unique meeting ID, please try again',
      });
    }

    let hashedPassword = null;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const isScheduled = meetingType === 'scheduled';

    const meeting = await Meeting.create({
      title,
      description: description || '',
      meetingId,
      password: hashedPassword,
      host: req.user._id,
      meetingType: isScheduled ? 'scheduled' : 'instant',
      scheduledAt: isScheduled && scheduledAt ? new Date(scheduledAt) : null,
      duration: duration || 60,
      status: isScheduled ? 'scheduled' : 'active',
      waitingRoom: !!waitingRoom,
      startedAt: isScheduled ? null : new Date(),
      participants: [req.user._id],
    });

    res.status(201).json({
      success: true,
      message: 'Meeting created successfully',
      meeting: {
        id: meeting._id,
        title: meeting.title,
        description: meeting.description,
        meetingId: meeting.meetingId,
        hasPassword: meeting.hasPassword(),
        host: meeting.host,
        meetingType: meeting.meetingType,
        scheduledAt: meeting.scheduledAt,
        duration: meeting.duration,
        status: meeting.status,
        waitingRoom: meeting.waitingRoom,
        createdAt: meeting.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all meetings for current user (as host)
// @route   GET /api/meetings
// @access  Private
const getMeetings = async (req, res, next) => {
  try {
    const meetings = await Meeting.find({ host: req.user._id })
      .sort({ createdAt: -1 })
      .populate('host', 'name email avatar');

    res.status(200).json({
      success: true,
      count: meetings.length,
      meetings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get upcoming meetings for current user
// @route   GET /api/meetings/upcoming
// @access  Private
const getUpcomingMeetings = async (req, res, next) => {
  try {
    const meetings = await Meeting.find({
      host: req.user._id,
      status: { $in: ['scheduled', 'active'] },
    })
      .sort({ scheduledAt: 1, createdAt: -1 })
      .populate('host', 'name email avatar');

    res.status(200).json({
      success: true,
      count: meetings.length,
      meetings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get meeting history for current user
// @route   GET /api/meetings/history
// @access  Private
const getMeetingHistory = async (req, res, next) => {
  try {
    const meetings = await Meeting.find({
      $or: [{ host: req.user._id }, { participants: req.user._id }],
      status: { $in: ['ended', 'cancelled'] },
    })
      .sort({ endedAt: -1, createdAt: -1 })
      .populate('host', 'name email avatar')
      .populate('participants', 'name email avatar');

    res.status(200).json({
      success: true,
      count: meetings.length,
      meetings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single meeting by mongo ID
// @route   GET /api/meetings/:id
// @access  Private
const getMeetingById = async (req, res, next) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate('host', 'name email avatar')
      .populate('participants', 'name email avatar');

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found',
      });
    }

    res.status(200).json({
      success: true,
      meeting: {
        ...meeting.toObject(),
        hasPassword: meeting.hasPassword(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Join a meeting by meetingId (e.g. NOVA-482-913)
// @route   POST /api/meetings/:id/join
// @access  Private
// Note: :id here refers to the human-readable meetingId, not mongo _id,
// to support the "Join Meeting" flow where users type in the meeting code.
const joinMeeting = async (req, res, next) => {
  try {
    const { password } = req.body;
    const meetingCode = req.params.id.toUpperCase();

    const meeting = await Meeting.findOne({ meetingId: meetingCode }).select(
      '+password'
    );

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found. Please check the meeting ID.',
      });
    }

    if (meeting.status === 'ended' || meeting.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This meeting has already ended',
      });
    }

    if (meeting.locked) {
      return res.status(403).json({
        success: false,
        message: 'This meeting is locked by the host',
      });
    }

    if (meeting.password) {
      if (!password) {
        return res.status(401).json({
          success: false,
          message: 'This meeting requires a password',
          requiresPassword: true,
        });
      }
      const isMatch = await bcrypt.compare(password, meeting.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Incorrect meeting password',
          requiresPassword: true,
        });
      }
    }

    if (!meeting.participants.includes(req.user._id)) {
      meeting.participants.push(req.user._id);
    }

    if (meeting.status === 'scheduled') {
      meeting.status = 'active';
      meeting.startedAt = new Date();
    }

    await meeting.save();

    let participantRecord = await MeetingParticipant.findOne({
      meeting: meeting._id,
      user: req.user._id,
      leftAt: null,
    });

    if (!participantRecord) {
      participantRecord = await MeetingParticipant.create({
        meeting: meeting._id,
        user: req.user._id,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Joined meeting successfully',
      meeting: {
        id: meeting._id,
        title: meeting.title,
        description: meeting.description,
        meetingId: meeting.meetingId,
        host: meeting.host,
        status: meeting.status,
        waitingRoom: meeting.waitingRoom,
        isHost: meeting.host.toString() === req.user._id.toString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    End a meeting (host only)
// @route   POST /api/meetings/:id/end
// @access  Private
const endMeeting = async (req, res, next) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found',
      });
    }

    if (meeting.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the host can end this meeting',
      });
    }

    meeting.status = 'ended';
    meeting.endedAt = new Date();
    await meeting.save();

    await MeetingParticipant.updateMany(
      { meeting: meeting._id, leftAt: null },
      { $set: { leftAt: new Date() } }
    );

    res.status(200).json({
      success: true,
      message: 'Meeting ended successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a meeting (host only)
// @route   DELETE /api/meetings/:id
// @access  Private
const deleteMeeting = async (req, res, next) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found',
      });
    }

    if (meeting.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the host can delete this meeting',
      });
    }

    await MeetingParticipant.deleteMany({ meeting: meeting._id });
    await meeting.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Meeting deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMeeting,
  getMeetings,
  getUpcomingMeetings,
  getMeetingHistory,
  getMeetingById,
  joinMeeting,
  endMeeting,
  deleteMeeting,
};
