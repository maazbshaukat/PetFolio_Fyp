import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import MessageInput from './MessageInput';

const ChatWindow = ({ socket, selectedChat, user }) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem('token');

  // Fetch messages when chat changes
  useEffect(() => {
    if (!selectedChat?._id) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/messages/${selectedChat._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const msgs = Array.isArray(res.data) ? res.data : [];
        setMessages(msgs);

        // Mark as read
        await axios.patch(
          `http://localhost:5000/api/messages/read/${selectedChat._id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error('Failed to fetch or mark messages:', err);
      }
    };

    fetchMessages();
  }, [selectedChat?._id, token]);

  // Real-time listener for new messages
  useEffect(() => {
    const handleMessage = (msg) => {
      if (msg.chatId === selectedChat?._id) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on('receiveMessage', handleMessage);
    return () => socket.off('receiveMessage', handleMessage);
  }, [selectedChat?._id, socket]);

  // Typing indicator handlers
  useEffect(() => {
    const handleTyping = () => setIsTyping(true);
    const handleStopTyping = () => setIsTyping(false);

    socket.on('typing', handleTyping);
    socket.on('stopTyping', handleStopTyping);

    return () => {
      socket.off('typing', handleTyping);
      socket.off('stopTyping', handleStopTyping);
    };
  }, [socket]);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!selectedChat) {
    return (
      <div className="w-2/3 flex items-center justify-center text-gray-500">
        Select a chat
      </div>
    );
  }

  const receiver = selectedChat?.members?.find(
    (m) => m && String(m._id) !== String(user._id)
  );

  return (
    <div className="w-2/3 flex flex-col h-full p-4 bg-gray-50 relative">
      {/* Header */}
      <div className="mb-2 flex items-center justify-between px-2 text-sm text-gray-600">
        <span className="font-semibold">{receiver?.name || 'Chat'}</span>
        <span>{isTyping ? 'Typing...' : 'Online'}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 pr-2">
        {messages.map((msg) => {
          const isSender = String(msg.senderId) === String(user._id);
          return (
            <div key={msg._id} className={`flex my-1 ${isSender ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`px-4 py-2 max-w-[70%] rounded-2xl text-sm shadow ${
                  isSender
                    ? 'bg-green-500 text-white rounded-br-none'
                    : 'bg-white text-gray-900 border rounded-bl-none'
                }`}
              >
                <div>{msg.text}</div>
                <div className="text-xs text-gray-400 mt-1 text-right">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="text-sm text-gray-500 italic px-4 py-1">Typing...</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Scroll-to-bottom button */}
      {messages.length > 5 && (
        <button
          className="absolute bottom-24 right-6 bg-purple-600 text-white px-3 py-1 rounded-full shadow-md hover:bg-purple-700 transition"
          onClick={() =>
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
          }
        >
          ↓ New
        </button>
      )}

      {/* Message Input */}
      <MessageInput
        socket={socket}
        selectedChat={selectedChat}
        user={user}
        onSend={(msg) => setMessages((prev) => [...prev, msg])}
      />
    </div>
  );
};

export default ChatWindow;
