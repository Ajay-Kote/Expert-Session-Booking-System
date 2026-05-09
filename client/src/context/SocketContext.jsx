import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to the Socket.io server
    // Allowing fallback to polling fixes connection issues on some environments
    const newSocket = io(window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/', {
      reconnectionDelay: 1000,
      reconnection: true,
    });

    setSocket(newSocket);

    return () => newSocket.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
