import React from 'react';

const ChatSidebar = ({ chats, user, onSelectChat, selectedChat }) => {
  const isChatListValid = Array.isArray(chats) && chats.length > 0;

  return (
    <div className="w-1/3 p-4 bg-white border-r overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Messages</h2>

      {isChatListValid ? (
        chats.map(chat => {
          // ✅ Safe check: ensure members exist and are populated
          const other = chat?.members?.find(
            m => m && String(m._id) !== String(user._id)
          );

          return (
            <div
              key={chat._id}
              onClick={() => onSelectChat(chat)}
              className={`p-2 rounded-lg cursor-pointer hover:bg-purple-100 ${
                selectedChat?._id === chat._id ? 'bg-purple-100' : ''
              }`}
            >
              <div className="font-medium">
                {other?.name || 'Unknown User'}
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-gray-500 text-sm italic">No chats available</p>
      )}
    </div>
  );
};

export default ChatSidebar;
