import React, { useContext, useEffect, useState } from 'react'
import Message from './Message'
import { GeneralContext } from '../../context/GeneralContextProvider';

const Messages = () => {

  const { socket } = useContext(GeneralContext);
  const [messages, setMessages] = useState([]);
  const { chatData } = useContext(GeneralContext);

  useEffect(() => {
    const handleMessagesUpdated = ({ chat }) => {
      if (chat) setMessages(chat.messages);
    };
    const handleNewMessage = async () => {
      socket.emit('update-messages', { chatId: chatData.chatId });
    };

    socket.on('messages-updated', handleMessagesUpdated);
    socket.on('message-from-user', handleNewMessage);

    return () => {
      socket.off('messages-updated', handleMessagesUpdated);
      socket.off('message-from-user', handleNewMessage);
    };
  }, [socket, chatData]);

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '24px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      background: '#0a0e1a',
      scrollbarWidth: 'none',
    }}>
      {messages.length > 0 && messages.map((message) => (
        <Message message={message} key={message.id} />
      ))}
    </div>
  );
};

export default Messages;