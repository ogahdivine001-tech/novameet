import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  HiVideoCamera,
  HiUsers,
  HiClock,
  HiX,
  HiLockClosed,
} from "react-icons/hi";
import VideoGrid from "../components/VideoGrid";
import MeetingControls from "../components/MeetingControls";
import ChatPanel from "../components/ChatPanel";
import ParticipantsPanel from "../components/ParticipantsPanel";
import LoadingSpinner from "../components/LoadingSpinner";
import useAuth from "../hooks/useAuth";
import useSocket from "../hooks/useSocket";
import useWebRTC from "../hooks/useWebRTC";
import meetingService from "../services/meetingService";
import { formatElapsed } from "../utils/formatDate";

const MeetingRoom = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socketRef, connected, emit } = useSocket();
  const {
    localStream,
    remoteStreams,
    mediaError,
    micOn,
    cameraOn,
    isScreenSharing,
    initLocalMedia,
    callParticipant,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    closePeerConnection,
    closeAllPeerConnections,
    toggleMic,
    toggleCamera,
    toggleScreenShare,
    forceMute,
  } = useWebRTC(socketRef);

  const [meetingInfo, setMeetingInfo] = useState(null);
  const [participants, setParticipants] = useState([]); // metadata, keyed by socketId
  const [messages, setMessages] = useState([]);
  const [handRaised, setHandRaised] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [phase, setPhase] = useState("loading"); // loading | password | joining | active | error | ended
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [joinedAt] = useState(new Date());
  const [elapsed, setElapsed] = useState("00:00");
  const [isHost, setIsHost] = useState(false);

  // Elapsed timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(formatElapsed(joinedAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [joinedAt]);

  // Step 1: Validate/join meeting via REST API
  const attemptJoin = useCallback(
    async (password) => {
      setPhase("joining");
      setErrorMessage("");
      try {
        const res = await meetingService.joinMeeting(meetingId, password);
        setMeetingInfo(res.meeting);
        setIsHost(res.meeting.isHost);
        setPhase("media");
      } catch (err) {
        const data = err.response?.data;
        if (data?.requiresPassword) {
          setPhase("password");
          setErrorMessage(data.message || "This meeting requires a password");
        } else {
          setErrorMessage(data?.message || "Unable to join this meeting");
          setPhase("error");
        }
      }
    },
    [meetingId],
  );

  useEffect(() => {
    attemptJoin();
  }, [attemptJoin]);

  // Step 2: Get local media once REST join succeeds
  useEffect(() => {
    if (phase === "media") {
      initLocalMedia().finally(() => setPhase("connecting"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Step 3: Join (or rejoin) the Socket.IO room whenever the socket
  // connects. This runs on the initial connect and also on every
  // automatic reconnect (e.g. after a brief network drop or the backend
  // restarting), so the call self-heals instead of staying broken forever
  // once the underlying signaling connection blips.
  useEffect(() => {
    if ((phase !== "connecting" && phase !== "active") || !connected) return;

    // Any peer connections from before a disconnect are now stale (the
    // remote side already tore down its side when our old socket dropped),
    // so clear them before rejoining and re-negotiating fresh connections.
    closeAllPeerConnections();

    emit("join-meeting", { meetingId }, (res) => {
      if (!res?.success) {
        setErrorMessage(
          res?.message || "Could not connect to the meeting room",
        );
        setPhase("error");
        return;
      }

      setIsHost(res.isHost);
      setParticipants(res.participants || []);

      // We are (re)joining: initiate connections to everyone already present
      (res.participants || []).forEach((p) => {
        callParticipant(p.socketId);
      });

      setPhase("active");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  // Step 4: Wire up all real-time socket event listeners
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const onUserJoined = (participant) => {
      setParticipants((prev) => {
        if (prev.some((p) => p.socketId === participant.socketId)) return prev;
        return [...prev, participant];
      });
      // The existing participant waits for the new joiner's offer.
    };

    const onOffer = (payload) => handleOffer(payload);
    const onAnswer = (payload) => handleAnswer(payload);
    const onIceCandidate = (payload) => handleIceCandidate(payload);

    const onUserLeft = ({ socketId }) => {
      closePeerConnection(socketId);
      setParticipants((prev) => prev.filter((p) => p.socketId !== socketId));
    };

    const onMicToggled = ({ socketId, micOn: state }) => {
      setParticipants((prev) =>
        prev.map((p) => (p.socketId === socketId ? { ...p, micOn: state } : p)),
      );
    };

    const onCameraToggled = ({ socketId, cameraOn: state }) => {
      setParticipants((prev) =>
        prev.map((p) =>
          p.socketId === socketId ? { ...p, cameraOn: state } : p,
        ),
      );
    };

    const onScreenShareToggled = ({ socketId, screenSharing }) => {
      setParticipants((prev) =>
        prev.map((p) =>
          p.socketId === socketId ? { ...p, screenSharing } : p,
        ),
      );
    };

    const onHandToggled = ({ socketId, handRaised: state }) => {
      setParticipants((prev) =>
        prev.map((p) =>
          p.socketId === socketId ? { ...p, handRaised: state } : p,
        ),
      );
    };

    const onReceiveMessage = (message) => {
      setMessages((prev) => [...prev, message]);
      setChatOpen((isOpen) => {
        if (!isOpen) {
          setUnreadCount((c) => c + 1);
        }
        return isOpen;
      });
    };

    const onForceMute = () => forceMute();

    const onRemoved = () => {
      closeAllPeerConnections();
      setPhase("ended");
      setErrorMessage("You were removed from this meeting by the host.");
    };

    const onMeetingEnded = () => {
      closeAllPeerConnections();
      setPhase("ended");
      setErrorMessage("The host has ended this meeting.");
    };

    socket.on("user-joined", onUserJoined);
    socket.on("offer", onOffer);
    socket.on("answer", onAnswer);
    socket.on("ice-candidate", onIceCandidate);
    socket.on("user-left", onUserLeft);
    socket.on("participant-mic-toggled", onMicToggled);
    socket.on("participant-camera-toggled", onCameraToggled);
    socket.on("participant-screen-share-toggled", onScreenShareToggled);
    socket.on("participant-hand-toggled", onHandToggled);
    socket.on("receive-message", onReceiveMessage);
    socket.on("force-mute", onForceMute);
    socket.on("removed-from-meeting", onRemoved);
    socket.on("meeting-ended", onMeetingEnded);

    return () => {
      socket.off("user-joined", onUserJoined);
      socket.off("offer", onOffer);
      socket.off("answer", onAnswer);
      socket.off("ice-candidate", onIceCandidate);
      socket.off("user-left", onUserLeft);
      socket.off("participant-mic-toggled", onMicToggled);
      socket.off("participant-camera-toggled", onCameraToggled);
      socket.off("participant-screen-share-toggled", onScreenShareToggled);
      socket.off("participant-hand-toggled", onHandToggled);
      socket.off("receive-message", onReceiveMessage);
      socket.off("force-mute", onForceMute);
      socket.off("removed-from-meeting", onRemoved);
      socket.off("meeting-ended", onMeetingEnded);
    };
  }, [
    socketRef,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    closePeerConnection,
    closeAllPeerConnections,
    forceMute,
  ]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    attemptJoin(passwordInput);
  };

  const handleToggleHand = () => {
    const newState = !handRaised;
    setHandRaised(newState);
    emit("toggle-hand", { handRaised: newState });
  };

  const handleSendMessage = (text) => {
    emit("send-message", { text });
  };

  const handleOpenChat = () => {
    setChatOpen(true);
    setParticipantsOpen(false);
    setUnreadCount(0);
  };

  const handleOpenParticipants = () => {
    setParticipantsOpen((v) => !v);
    setChatOpen(false);
  };

  const handleMuteParticipant = (socketId) => {
    emit("mute-participant", { socketId });
  };

  const handleRemoveParticipant = (socketId) => {
    emit("remove-participant", { socketId });
  };

  const handleLeave = () => {
    emit("leave-meeting");
    closeAllPeerConnections();
    navigate("/dashboard");
  };

  const handleEndMeeting = () => {
    emit("end-meeting");
  };

  // ---------- Render states ----------

  if (phase === "loading" || phase === "joining") {
    return <LoadingSpinner fullScreen label="Joining meeting..." />;
  }

  if (phase === "password") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[rgb(var(--color-bg))]">
        <div className="card w-full max-w-sm p-6 animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-nova-50 dark:bg-nova-950 flex items-center justify-center mb-4">
            <HiLockClosed className="text-nova-600 dark:text-nova-400 text-xl" />
          </div>
          <h1 className="text-lg font-bold text-[rgb(var(--color-text-primary))]">
            Password required
          </h1>
          <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1">
            {errorMessage}
          </p>
          <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-3">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="input-field"
              placeholder="Meeting password"
              autoFocus
            />
            <button type="submit" className="btn btn-primary w-full">
              Join Meeting
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (phase === "error" || phase === "ended") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[rgb(var(--color-bg))]">
        <div className="card w-full max-w-sm p-6 text-center animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4 mx-auto">
            <HiX className="text-red-600 text-xl" />
          </div>
          <h1 className="text-lg font-bold text-[rgb(var(--color-text-primary))]">
            {phase === "ended" ? "Meeting ended" : "Unable to join"}
          </h1>
          <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1">
            {errorMessage}
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="btn btn-primary w-full mt-5"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (phase === "media" || phase === "connecting") {
    return (
      <LoadingSpinner
        fullScreen
        label="Setting up your camera and microphone..."
      />
    );
  }

  const remoteParticipants = participants.map((p) => ({
    ...p,
    stream: remoteStreams[p.socketId],
  }));

  return (
    <div className="h-screen flex flex-col bg-slate-950 overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 flex-wrap gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <HiVideoCamera className="text-nova-400 text-lg flex-shrink-0" />
          <span className="text-white font-semibold text-sm truncate max-w-[160px] sm:max-w-xs">
            {meetingInfo?.title || "NovaMeet"}
          </span>
          <span className="text-slate-400 text-xs font-mono hidden sm:inline">
            {meetingId}
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-300 text-xs sm:text-sm">
          <span className="flex items-center gap-1">
            <HiClock /> {elapsed}
          </span>
          <span className="flex items-center gap-1">
            <HiUsers /> {1 + remoteParticipants.length}
          </span>
        </div>
      </div>

      {mediaError && (
        <div className="px-4 py-2 bg-amber-500/10 text-amber-400 text-xs text-center">
          {mediaError}
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 min-w-0">
          <VideoGrid
            localParticipant={{
              stream: localStream,
              name: user?.name || "You",
              micOn,
              cameraOn,
              isHost,
              handRaised,
              screenSharing: isScreenSharing,
            }}
            remoteParticipants={remoteParticipants}
          />
        </div>

        {chatOpen && (
          <div className="w-full sm:w-80 flex-shrink-0 border-l border-slate-800 bg-[rgb(var(--color-surface))] absolute sm:relative inset-0 sm:inset-auto z-20">
            <ChatPanel
              messages={messages}
              onSend={handleSendMessage}
              currentUserId={user?.id}
              onClose={() => setChatOpen(false)}
            />
          </div>
        )}

        {participantsOpen && (
          <div className="w-full sm:w-80 flex-shrink-0 border-l border-slate-800 bg-[rgb(var(--color-surface))] absolute sm:relative inset-0 sm:inset-auto z-20">
            <ParticipantsPanel
              localParticipant={{
                name: user?.name,
                micOn,
                cameraOn,
                isHost,
                handRaised,
              }}
              participants={remoteParticipants}
              isHost={isHost}
              onMuteParticipant={handleMuteParticipant}
              onRemoveParticipant={handleRemoveParticipant}
              onClose={() => setParticipantsOpen(false)}
            />
          </div>
        )}
      </div>

      <MeetingControls
        micOn={micOn}
        cameraOn={cameraOn}
        isScreenSharing={isScreenSharing}
        handRaised={handRaised}
        chatOpen={chatOpen}
        participantsOpen={participantsOpen}
        onToggleMic={toggleMic}
        onToggleCamera={toggleCamera}
        onToggleScreenShare={toggleScreenShare}
        onToggleHand={handleToggleHand}
        onToggleChat={chatOpen ? () => setChatOpen(false) : handleOpenChat}
        onToggleParticipants={handleOpenParticipants}
        onLeave={handleLeave}
        onEndMeeting={handleEndMeeting}
        isHost={isHost}
        unreadCount={unreadCount}
      />
    </div>
  );
};

export default MeetingRoom;
