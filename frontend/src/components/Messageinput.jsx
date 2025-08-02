import React, { useState, useRef } from 'react';
import axios from 'axios';

const MessageInput = ({ socket, selectedChat, user, onSend }) => {
  const [text, setText] = useState('');
  const typingTimeout = useRef(null);
  const token = localStorage.getItem('token');

  const getReceiverId = () => selectedChat.members.find(m => m._id !== user._id);

  const handleChange = (e) => {
    setText(e.target.value);

    socket.emit('typing', { receiverId: getReceiverId() });

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit('stopTyping', { receiverId: getReceiverId() });
    }, 1000);
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      const res = await axios.post('http://localhost:5000/api/messages', {
        chatId: selectedChat._id,
        text
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Optimistically update UI
      onSend(res.data);

      socket.emit('sendMessage', {
        receiverId: getReceiverId(),
        message: res.data
      });

      setText('');
    } catch (error) {
      console.error('Send message failed:', error);
    }
  };

  return (
    <div className="flex items-center gap-2 border-t pt-3 bg-white">
      <input
        type="text"
        className="flex-1 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-purple-500"
        value={text}
        onChange={handleChange}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
        placeholder="Type a message..."
      />
      <button
        onClick={sendMessage}
        className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-full transition"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
