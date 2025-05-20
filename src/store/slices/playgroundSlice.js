// src/store/slices/playgroundSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://api.codesource.com/v1';

// Async thunks
export const fetchSnippets = createAsyncThunk(
  'playground/fetchSnippets',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/snippets`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch snippets');
    }
  }
);

export const fetchSnippetById = createAsyncThunk(
  'playground/fetchSnippetById',
  async (snippetId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/snippets/${snippetId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch snippet');
    }
  }
);

export const createSnippet = createAsyncThunk(
  'playground/createSnippet',
  async (snippetData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/snippets`, snippetData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create snippet');
    }
  }
);

export const updateSnippet = createAsyncThunk(
  'playground/updateSnippet',
  async ({ id, ...snippetData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/snippets/${id}`, snippetData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update snippet');
    }
  }
);

export const deleteSnippet = createAsyncThunk(
  'playground/deleteSnippet',
  async (snippetId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/snippets/${snippetId}`);
      return snippetId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete snippet');
    }
  }
);

export const executeCode = createAsyncThunk(
  'playground/executeCode',
  async ({ code, language, version }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/execute`, { code, language, version });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to execute code');
    }
  }
);

const initialState = {
  snippets: [],
  currentSnippet: null,
  executionResult: null,
  lastSavedSnippets: [],
  loading: false,
  executing: false,
  error: null,
  filters: {
    language: null,
    isPublic: null,
    sortBy: 'latest',
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalSnippets: 0,
    perPage: 10,
  },
};

const playgroundSlice = createSlice({
  name: 'playground',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1; // Reset to first page when filters change
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    clearExecutionResult: (state) => {
      state.executionResult = null;
    },
    updateCurrentSnippet: (state, action) => {
      state.currentSnippet = { ...state.currentSnippet, ...action.payload };
    },
    saveCodeSnippet: (state, action) => {
      // Save snippet locally
      const newSnippet = action.payload;
      
      // Avoid duplicates
      const existingIndex = state.lastSavedSnippets.findIndex(s => s.id === newSnippet.id);
      if (existingIndex !== -1) {
        state.lastSavedSnippets[existingIndex] = newSnippet;
      } else {
        state.lastSavedSnippets.unshift(newSnippet);
        
        // Keep only last 10 snippets
        state.lastSavedSnippets = state.lastSavedSnippets.slice(0, 10);
        
        // Save to localStorage
        localStorage.setItem('lastSavedSnippets', JSON.stringify(state.lastSavedSnippets));
      }
    },
    loadLastSavedSnippets: (state) => {
      try {
        const saved = localStorage.getItem('lastSavedSnippets');
        if (saved) {
          state.lastSavedSnippets = JSON.parse(saved);
        }
      } catch (error) {
        console.error('Failed to load saved snippets:', error);
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch snippets
      .addCase(fetchSnippets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSnippets.fulfilled, (state, action) => {
        state.loading = false;
        state.snippets = action.payload.snippets;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalSnippets: action.payload.totalSnippets,
          perPage: action.payload.perPage,
        };
      })
      .addCase(fetchSnippets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch snippets';
      })
      
      // Fetch snippet by id
      .addCase(fetchSnippetById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSnippetById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSnippet = action.payload;
      })
      .addCase(fetchSnippetById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch snippet';
      })
      
      // Create snippet
      .addCase(createSnippet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSnippet.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSnippet = action.payload;
        state.snippets.unshift(action.payload);
        state.lastSavedSnippets.unshift(action.payload);
        
        // Keep only last 10 snippets
        state.lastSavedSnippets = state.lastSavedSnippets.slice(0, 10);
        
        // Save to localStorage
        localStorage.setItem('lastSavedSnippets', JSON.stringify(state.lastSavedSnippets));
      })
      .addCase(createSnippet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create snippet';
      })
      
      // Update snippet
      .addCase(updateSnippet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSnippet.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSnippet = action.payload;
        
        // Update in snippets list
        const index = state.snippets.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.snippets[index] = action.payload;
        }
        
        // Update in saved snippets
        const savedIndex = state.lastSavedSnippets.findIndex(s => s.id === action.payload.id);
        if (savedIndex !== -1) {
          state.lastSavedSnippets[savedIndex] = action.payload;
          localStorage.setItem('lastSavedSnippets', JSON.stringify(state.lastSavedSnippets));
        }
      })
      .addCase(updateSnippet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update snippet';
      })
      
      // Delete snippet
      .addCase(deleteSnippet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSnippet.fulfilled, (state, action) => {
        state.loading = false;
        state.snippets = state.snippets.filter(s => s.id !== action.payload);
        state.lastSavedSnippets = state.lastSavedSnippets.filter(s => s.id !== action.payload);
        
        // Save to localStorage
        localStorage.setItem('lastSavedSnippets', JSON.stringify(state.lastSavedSnippets));
        
        // Clear current snippet if it's the one being deleted
        if (state.currentSnippet && state.currentSnippet.id === action.payload) {
          state.currentSnippet = null;
        }
      })
      .addCase(deleteSnippet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete snippet';
      })
      
      // Execute code
      .addCase(executeCode.pending, (state) => {
        state.executing = true;
        state.executionResult = null;
        state.error = null;
      })
      .addCase(executeCode.fulfilled, (state, action) => {
        state.executing = false;
        state.executionResult = action.payload;
      })
      .addCase(executeCode.rejected, (state, action) => {
        state.executing = false;
        state.error = action.payload || 'Failed to execute code';
        state.executionResult = {
          output: action.payload || 'Execution failed',
          status: 'error',
          executionTime: 0,
          memoryUsage: 0,
        };
      });
  },
});

export const {
  setFilters,
  resetFilters,
  setCurrentPage,
  clearExecutionResult,
  updateCurrentSnippet,
  saveCodeSnippet,
  loadLastSavedSnippets,
  clearError,
} = playgroundSlice.actions;

export default playgroundSlice.reducer;