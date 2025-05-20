// src/store/slices/searchSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://api.codesource.com/v1';

// Async thunks
export const searchContent = createAsyncThunk(
  'search/searchContent',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/search`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Search failed');
    }
  }
);

export const fetchSearchSuggestions = createAsyncThunk(
  'search/fetchSuggestions',
  async (query, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/search/suggestions`, { params: { q: query } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch suggestions');
    }
  }
);

export const fetchTrendingSearches = createAsyncThunk(
  'search/fetchTrending',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/search/trending`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch trending searches');
    }
  }
);

const initialState = {
  searchQuery: '',
  filters: {
    contentType: null,
    language: null,
    dateRange: null,
    level: null,
  },
  results: [],
  suggestions: [],
  trending: [],
  recentSearches: [],
  totalResults: 0,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
  },
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearSearch: (state) => {
      state.searchQuery = '';
      state.results = [];
      state.totalResults = 0;
    },
    setSearchFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetSearchFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSearchPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    addRecentSearch: (state, action) => {
      // Add to recent searches avoiding duplicates
      state.recentSearches = [
        action.payload,
        ...state.recentSearches.filter(item => item !== action.payload)
      ].slice(0, 10); // Keep only 10 most recent searches
      
      // Save to localStorage
      localStorage.setItem('recentSearches', JSON.stringify(state.recentSearches));
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
      localStorage.removeItem('recentSearches');
    },
    loadRecentSearches: (state) => {
      try {
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
          state.recentSearches = JSON.parse(saved);
        }
      } catch (error) {
        console.error('Failed to load recent searches:', error);
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Search content
      .addCase(searchContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchContent.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.results;
        state.totalResults = action.payload.total;
        state.pagination = {
          currentPage: action.payload.page,
          totalPages: action.payload.totalPages,
          perPage: action.payload.perPage,
        };
      })
      .addCase(searchContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Search failed';
      })
      
      // Fetch suggestions
      .addCase(fetchSearchSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload;
      })
      
      // Fetch trending searches
      .addCase(fetchTrendingSearches.fulfilled, (state, action) => {
        state.trending = action.payload;
      });
  },
});

export const {
  setSearchQuery,
  clearSearch,
  setSearchFilters,
  resetSearchFilters,
  setSearchPage,
  addRecentSearch,
  clearRecentSearches,
  loadRecentSearches,
  clearError,
} = searchSlice.actions;

export default searchSlice.reducer;