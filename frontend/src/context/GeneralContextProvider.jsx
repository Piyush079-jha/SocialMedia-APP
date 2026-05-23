import React, { createContext, useContext, useReducer, useState } from 'react';
import { SocketContext } from './SocketContextProvider';

export const GeneralContext = createContext();

const INITIAL_STATE = {
  chatId: null,
  user:   {},
};

export const GeneralContextProvider = ({ children }) => {

  const { socket } = useContext(SocketContext);

  const [isCreatPostOpen,      setIsCreatePostOpen]   = useState(false);
  const [isCreateStoryOpen,    setIsCreateStoryOpen]  = useState(false);
  const [isNotificationsOpen,  setNotificationsOpen]  = useState(false);
  const [notifications,        setNotifications]      = useState([]);
  const [chatFriends,          setChatFriends]        = useState([]);

  const userId = localStorage.getItem('userId');

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user:   action.payload,
          chatId: userId > action.payload._id
                    ? userId + action.payload._id
                    : action.payload._id + userId,
        };
      default:
        return state;
    }
  };

  const [chatData, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <GeneralContext.Provider value={{
      socket,
      isCreatPostOpen,     setIsCreatePostOpen,
      isCreateStoryOpen,   setIsCreateStoryOpen,
      isNotificationsOpen, setNotificationsOpen,
      notifications,       setNotifications,
      chatFriends,         setChatFriends,
      chatData,            dispatch,
    }}>
      {children}
    </GeneralContext.Provider>
  );
};