// src/store/slices/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://api.codesource.com/v1';

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user profile');
    }
  }
);

export const followUser = createAsyncThunk(
  'user/followUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/users/${userId}/follow`);
      return { userId, followers: response.data.followers };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to follow user');
    }
  }
);

export const unfollowUser = createAsyncThunk(
  'user/unfollowUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/users/${userId}/follow`);
      return { userId, followers: response.data.followers };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unfollow user');
    }
  }
);

export const fetchUserFollowers = createAsyncThunk(
  'user/fetchUserFollowers',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}/followers`);
      return { userId, followers: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch followers');
    }
  }
);

export const fetchUserFollowing = createAsyncThunk(
  'user/fetchUserFollowing',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}/following`);
      return { userId, following: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch following');
    }
  }
);

const initialState = {
  currentProfile: null,
  userProfiles: {},
  followers: {},
  following: {},
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserProfile: (state) => {
      state.currentProfile = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProfile = action.payload;
        state.userProfiles[action.payload.id] = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user profile';
      })
      
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProfile = action.payload;
        state.userProfiles[action.payload.id] = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update user profile';
      })
      
      // Follow user
      .addCase(followUser.fulfilled, (state, action) => {
        const { userId, followers } = action.payload;
        
        // Update followers count in profiles if exists
        if (state.userProfiles[userId]) {
          state.userProfiles[userId].followers = followers;
        }
        
        if (state.currentProfile && state.currentProfile.id === userId) {
          state.currentProfile.followers = followers;
        }
      })
      
      // Unfollow user
      .addCase(unfollowUser.fulfilled, (state, action) => {
        const { userId, followers } = action.payload;
        
        // Update followers count in profiles if exists
        if (state.userProfiles[userId]) {
          state.userProfiles[userId].followers = followers;
        }
        
        if (state.currentProfile && state.currentProfile.id === userId) {
          state.currentProfile.followers = followers;
        }
      })
      
      // Fetch followers
      .addCase(fetchUserFollowers.fulfilled, (state, action) => {
        const { userId, followers } = action.payload;
        state.followers[userId] = followers;
      })
      
      // Fetch following
      .addCase(fetchUserFollowing.fulfilled, (state, action) => {
        const { userId, following } = action.payload;
        state.following[userId] = following;
      });
  },
});

export const { clearUserProfile, clearError } = userSlice.actions;

export default userSlice.reducer;