import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base API
const API = 'http://localhost:5000/api/profile';

// Auth headers
const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

// Thunks
export const fetchUserProfile = createAsyncThunk('user/fetchProfile', async (_, thunkAPI) => {
  try {
    const res = await axios.get(`${API}/me`, getAuthHeaders());
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch profile');
  }
});

export const updateUserProfile = createAsyncThunk('user/updateProfile', async (profileData, thunkAPI) => {
  try {
    const res = await axios.put(`${API}/update`, profileData, getAuthHeaders());
    return res.data.user;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update profile');
  }
});

export const deleteUserAccount = createAsyncThunk('user/deleteAccount', async (_, thunkAPI) => {
  try {
    const res = await axios.delete(`${API}/delete`, getAuthHeaders());
    return res.data.message; // ✅ return the message
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to delete account');
  }
});


// Slice
const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetProfile(state) {
      state.profile = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Profile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Delete Account
      .addCase(deleteUserAccount.fulfilled, (state) => {
        state.profile = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteUserAccount.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { resetProfile } = userSlice.actions;
export default userSlice.reducer;
