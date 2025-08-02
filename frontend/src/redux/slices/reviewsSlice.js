import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchReviews = createAsyncThunk('reviews/fetch', async (sellerId) => {
  const res = await axios.get(`/api/reviews/${sellerId}`);
  return res.data;
});

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => { state.loading = true; })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      });
  }
});

export default reviewsSlice.reducer;
