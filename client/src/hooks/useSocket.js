import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL, TOKEN_KEY } from '../utils/constants';

/**
 * Manages a Socket.IO connection scoped to the lifetime of the component
 * that calls this hook (typically MeetingRoom). The socket is created once
 * and torn down on unmount.
 */
const useSocket = () => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const emit = useCallback((event, payload, callback) => {
    if (socketRef.current) {
      socketRef.current.emit(event, payload, callback);
    }
  }, []);

  return { socketRef, connected, emit };
};

export default useSocket;
