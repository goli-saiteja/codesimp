import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';

// Import slices
import authSlice from './slices/authSlice';
import articleSlice from './slices/articleSlice';
import editorSlice from './slices/editorSlice';
import uiSlice from './slices/uiSlice';
import userSlice from './slices/userSlice';
import searchSlice from './slices/searchSlice';

// Configure persist options
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'user'], // Only persist auth and user state
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authSlice,
  articles: articleSlice,
  editor: editorSlice,
  ui: uiSlice,
  user: userSlice,
  search: searchSlice,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
  devTools: process.env.NODE_ENV !== 'production',
});

// Create persistor
export const persistor = persistStore(store);

export default { store, persistor };