// src/pages/ProfilePage.jsx
import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DeveloperProfile from '../components/user/DeveloperProfile';
import { useGetUserProfileQuery } from '../services/apiService';

const ProfilePage = () => {
  const { userId } = useParams();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  // Fetch user data
  const { data: userData, isLoading, error } = useGetUserProfileQuery(userId);
  
  // Check if viewing own profile
  const isOwnProfile = isAuthenticated && user?.id === userId;
  
  // Set page title
  useEffect(() => {
    document.title = userData 
      ? `${userData.name} - CodeSource Profile` 
      : 'Developer Profile - CodeSource';
    
    return () => {
      document.title = 'CodeSource';
    };
  }, [userData]);
  
  if (error && error.status === 404) {
    return <Navigate to="/not-found" />;
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="sr-only">Developer Profile</h1>
      
      {isLoading ? (
        <div className="animate-pulse space-y-8">
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
        </div>
      ) : (
        <DeveloperProfile 
          userId={userId} 
          compact={false}
        />
      )}
      
      {/* SEO metadata */}
      {userData && (
        <div className="hidden">
          <h2>{userData.name}</h2>
          <p>{userData.headline}</p>
          <p>Developer profile for {userData.name}, specializing in {userData.skills?.map(s => s.name).join(', ')}.</p>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;