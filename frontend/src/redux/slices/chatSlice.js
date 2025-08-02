import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    selectedChatId: null,
    typingUsers: {},
  },
  reducers: {
    setSelectedChat(state, action) {
      state.selectedChatId = action.payload;
    },
    setTypingUser(state, action) {
      const { chatId, isTyping } = action.payload;
      state.typingUsers[chatId] = isTyping;
    }
  }
});

export const { setSelectedChat, setTypingUser } = chatSlice.actions;
export default chatSlice.reducer;
