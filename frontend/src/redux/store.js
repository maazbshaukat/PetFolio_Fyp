import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import petReducer from './slices/petSlice';
import chatReducer from './slices/chatSlice';
import reviewsReducer from './slices/reviewsSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    pet: petReducer,
    chat: chatReducer,
    reviews: reviewsReducer,
  },
});

export default store;
