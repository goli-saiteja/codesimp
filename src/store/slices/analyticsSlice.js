// src/store/slices/analyticsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://api.codesource.com/v1';

// Async thunks
export const fetchUserAnalytics = createAsyncThunk(
  'analytics/fetchUserAnalytics',
  async (period = '30d', { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/analytics/user`, { params: { period } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user analytics');
    }
  }
);

export const fetchPostAnalytics = createAsyncThunk(
  'analytics/fetchPostAnalytics',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/analytics/posts/${postId}`);
      return { postId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch post analytics');
    }
  }
);

export const fetchTopPosts = createAsyncThunk(
  'analytics/fetchTopPosts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/analytics/top-posts`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch top posts');
    }
  }
);

export const fetchAudienceData = createAsyncThunk(
  'analytics/fetchAudienceData',
  async (period = '30d', { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/analytics/audience`, { params: { period } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch audience data');
    }
  }
);

const initialState = {
  userAnalytics: null,
  postAnalytics: {},
  topPosts: [],
  audienceData: null,
  loading: false,
  error: null,
  selectedPeriod: '30d',
  dashboard: {
    views: { total: 0, trend: 0 },
    likes: { total: 0, trend: 0 },
    comments: { total: 0, trend: 0 },
    followers: { total: 0, trend: 0 },
  },
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setPeriod: (state, action) => {
      state.selectedPeriod = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // User analytics
      .addCase(fetchUserAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.userAnalytics = action.payload;
        
        // Update dashboard summary
        if (action.payload.summary) {
          state.dashboard = {
            views: { 
              total: action.payload.summary.views.total, 
              trend: action.payload.summary.views.trend 
            },
            likes: { 
              total: action.payload.summary.likes.total, 
              trend: action.payload.summary.likes.trend 
            },
            comments: { 
              total: action.payload.summary.comments.total, 
              trend: action.payload.summary.comments.trend 
            },
            followers: { 
              total: action.payload.summary.followers.total, 
              trend: action.payload.summary.followers.trend 
            },
          };
        }
      })
      .addCase(fetchUserAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user analytics';
      })
      
      // Post analytics
      .addCase(fetchPostAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.postAnalytics[action.payload.postId] = action.payload.data;
      })
      .addCase(fetchPostAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch post analytics';
      })
      
      // Top posts
      .addCase(fetchTopPosts.fulfilled, (state, action) => {
        state.topPosts = action.payload;
      })
      
      // Audience data
      .addCase(fetchAudienceData.fulfilled, (state, action) => {
        state.audienceData = action.payload;
      });
  },
});

export const { setPeriod, clearError } = analyticsSlice.actions;

export default analyticsSlice.reducer;