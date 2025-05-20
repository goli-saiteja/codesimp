// src/App.js
import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDarkMode } from './store/slices/uiSlice';

// Layout components
import MainLayout from './components/layout/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import EditorPage from './pages/EditorPage';
import PostDetailPage from './pages/PostDetailPage';
import ProfilePage from './pages/ProfilePage';
import ExploreTopicsPage from './pages/ExploreTopicsPage';
import BookmarksPage from './pages/BookmarksPage';
import SettingsPage from './pages/SettingsPage';
import AuthPage from './pages/AuthPage';
import NotFoundPage from './pages/NotFoundPage';
import AnalyticsDashboardPage from './pages/AnalyticsDashboardPage';
import CodePlaygroundPage from './pages/CodePlaygroundPage';
import GitHubIntegrationPage from './pages/GitHubIntegrationPage';

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { darkMode } = useSelector(state => state.ui);
  const { isAuthenticated } = useSelector(state => state.auth);

  // Apply dark mode to body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="post/:postId" element={<PostDetailPage />} />
          <Route path="topic/:topicId" element={<ExploreTopicsPage />} />
          <Route path="playground/:snippetId?" element={<CodePlaygroundPage />} />
          <Route path="explore" element={<ExploreTopicsPage />} />
          <Route path="github-integration" element={<GitHubIntegrationPage />} />
          
          {/* Protected routes */}
          <Route path="new-story" element={isAuthenticated ? <EditorPage /> : <AuthPage />} />
          <Route path="edit/:postId" element={isAuthenticated ? <EditorPage /> : <AuthPage />} />
          <Route path="profile/:userId" element={<ProfilePage />} />
          <Route path="bookmarks" element={isAuthenticated ? <BookmarksPage /> : <AuthPage />} />
          <Route path="settings" element={isAuthenticated ? <SettingsPage /> : <AuthPage />} />
          <Route path="analytics" element={isAuthenticated ? <AnalyticsDashboardPage /> : <AuthPage />} />
        </Route>
        
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;