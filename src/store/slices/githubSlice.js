// src/store/slices/githubSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://api.codesource.com/v1';

// Async thunks
export const connectGitHub = createAsyncThunk(
  'github/connect',
  async (accessToken, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/github/connect`, { accessToken });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to connect GitHub account');
    }
  }
);

export const disconnectGitHub = createAsyncThunk(
  'github/disconnect',
  async (_, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/github/disconnect`);
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to disconnect GitHub account');
    }
  }
);

export const fetchRepositories = createAsyncThunk(
  'github/fetchRepositories',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/github/repositories`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch repositories');
    }
  }
);

export const fetchRepository = createAsyncThunk(
  'github/fetchRepository',
  async (repoName, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/github/repositories/${repoName}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch repository');
    }
  }
);

export const importRepository = createAsyncThunk(
  'github/importRepository',
  async ({ repoName, options }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/github/import`, { repoName, ...options });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to import repository');
    }
  }
);

export const syncRepository = createAsyncThunk(
  'github/syncRepository',
  async (repoName, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/github/sync/${repoName}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to sync repository');
    }
  }
);

export const fetchGists = createAsyncThunk(
  'github/fetchGists',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/github/gists`, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch gists');
    }
  }
);

export const createGist = createAsyncThunk(
  'github/createGist',
  async (gistData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/github/gists`, gistData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create gist');
    }
  }
);

const initialState = {
  connected: false,
  profile: null,
  repositories: [],
  currentRepository: null,
  gists: [],
  importHistory: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 10,
  },
};

const githubSlice = createSlice({
  name: 'github',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Connect GitHub
      .addCase(connectGitHub.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(connectGitHub.fulfilled, (state, action) => {
        state.loading = false;
        state.connected = true;
        state.profile = action.payload.profile;
      })
      .addCase(connectGitHub.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to connect GitHub account';
      })
      
      // Disconnect GitHub
      .addCase(disconnectGitHub.fulfilled, (state) => {
        state.connected = false;
        state.profile = null;
        state.repositories = [];
        state.currentRepository = null;
        state.gists = [];
      })
      
      // Fetch repositories
      .addCase(fetchRepositories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRepositories.fulfilled, (state, action) => {
        state.loading = false;
        state.repositories = action.payload.repositories;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.totalItems,
          perPage: action.payload.perPage,
        };
      })
      .addCase(fetchRepositories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch repositories';
      })
      
      // Fetch repository
      .addCase(fetchRepository.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRepository.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRepository = action.payload;
      })
      .addCase(fetchRepository.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch repository';
      })
      
      // Import repository
      .addCase(importRepository.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(importRepository.fulfilled, (state, action) => {
        state.loading = false;
        state.importHistory.unshift(action.payload);
      })
      .addCase(importRepository.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to import repository';
      })
      
      // Sync repository
      .addCase(syncRepository.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncRepository.fulfilled, (state, action) => {
        state.loading = false;
        // Update repository in the list
        const index = state.repositories.findIndex(repo => repo.name === action.payload.name);
        if (index !== -1) {
          state.repositories[index] = action.payload;
        }
        // Update current repository if it's the one being synced
        if (state.currentRepository && state.currentRepository.name === action.payload.name) {
          state.currentRepository = action.payload;
        }
      })
      .addCase(syncRepository.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to sync repository';
      })
      
      // Fetch gists
      .addCase(fetchGists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGists.fulfilled, (state, action) => {
        state.loading = false;
        state.gists = action.payload.gists;
      })
      .addCase(fetchGists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch gists';
      })
      
      // Create gist
      .addCase(createGist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGist.fulfilled, (state, action) => {
        state.loading = false;
        state.gists.unshift(action.payload);
      })
      .addCase(createGist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create gist';
      });
  },
});

export const { clearError, setCurrentPage } = githubSlice.actions;

export default githubSlice.reducer;