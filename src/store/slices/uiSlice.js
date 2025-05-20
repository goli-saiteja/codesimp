// src/store/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Get system preference for dark mode
const getSystemColorScheme = () => {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// Initialize dark mode from localStorage or system preference
const initializeDarkMode = () => {
  const savedMode = localStorage.getItem('darkMode');
  if (savedMode === null) {
    return getSystemColorScheme();
  }
  return savedMode === 'true';
};

// Themes for code editor and syntax highlighting
const codeThemes = {
  light: [
    { id: 'github-light', name: 'GitHub Light' },
    { id: 'vs-light', name: 'Visual Studio Light' },
    { id: 'xcode-light', name: 'Xcode Light' },
    { id: 'solarized-light', name: 'Solarized Light' },
  ],
  dark: [
    { id: 'github-dark', name: 'GitHub Dark' },
    { id: 'vs-dark', name: 'Visual Studio Dark' },
    { id: 'one-dark-pro', name: 'One Dark Pro' },
    { id: 'dracula', name: 'Dracula' },
    { id: 'monokai', name: 'Monokai' },
    { id: 'nord', name: 'Nord' },
  ],
};

const initialState = {
  // Theme settings
  darkMode: initializeDarkMode(),
  accentColor: '#7c3aed', // Default accent color
  fontFamily: {
    body: 'Inter, system-ui, sans-serif',
    code: 'JetBrains Mono, monospace',
    heading: 'Inter, system-ui, sans-serif',
  },
  fontSize: 'medium', // 'small', 'medium', 'large'
  codeTheme: initializeDarkMode() ? 'one-dark-pro' : 'github-light',
  availableCodeThemes: codeThemes,
  
  // Layout settings
  sidebarOpen: true,
  sidebarWidth: 240,
  rightPanelOpen: false,
  rightPanelWidth: 300,
  navbarHeight: 60,
  fullscreen: false,
  
  // Toast notifications
  toasts: [],
  
  // Modal management
  activeModal: null, // null or id of the active modal
  modalProps: {},
  
  // UI States for different sections
  homeView: 'featured', // 'featured', 'recent', 'following', 'trending'
  currentTab: 'posts', // 'posts', 'series', 'collections', 'bookmarks', etc.
  
  // Responsive layout breakpoints
  isMobile: window.innerWidth < 768,
  isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
  isDesktop: window.innerWidth >= 1024,
  
  // User preferences
  compactView: false,
  enableAnimations: true,
  enableSoundEffects: true,
  highContrastMode: false,
  reduceMotion: false,
  
  // Reading experience
  readerMode: false,
  readerFontSize: 18,
  readerLineHeight: 1.8,
  readerMargin: 'medium', // 'narrow', 'medium', 'wide'
  
  // Code display preferences
  codeFontSize: 14,
  codeLineHeight: 1.5,
  showLineNumbers: true,
  wrapCode: false,
  
  // Network status
  isOnline: navigator.onLine,
  
  // Command palette
  commandPaletteOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme settings
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', state.darkMode);
      
      // Update code theme based on dark mode
      if (state.darkMode && codeThemes.light.some(theme => theme.id === state.codeTheme)) {
        state.codeTheme = 'one-dark-pro';
      } else if (!state.darkMode && codeThemes.dark.some(theme => theme.id === state.codeTheme)) {
        state.codeTheme = 'github-light';
      }
    },
    setAccentColor: (state, action) => {
      state.accentColor = action.payload;
      localStorage.setItem('accentColor', action.payload);
    },
    setFontFamily: (state, action) => {
      state.fontFamily = { ...state.fontFamily, ...action.payload };
      localStorage.setItem('fontFamily', JSON.stringify(state.fontFamily));
    },
    setFontSize: (state, action) => {
      state.fontSize = action.payload;
      localStorage.setItem('fontSize', action.payload);
    },
    setCodeTheme: (state, action) => {
      state.codeTheme = action.payload;
      localStorage.setItem('codeTheme', action.payload);
    },
    
    // Layout controls
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarWidth: (state, action) => {
      state.sidebarWidth = action.payload;
    },
    toggleRightPanel: (state) => {
      state.rightPanelOpen = !state.rightPanelOpen;
    },
    setRightPanelWidth: (state, action) => {
      state.rightPanelWidth = action.payload;
    },
    toggleFullscreen: (state) => {
      state.fullscreen = !state.fullscreen;
    },
    
    // Toast notifications
    addToast: (state, action) => {
      const id = Date.now().toString();
      state.toasts.push({
        id,
        ...action.payload,
        createdAt: new Date().toISOString(),
      });
      return state;
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    clearAllToasts: (state) => {
      state.toasts = [];
    },
    
    // Modal management
    openModal: (state, action) => {
      state.activeModal = action.payload.modalId;
      state.modalProps = action.payload.props || {};
    },
    closeModal: (state) => {
      state.activeModal = null;
      state.modalProps = {};
    },
    
    // UI state changes
    setHomeView: (state, action) => {
      state.homeView = action.payload;
    },
    setCurrentTab: (state, action) => {
      state.currentTab = action.payload;
    },
    
    // Responsive layout updates
    updateScreenSize: (state) => {
      state.isMobile = window.innerWidth < 768;
      state.isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      state.isDesktop = window.innerWidth >= 1024;
    },
    
    // User preferences
    toggleCompactView: (state) => {
      state.compactView = !state.compactView;
      localStorage.setItem('compactView', state.compactView);
    },
    toggleAnimations: (state) => {
      state.enableAnimations = !state.enableAnimations;
      localStorage.setItem('enableAnimations', state.enableAnimations);
    },
    toggleSoundEffects: (state) => {
      state.enableSoundEffects = !state.enableSoundEffects;
      localStorage.setItem('enableSoundEffects', state.enableSoundEffects);
    },
    toggleHighContrastMode: (state) => {
      state.highContrastMode = !state.highContrastMode;
      localStorage.setItem('highContrastMode', state.highContrastMode);
    },
    toggleReduceMotion: (state) => {
      state.reduceMotion = !state.reduceMotion;
      localStorage.setItem('reduceMotion', state.reduceMotion);
    },
    
    // Reading experience
    toggleReaderMode: (state) => {
      state.readerMode = !state.readerMode;
    },
    setReaderFontSize: (state, action) => {
      state.readerFontSize = action.payload;
      localStorage.setItem('readerFontSize', action.payload);
    },
    setReaderLineHeight: (state, action) => {
      state.readerLineHeight = action.payload;
      localStorage.setItem('readerLineHeight', action.payload);
    },
    setReaderMargin: (state, action) => {
      state.readerMargin = action.payload;
      localStorage.setItem('readerMargin', action.payload);
    },
    
    // Code display preferences
    setCodeFontSize: (state, action) => {
      state.codeFontSize = action.payload;
      localStorage.setItem('codeFontSize', action.payload);
    },
    setCodeLineHeight: (state, action) => {
      state.codeLineHeight = action.payload;
      localStorage.setItem('codeLineHeight', action.payload);
    },
    toggleLineNumbers: (state) => {
      state.showLineNumbers = !state.showLineNumbers;
      localStorage.setItem('showLineNumbers', state.showLineNumbers);
    },
    toggleWrapCode: (state) => {
      state.wrapCode = !state.wrapCode;
      localStorage.setItem('wrapCode', state.wrapCode);
    },
    
    // Network status
    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },
    
    // Command palette
    toggleCommandPalette: (state) => {
      state.commandPaletteOpen = !state.commandPaletteOpen;
    },
    closeCommandPalette: (state) => {
      state.commandPaletteOpen = false;
    },
  },
});

export const {
  // Theme settings
  toggleDarkMode,
  setAccentColor,
  setFontFamily,
  setFontSize,
  setCodeTheme,
  
  // Layout controls
  toggleSidebar,
  setSidebarWidth,
  toggleRightPanel,
  setRightPanelWidth,
  toggleFullscreen,
  
  // Toast notifications
  addToast,
  removeToast,
  clearAllToasts,
  
  // Modal management
  openModal,
  closeModal,
  
  // UI state changes
  setHomeView,
  setCurrentTab,
  
  // Responsive layout updates
  updateScreenSize,
  
  // User preferences
  toggleCompactView,
  toggleAnimations,
  toggleSoundEffects,
  toggleHighContrastMode,
  toggleReduceMotion,
  
  // Reading experience
  toggleReaderMode,
  setReaderFontSize,
  setReaderLineHeight,
  setReaderMargin,
  
  // Code display preferences
  setCodeFontSize,
  setCodeLineHeight,
  toggleLineNumbers,
  toggleWrapCode,
  
  // Network status
  setOnlineStatus,
  
  // Command palette
  toggleCommandPalette,
  closeCommandPalette,
} = uiSlice.actions;

export default uiSlice.reducer;