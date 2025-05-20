// src/store/slices/postsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://api.codesource.com/v1';

// Async thunks
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/posts`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch posts');
    }
  }
);

export const fetchPostById = createAsyncThunk(
  'posts/fetchPostById',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/posts/${postId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch post');
    }
  }
);

export const likePost = createAsyncThunk(
  'posts/likePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/posts/${postId}/like`);
      return { postId, likes: response.data.likes };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to like post');
    }
  }
);

export const unlikePost = createAsyncThunk(
  'posts/unlikePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/posts/${postId}/like`);
      return { postId, likes: response.data.likes };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unlike post');
    }
  }
);

export const fetchPostComments = createAsyncThunk(
  'posts/fetchPostComments',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/posts/${postId}/comments`);
      return { postId, comments: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments');
    }
  }
);

export const addComment = createAsyncThunk(
  'posts/addComment',
  async ({ postId, content }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/posts/${postId}/comments`, { content });
      return { postId, comment: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
    }
  }
);

// Initial state
const initialState = {
  posts: [],
  currentPost: null,
  postComments: {},
  savedPosts: [],
  recentlyViewed: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    perPage: 10,
  },
  filters: {
    tags: [],
    author: null,
    sortBy: 'newest',
    language: null,
  }
};

// Create slice
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Local state operations
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1; // Reset to first page when filters change
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    addBookmark: (state, action) => {
      if (!state.savedPosts.includes(action.payload)) {
        state.savedPosts.push(action.payload);
        localStorage.setItem('savedPosts', JSON.stringify(state.savedPosts));
      }
    },
    removeBookmark: (state, action) => {
      state.savedPosts = state.savedPosts.filter(id => id !== action.payload);
      localStorage.setItem('savedPosts', JSON.stringify(state.savedPosts));
    },
    addToRecentlyViewed: (state, action) => {
      // Ensure no duplicates and maintain most recent at the beginning
      state.recentlyViewed = [
        action.payload,
        ...state.recentlyViewed.filter(id => id !== action.payload)
      ].slice(0, 10); // Keep only the 10 most recent
      
      localStorage.setItem('recentlyViewed', JSON.stringify(state.recentlyViewed));
    },
    clearError: (state) => {
      state.error = null;
    },
    initializeSavedPosts: (state) => {
      const savedPosts = localStorage.getItem('savedPosts');
      if (savedPosts) {
        try {
          state.savedPosts = JSON.parse(savedPosts);
        } catch (error) {
          console.error('Failed to parse saved posts:', error);
          state.savedPosts = [];
        }
      }
      
      const recentlyViewed = localStorage.getItem('recentlyViewed');
      if (recentlyViewed) {
        try {
          state.recentlyViewed = JSON.parse(recentlyViewed);
        } catch (error) {
          console.error('Failed to parse recently viewed posts:', error);
          state.recentlyViewed = [];
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalPosts: action.payload.totalPosts,
          perPage: action.payload.perPage,
        };
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch posts';
      })
      
      // Fetch post by ID
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch post';
      })
      
      // Like/unlike post
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, likes } = action.payload;
        
        // Update in posts list
        const postIndex = state.posts.findIndex(post => post.id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex].likes = likes;
        }
        
        // Update current post if it's the one being liked
        if (state.currentPost && state.currentPost.id === postId) {
          state.currentPost.likes = likes;
        }
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        const { postId, likes } = action.payload;
        
        // Update in posts list
        const postIndex = state.posts.findIndex(post => post.id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex].likes = likes;
        }
        
        // Update current post if it's the one being unliked
        if (state.currentPost && state.currentPost.id === postId) {
          state.currentPost.likes = likes;
        }
      })
      
      // Comments
      .addCase(fetchPostComments.fulfilled, (state, action) => {
        const { postId, comments } = action.payload;
        state.postComments[postId] = comments;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        
        // Initialize comments array if it doesn't exist
        if (!state.postComments[postId]) {
          state.postComments[postId] = [];
        }
        
        // Add new comment
        state.postComments[postId].push(comment);
        
        // Update comment count in posts list
        const postIndex = state.posts.findIndex(post => post.id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex].comments = (state.posts[postIndex].comments || 0) + 1;
        }
        
        // Update current post if it's the one being commented on
        if (state.currentPost && state.currentPost.id === postId) {
          state.currentPost.comments = (state.currentPost.comments || 0) + 1;
        }
      });
  },
});

// Export actions
export const { 
  setCurrentPage, 
  setFilters, 
  resetFilters, 
  addBookmark, 
  removeBookmark, 
  addToRecentlyViewed,
  clearError,
  initializeSavedPosts
} = postsSlice.actions;

export default postsSlice.reducer;