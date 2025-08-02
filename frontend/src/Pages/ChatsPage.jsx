import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ChatSidebar from '../components/ChatSidebar';
import ChatWindow from '../components/ChatWindow';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { io } from 'socket.io-client';

const ChatsPage = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const [searchParams] = useSearchParams();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  // ✅ Initialize socket only once
  const socket = useMemo(() => io('http://localhost:5000'), []);

  // ✅ Join personal socket room
  useEffect(() => {
    if (user?._id) {
      socket.emit('join', user._id);
      console.log('✅ Socket joined room:', user._id);
    }

    return () => {
      socket.off(); // ✅ Clean up listeners, but do not disconnect globally
    };
  }, [user, socket]);

  // ✅ Handle receiving messages globally (not just inside ChatWindow)
  useEffect(() => {
    socket.on('receiveMessage', (msg) => {
      console.log('📥 Received message:', msg);

      // Add message to selected chat if active
    if (msg.chatId === selectedChat?._id) {
      // Do nothing here with messages — let ChatWindow handle it
      // Optionally, trigger a flag or callback if needed
      console.log('New message received for the selected chat');
    }


      // Optionally: refresh chats list if needed
      setChats((prevChats) => {
        const updated = prevChats.map(chat =>
          chat._id === msg.chatId ? { ...chat, lastMessage: msg } : chat
        );
        return updated;
      });
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [selectedChat, socket]);

  // ✅ Load chats + auto-select from query
  useEffect(() => {
    if (!user || !token) return;

    const targetUserId = searchParams.get('userId');
    console.log('Query Param userId:', targetUserId);

    const fetchChats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/chats', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const chatsList = Array.isArray(res.data) ? res.data : [];
        setChats(chatsList);

        if (targetUserId) {
          const existingChat = chatsList.find(chat =>
            chat.members.some(m => m._id === targetUserId)
          );

          if (existingChat) {
            setSelectedChat(existingChat);
          } else {
            const chatRes = await axios.post('http://localhost:5000/api/chats', {
              senderId: user._id,
              receiverId: targetUserId
            }, {
              headers: { Authorization: `Bearer ${token}` }
            });

            setChats(prev => [...prev, chatRes.data]);
            setSelectedChat(chatRes.data);
          }
        }
      } catch (err) {
        console.error('❌ Failed to load chats:', err);
      }
    };

    fetchChats();
  }, [user, token, searchParams]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex flex-1 h-full overflow-hidden">
        <ChatSidebar
          chats={chats}
          user={user}
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
        />
        <ChatWindow
          socket={socket}
          selectedChat={selectedChat}
          user={user}
        />
      </main>
      <Footer />
    </div>
  );
};

export default ChatsPage;
