import React, { useContext, useEffect, useRef, useState } from 'react';
import Message from './Message';
import { GeneralContext } from '../../context/GeneralContextProvider';

const Messages = () => {
  const { socket, chatData } = useContext(GeneralContext);
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    const handleMessagesUpdated = ({ chat }) => {
      if (chat?.messages) setMessages(chat.messages);
    };

    const handleNewMessage = () => {
      if (chatData.chatId) {
        socket.emit('update-messages', { chatId: chatData.chatId });
      }
    };

    socket.on('messages-updated', handleMessagesUpdated);
    socket.on('message-from-user', handleNewMessage);

    return () => {
      socket.off('messages-updated', handleMessagesUpdated);
      socket.off('message-from-user', handleNewMessage);
    };
  }, [socket, chatData.chatId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px 20px 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        background: '#0c0e1c',
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(109,86,255,0.2) transparent',
      }}
    >
      {messages.length === 0 && (
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '10px',
          color: '#3a4260',
          fontSize: '13px',
          letterSpacing: '0.02em',
          userSelect: 'none',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(109,86,255,0.08)',
            border: '1px solid rgba(109,86,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
          }}>
            💬
          </div>
          Say hello!
        </div>
      )}

      {messages.map((message) => (
        <Message message={message} key={message.id} />
      ))}

      <div ref={bottomRef} />
    </div>
  );
};

export default Messages;