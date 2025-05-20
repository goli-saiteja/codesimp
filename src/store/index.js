// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

// Import reducers
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import editorReducer from './slices/editorSlice';
import postsReducer from './slices/postsSlice';
import userReducer from './slices/userSlice';
import analyticsReducer from './slices/analyticsSlice';
import searchReducer from './slices/searchSlice';
import notificationsReducer from './slices/notificationsSlice';
import playgroundReducer from './slices/playgroundSlice';
import githubReducer from './slices/githubSlice';

// Import API services
import { apiService } from '../services/apiService';

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    editor: editorReducer,
    posts: postsReducer,
    user: userReducer,
    analytics: analyticsReducer,
    search: searchReducer,
    notifications: notificationsReducer,
    playground: playgroundReducer,
    github: githubReducer,
    [apiService.reducerPath]: apiService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiService.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Setup listeners for RTK Query
setupListeners(store.dispatch);

export default store;