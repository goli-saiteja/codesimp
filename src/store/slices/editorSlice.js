// src/store/slices/editorSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import editorService from '../../services/editorService';

export const savePost = createAsyncThunk(
  'editor/savePost',
  async (postData, { rejectWithValue }) => {
    try {
      return await editorService.savePost(postData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save post');
    }
  }
);

export const loadPostForEditing = createAsyncThunk(
  'editor/loadPost',
  async (postId, { rejectWithValue }) => {
    try {
      return await editorService.getPostById(postId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load post');
    }
  }
);

export const uploadImage = createAsyncThunk(
  'editor/uploadImage',
  async (imageFile, { rejectWithValue }) => {
    try {
      return await editorService.uploadImage(imageFile);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload image');
    }
  }
);

// Version control features
export const saveVersion = createAsyncThunk(
  'editor/saveVersion',
  async ({ postId, versionName }, { rejectWithValue }) => {
    try {
      return await editorService.saveVersion(postId, versionName);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save version');
    }
  }
);

export const loadVersion = createAsyncThunk(
  'editor/loadVersion',
  async ({ postId, versionId }, { rejectWithValue }) => {
    try {
      return await editorService.loadVersion(postId, versionId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load version');
    }
  }
);

export const getVersionHistory = createAsyncThunk(
  'editor/getVersionHistory',
  async (postId, { rejectWithValue }) => {
    try {
      return await editorService.getVersionHistory(postId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get version history');
    }
  }
);

// Collaboration features
export const inviteCollaborator = createAsyncThunk(
  'editor/inviteCollaborator',
  async ({ postId, email, permission }, { rejectWithValue }) => {
    try {
      return await editorService.inviteCollaborator(postId, email, permission);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to invite collaborator');
    }
  }
);

const initialState = {
  // Core content
  content: '',
  title: '',
  subtitle: '',
  coverImage: null,
  tags: [],
  codeLanguages: [],
  
  // Post metadata
  postId: null,
  isDraft: true,
  isPublished: false,
  lastSaved: null,
  
  // UI state
  currentView: 'write', // 'write', 'preview', 'settings'
  activeSection: null,
  fontSize: 16,
  lineHeight: 1.6,
  showLineNumbers: true,
  wordCount: 0,
  readingTime: 0,
  isFullscreen: false,
  
  // Version control
  currentVersion: 'main',
  versionHistory: [],
  unsavedChanges: false,
  
  // Collaboration
  collaborators: [],
  activeCollaborators: [],
  userCursor: null,
  
  // Code editor specific
  codeSnippets: [],
  activeSnippet: null,
  
  // Async status
  loading: false,
  saveStatus: 'idle', // 'idle', 'saving', 'saved', 'error'
  error: null,
  success: false,
  message: '',
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    // Content updates
    updateContent: (state, action) => {
      state.content = action.payload;
      state.unsavedChanges = true;
      
      // Calculate word count and reading time
      const text = action.payload.replace(/<[^>]*>/g, ' ');
      const words = text.split(/\s+/).filter(Boolean);
      state.wordCount = words.length;
      state.readingTime = Math.ceil(state.wordCount / 200); // Assume 200 WPM reading speed
    },
    updateTitle: (state, action) => {
      state.title = action.payload;
      state.unsavedChanges = true;
    },
    updateSubtitle: (state, action) => {
      state.subtitle = action.payload;
      state.unsavedChanges = true;
    },
    setCoverImage: (state, action) => {
      state.coverImage = action.payload;
      state.unsavedChanges = true;
    },
    
    // Tag management
    addTag: (state, action) => {
      if (!state.tags.includes(action.payload) && state.tags.length < 5) {
        state.tags.push(action.payload);
        state.unsavedChanges = true;
      }
    },
    removeTag: (state, action) => {
      state.tags = state.tags.filter(tag => tag !== action.payload);
      state.unsavedChanges = true;
    },
    
    // Code handling
    addCodeSnippet: (state, action) => {
      const newSnippet = {
        id: `snippet-${Date.now()}`,
        code: action.payload.code || '',
        language: action.payload.language || 'javascript',
        title: action.payload.title || '',
        isExecutable: action.payload.isExecutable || false,
      };
      state.codeSnippets.push(newSnippet);
      state.activeSnippet = newSnippet.id;
      state.unsavedChanges = true;
    },
    updateCodeSnippet: (state, action) => {
      const index = state.codeSnippets.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.codeSnippets[index] = {
          ...state.codeSnippets[index],
          ...action.payload,
        };
        state.unsavedChanges = true;
      }
    },
    removeCodeSnippet: (state, action) => {
      state.codeSnippets = state.codeSnippets.filter(s => s.id !== action.payload);
      if (state.activeSnippet === action.payload) {
        state.activeSnippet = state.codeSnippets[0]?.id || null;
      }
      state.unsavedChanges = true;
    },
    setActiveSnippet: (state, action) => {
      state.activeSnippet = action.payload;
    },
    
    // UI state management
    toggleView: (state, action) => {
      state.currentView = action.payload;
    },
    setActiveSection: (state, action) => {
      state.activeSection = action.payload;
    },
    updateFontSize: (state, action) => {
      state.fontSize = action.payload;
    },
    updateLineHeight: (state, action) => {
      state.lineHeight = action.payload;
    },
    toggleLineNumbers: (state) => {
      state.showLineNumbers = !state.showLineNumbers;
    },
    toggleFullscreen: (state) => {
      state.isFullscreen = !state.isFullscreen;
    },
    
    // Version control
    createBranch: (state, action) => {
      state.currentVersion = action.payload;
      state.unsavedChanges = true;
    },
    switchBranch: (state, action) => {
      state.currentVersion = action.payload;
    },
    
    // Collaboration
    updateUserCursor: (state, action) => {
      state.userCursor = action.payload;
    },
    
    // State management
    resetEditor: () => initialState,
    clearEditorState: (state) => {
      state.content = '';
      state.title = '';
      state.subtitle = '';
      state.coverImage = null;
      state.tags = [];
      state.codeSnippets = [];
      state.activeSnippet = null;
      state.postId = null;
      state.isDraft = true;
      state.isPublished = false;
      state.lastSaved = null;
      state.unsavedChanges = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.message = '';
    },
    markSaved: (state) => {
      state.unsavedChanges = false;
      state.lastSaved = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    builder
      // Save post
      .addCase(savePost.pending, (state) => {
        state.saveStatus = 'saving';
      })
      .addCase(savePost.fulfilled, (state, action) => {
        state.saveStatus = 'saved';
        state.postId = action.payload.id;
        state.lastSaved = new Date().toISOString();
        state.unsavedChanges = false;
        state.success = true;
        state.message = action.payload.isPublished 
          ? 'Post published successfully' 
          : 'Draft saved successfully';
        state.isPublished = action.payload.isPublished;
        state.isDraft = !action.payload.isPublished;
      })
      .addCase(savePost.rejected, (state, action) => {
        state.saveStatus = 'error';
        state.error = action.payload;
      })
      
      // Load post for editing
      .addCase(loadPostForEditing.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadPostForEditing.fulfilled, (state, action) => {
        const post = action.payload;
        state.loading = false;
        state.content = post.content;
        state.title = post.title;
        state.subtitle = post.subtitle || '';
        state.coverImage = post.coverImage;
        state.tags = post.tags || [];
        state.codeSnippets = post.codeSnippets || [];
        state.activeSnippet = post.codeSnippets?.[0]?.id || null;
        state.postId = post.id;
        state.isDraft = !post.isPublished;
        state.isPublished = post.isPublished;
        state.lastSaved = post.updatedAt;
        state.unsavedChanges = false;
        state.versionHistory = post.versionHistory || [];
        state.collaborators = post.collaborators || [];
        
        // Calculate word count and reading time
        const text = post.content.replace(/<[^>]*>/g, ' ');
        const words = text.split(/\s+/).filter(Boolean);
        state.wordCount = words.length;
        state.readingTime = Math.ceil(state.wordCount / 200);
      })
      .addCase(loadPostForEditing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Upload image
      .addCase(uploadImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.loading = false;
        // The action will return the image URL which can be inserted into the content
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Version control
      .addCase(saveVersion.fulfilled, (state, action) => {
        state.versionHistory.push(action.payload);
        state.unsavedChanges = false;
        state.message = 'Version saved successfully';
        state.success = true;
      })
      .addCase(loadVersion.fulfilled, (state, action) => {
        state.content = action.payload.content;
        state.title = action.payload.title;
        state.subtitle = action.payload.subtitle || '';
        state.currentVersion = action.payload.versionId;
        state.unsavedChanges = false;
      })
      .addCase(getVersionHistory.fulfilled, (state, action) => {
        state.versionHistory = action.payload;
      })
      
      // Collaboration
      .addCase(inviteCollaborator.fulfilled, (state, action) => {
        state.collaborators.push(action.payload);
        state.success = true;
        state.message = 'Collaborator invited successfully';
      });
  },
});

export const {
  updateContent,
  updateTitle,
  updateSubtitle,
  setCoverImage,
  addTag,
  removeTag,
  addCodeSnippet,
  updateCodeSnippet,
  removeCodeSnippet,
  setActiveSnippet,
  toggleView,
  setActiveSection,
  updateFontSize,
  updateLineHeight,
  toggleLineNumbers,
  toggleFullscreen,
  createBranch,
  switchBranch,
  updateUserCursor,
  resetEditor,
  clearEditorState,
  clearError,
  clearSuccess,
  markSaved,
} = editorSlice.actions;

export default editorSlice.reducer;