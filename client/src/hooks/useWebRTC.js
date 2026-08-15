import { useState, useRef, useCallback, useEffect } from 'react';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

/**
 * Core WebRTC hook implementing a mesh topology.
 * Each participant maintains a direct RTCPeerConnection with every
 * other participant. Socket.IO (via socketRef) is used purely as the
 * signaling transport for offers, answers, and ICE candidates.
 */
const useWebRTC = (socketRef) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({}); // socketId -> MediaStream
  const [mediaError, setMediaError] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const peerConnectionsRef = useRef({}); // socketId -> RTCPeerConnection
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const cameraTrackRef = useRef(null);

  // ---------- Local media ----------
  const initLocalMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      localStreamRef.current = stream;
      cameraTrackRef.current = stream.getVideoTracks()[0] || null;
      setLocalStream(stream);
      setMediaError(null);
      return stream;
    } catch (error) {
      let message = 'Could not access camera or microphone.';
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        message =
          'Camera/microphone access was denied. Please allow permissions in your browser settings to join with video.';
      } else if (error.name === 'NotFoundError') {
        message = 'No camera or microphone was found on this device.';
      } else if (error.name === 'NotReadableError') {
        message = 'Your camera or microphone is already in use by another application.';
      }
      setMediaError(message);
      // Try audio-only fallback
      try {
        const audioOnly = await navigator.mediaDevices.getUserMedia({ audio: true });
        localStreamRef.current = audioOnly;
        setLocalStream(audioOnly);
        setCameraOn(false);
        return audioOnly;
      } catch (fallbackError) {
        return null;
      }
    }
  }, []);

  // ---------- Peer connection management ----------
  const createPeerConnection = useCallback(
    (remoteSocketId) => {
      if (peerConnectionsRef.current[remoteSocketId]) {
        return peerConnectionsRef.current[remoteSocketId];
      }

      const pc = new RTCPeerConnection(ICE_SERVERS);

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, localStreamRef.current);
        });
      }

      pc.ontrack = (event) => {
        setRemoteStreams((prev) => ({
          ...prev,
          [remoteSocketId]: event.streams[0],
        }));
      };

      pc.onicecandidate = (event) => {
        if (event.candidate && socketRef.current) {
          socketRef.current.emit('ice-candidate', {
            to: remoteSocketId,
            candidate: event.candidate,
          });
        }
      };

      pc.onconnectionstatechange = () => {
        if (['failed', 'closed', 'disconnected'].includes(pc.connectionState)) {
          // Leave cleanup to explicit user-left handling to avoid
          // premature teardown on transient state changes.
        }
      };

      peerConnectionsRef.current[remoteSocketId] = pc;
      return pc;
    },
    [socketRef]
  );

  const closePeerConnection = useCallback((remoteSocketId) => {
    const pc = peerConnectionsRef.current[remoteSocketId];
    if (pc) {
      pc.close();
      delete peerConnectionsRef.current[remoteSocketId];
    }
    setRemoteStreams((prev) => {
      const next = { ...prev };
      delete next[remoteSocketId];
      return next;
    });
  }, []);

  const closeAllPeerConnections = useCallback(() => {
    Object.keys(peerConnectionsRef.current).forEach((id) => {
      peerConnectionsRef.current[id].close();
    });
    peerConnectionsRef.current = {};
    setRemoteStreams({});
  }, []);

  // ---------- Signaling: initiate connection to an existing participant ----------
  const callParticipant = useCallback(
    async (remoteSocketId) => {
      const pc = createPeerConnection(remoteSocketId);
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socketRef.current?.emit('offer', { to: remoteSocketId, offer });
      } catch (error) {
        console.error('Error creating offer:', error);
      }
    },
    [createPeerConnection, socketRef]
  );

  // ---------- Signaling: handle incoming offer from a new joiner ----------
  const handleOffer = useCallback(
    async ({ from, offer }) => {
      const pc = createPeerConnection(from);
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socketRef.current?.emit('answer', { to: from, answer });
      } catch (error) {
        console.error('Error handling offer:', error);
      }
    },
    [createPeerConnection, socketRef]
  );

  const handleAnswer = useCallback(async ({ from, answer }) => {
    const pc = peerConnectionsRef.current[from];
    if (pc) {
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    }
  }, []);

  const handleIceCandidate = useCallback(async ({ from, candidate }) => {
    const pc = peerConnectionsRef.current[from];
    if (pc && candidate) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    }
  }, []);

  // ---------- Media controls ----------
  const toggleMic = useCallback(() => {
    if (!localStreamRef.current) return;
    const audioTracks = localStreamRef.current.getAudioTracks();
    const newState = !micOn;
    audioTracks.forEach((track) => {
      track.enabled = newState;
    });
    setMicOn(newState);
    socketRef.current?.emit('toggle-mic', { micOn: newState });
  }, [micOn, socketRef]);

  const forceMute = useCallback(() => {
    if (!localStreamRef.current) return;
    localStreamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = false;
    });
    setMicOn(false);
  }, []);

  const toggleCamera = useCallback(() => {
    if (!localStreamRef.current) return;
    const videoTracks = localStreamRef.current.getVideoTracks();
    const newState = !cameraOn;
    videoTracks.forEach((track) => {
      track.enabled = newState;
    });
    setCameraOn(newState);
    socketRef.current?.emit('toggle-camera', { cameraOn: newState });
  }, [cameraOn, socketRef]);

  const replaceVideoTrackForAllPeers = useCallback((newTrack) => {
    Object.values(peerConnectionsRef.current).forEach((pc) => {
      const sender = pc.getSenders().find((s) => s.track && s.track.kind === 'video');
      if (sender) {
        sender.replaceTrack(newTrack);
      }
    });
  }, []);

  const startScreenShare = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      const screenTrack = screenStream.getVideoTracks()[0];
      screenStreamRef.current = screenStream;

      replaceVideoTrackForAllPeers(screenTrack);

      // Swap track in the stream exposed to the local preview
      if (localStreamRef.current) {
        const oldVideoTrack = localStreamRef.current.getVideoTracks()[0];
        if (oldVideoTrack) {
          localStreamRef.current.removeTrack(oldVideoTrack);
        }
        localStreamRef.current.addTrack(screenTrack);
        setLocalStream(new MediaStream(localStreamRef.current.getTracks()));
      }

      setIsScreenSharing(true);
      socketRef.current?.emit('toggle-screen-share', { screenSharing: true });

      screenTrack.onended = () => {
        stopScreenShare();
      };
    } catch (error) {
      if (error.name !== 'NotAllowedError') {
        console.error('Error starting screen share:', error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replaceVideoTrackForAllPeers, socketRef]);

  const stopScreenShare = useCallback(() => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }

    if (cameraTrackRef.current && localStreamRef.current) {
      replaceVideoTrackForAllPeers(cameraTrackRef.current);

      const oldTrack = localStreamRef.current.getVideoTracks()[0];
      if (oldTrack) {
        localStreamRef.current.removeTrack(oldTrack);
      }
      localStreamRef.current.addTrack(cameraTrackRef.current);
      setLocalStream(new MediaStream(localStreamRef.current.getTracks()));
    }

    setIsScreenSharing(false);
    socketRef.current?.emit('toggle-screen-share', { screenSharing: false });
  }, [replaceVideoTrackForAllPeers, socketRef]);

  const toggleScreenShare = useCallback(() => {
    if (isScreenSharing) {
      stopScreenShare();
    } else {
      startScreenShare();
    }
  }, [isScreenSharing, startScreenShare, stopScreenShare]);

  // ---------- Cleanup ----------
  const cleanupMedia = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }
    closeAllPeerConnections();
    setLocalStream(null);
  }, [closeAllPeerConnections]);

  useEffect(() => {
    return () => {
      cleanupMedia();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
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
    cleanupMedia,
  };
};

export default useWebRTC;
