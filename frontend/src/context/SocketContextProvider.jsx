import { createContext, useContext } from 'react';
import socketIoClient from 'socket.io-client';

// One socket instance shared across the entire app
export const socket = socketIoClient('http://localhost:6001', {
  autoConnect: true,
  reconnection: true,
});

export const SocketContext = createContext(null);

export const SocketContextProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

// Convenience hook
export const useSocket = () => useContext(SocketContext);