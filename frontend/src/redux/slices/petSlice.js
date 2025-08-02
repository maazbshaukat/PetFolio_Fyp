import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// -------------------------
// Async Thunks
// -------------------------

export const addPet = createAsyncThunk('pet/addPet', async (formData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.post('http://localhost:5000/api/pets/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(
      err.response?.data?.message || 'An error occurred while adding the pet.'
    );
  }
});

export const fetchMyAds = createAsyncThunk('pet/fetchMyAds', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:5000/api/pets/my-ads', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch your ads.');
  }
});

export const deleteAd = createAsyncThunk('pet/deleteAd', async (id, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:5000/api/pets/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete ad.');
  }
});

export const getPetById = createAsyncThunk('pet/getPetById', async (id, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get(`http://localhost:5000/api/pets/details/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    return rejectWithValue('Failed to fetch pet data');
  }
});

export const editPet = createAsyncThunk(
  'pet/editPet',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:5000/api/pets/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue('Failed to update pet');
    }
  }
);

// -------------------------
// Slice
// -------------------------

const petSlice = createSlice({
  name: 'pet',
  initialState: {
    ads: [],
    selectedPet: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearPetState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
      state.selectedPet = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Add Pet
      .addCase(addPet.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addPet.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
      })
      .addCase(addPet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch My Ads
      .addCase(fetchMyAds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyAds.fulfilled, (state, action) => {
        state.loading = false;
        state.ads = action.payload;
      })
      .addCase(fetchMyAds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Ad
      .addCase(deleteAd.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAd.fulfilled, (state, action) => {
        state.loading = false;
        state.ads = state.ads.filter((ad) => ad._id !== action.payload);
        state.success = 'Ad deleted successfully';
      })
      .addCase(deleteAd.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Pet By ID
      .addCase(getPetById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedPet = null;
      })
      .addCase(getPetById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPet = action.payload;
      })
      .addCase(getPetById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Edit Pet
      .addCase(editPet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editPet.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        // Update the ad in-place
        const index = state.ads.findIndex((ad) => ad._id === action.payload.pet._id);
        if (index !== -1) state.ads[index] = action.payload.pet;
      })
      .addCase(editPet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPetState } = petSlice.actions;
export default petSlice.reducer;
