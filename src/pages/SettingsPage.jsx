// src/pages/SettingsPage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  User, Bell, Lock, Palette, Terminal, GitHub, Monitor,
  Shield, Key, Database, Save, Loader, CheckCircle, Globe,
  AlertCircle, RefreshCw, Upload, Trash2
} from 'lucide-react';
import { updateUserProfile } from '../store/slices/authSlice';
import { 
  toggleDarkMode, setCodeTheme, setFontSize, 
  toggleLineNumbers, toggleWrapCode 
} from '../store/slices/uiSlice';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { user, loading, error, success } = useSelector(state => state.auth);
  const { 
    darkMode, fontSize, codeTheme, availableCodeThemes, 
    showLineNumbers, wrapCode 
  } = useSelector(state => state.ui);
  
  // Active tab state
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    headline: user?.headline || '',
    bio: user?.bio || '',
    location: user?.location || '',
    company: user?.company || '',
    website: user?.website || '',
    github: user?.github || '',
    twitter: user?.twitter || '',
    avatar: user?.avatar || null,
    coverImage: user?.coverImage || null,
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    commentNotifications: true,
    followNotifications: true,
    mentionNotifications: true,
    newsletterSubscription: false,
  });
  
  // Security state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twoFactorEnabled || false);
  
  // Feedback states
  const [saved, setSaved] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  
  // Set page title
  useEffect(() => {
    document.title = 'Settings - CodeSource';
    return () => {
      document.title = 'CodeSource';
    };
  }, []);
  
  // Update profile data when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        headline: user.headline || '',
        bio: user.bio || '',
        location: user.location || '',
        company: user.company || '',
        website: user.website || '',
        github: user.github || '',
        twitter: user.twitter || '',
        avatar: user.avatar || null,
        coverImage: user.coverImage || null,
      });
    }
  }, [user]);
  
  // Reset saved state after 3 seconds
  useEffect(() => {
    if (saved) {
      const timeout = setTimeout(() => setSaved(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [saved]);
  
  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle notification setting changes
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({ ...prev, [name]: checked }));
  };
  
  // Handle avatar upload
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingAvatar(true);
    
    // Simulate file upload - in a real app, you'd upload to a server
    setTimeout(() => {
      // Create a data URL for preview
      const reader = new FileReader();
      reader.onload = () => {
        setProfileData(prev => ({ ...prev, avatar: reader.result }));
        setUploadingAvatar(false);
      };
      reader.readAsDataURL(file);
    }, 1000);
  };
  
  // Handle cover image upload
  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingCover(true);
    
    // Simulate file upload - in a real app, you'd upload to a server
    setTimeout(() => {
      // Create a data URL for preview
      const reader = new FileReader();
      reader.onload = () => {
        setProfileData(prev => ({ ...prev, coverImage: reader.result }));
        setUploadingCover(false);
      };
      reader.readAsDataURL(file);
    }, 1000);
  };
  
  // Save profile changes
  const handleSaveProfile = () => {
    dispatch(updateUserProfile({
      userId: user.id,
      ...profileData
    }));
    setSaved(true);
  };
  
  // Render active tab content
  const renderTabContent = () => {
    switch(activeTab) {
      case 'profile':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
            
            {/* Profile form */}
            <div className="space-y-6">
              {/* Avatar and cover image */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Avatar upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Profile Picture
                  </label>
                  <div className="flex items-center">
                    <div className="relative mr-4">
                      <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        {profileData.avatar ? (
                          <img 
                            src={profileData.avatar} 
                            alt={profileData.name} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User size={32} className="text-gray-400" />
                        )}
                      </div>
                      {uploadingAvatar && (
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                          <RefreshCw size={20} className="text-white animate-spin" />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                        <Upload size={16} className="mr-2" />
                        Upload Image
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleAvatarUpload}
                        />
                      </label>
                      {profileData.avatar && (
                        <button
                          type="button"
                          className="ml-2 text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400"
                          onClick={() => setProfileData(prev => ({ ...prev, avatar: null }))}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Cover image upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cover Image
                  </label>
                  <div className="relative mb-2">
                    <div className="aspect-[3/1] rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      {profileData.coverImage ? (
                        <img 
                          src={profileData.coverImage} 
                          alt="Cover" 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">No cover image</span>
                      )}
                    </div>
                    {uploadingCover && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <RefreshCw size={24} className="text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="flex">
                    <label className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                      <Upload size={16} className="mr-2" />
                      Upload Cover
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleCoverUpload}
                      />
                    </label>
                    {profileData.coverImage && (
                      <button
                        type="button"
                        className="ml-2 text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400"
                        onClick={() => setProfileData(prev => ({ ...prev, coverImage: null }))}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Basic info */}
              <div className="space-y-4">
                {/* Full name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-900"
                  />
                </div>
                
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-900"
                    disabled
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Email cannot be changed directly. Contact support for email changes.
                  </p>
                </div>
                
                {/* Headline */}
                <div>
                  <label htmlFor="headline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Headline
                  </label>
                  <input
                    type="text"
                    id="headline"
                    name="headline"
                    value={profileData.headline}
                    onChange={handleProfileChange}
                    placeholder="Frontend Developer | React Specialist | JavaScript Enthusiast"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-900"
                  />
                </div>
                
                {/* Bio */}
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={profileData.bio}
                    onChange={handleProfileChange}
                    placeholder="Tell us about yourself"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-900"
                  ></textarea>
                </div>
              </div>
              
              {/* Additional info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={profileData.location}
                    onChange={handleProfileChange}
                    placeholder="San Francisco, CA"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-900"
                  />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={profileData.company}
                    onChange={handleProfileChange}
                    placeholder="Acme Inc."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-900"
                  />
                </div>
              </div>
              
              {/* Social links */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Social Links</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Website
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 sm:text-sm">
                        <Globe size={16} />
                      </span>
                      <input
                        type="text"
                        id="website"
                        name="website"
                        value={profileData.website}
                        onChange={handleProfileChange}
                        placeholder="https://yourwebsite.com"
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 dark:border-gray-700 focus:ring-primary focus:border-primary bg-white dark:bg-gray-900"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="github" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      GitHub
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 sm:text-sm">
                        <GitHub size={16} />
                      </span>
                      <input
                        type="text"
                        id="github"
                        name="github"
                        value={profileData.github}
                        onChange={handleProfileChange}
                        placeholder="username"
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 dark:border-gray-700 focus:ring-primary focus:border-primary bg-white dark:bg-gray-900"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Twitter
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 sm:text-sm">
                        @
                      </span>
                      <input
                        type="text"
                        id="twitter"
                        name="twitter"
                        value={profileData.twitter}
                        onChange={handleProfileChange}
                        placeholder="username"
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 dark:border-gray-700 focus:ring-primary focus:border-primary bg-white dark:bg-gray-900"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Success/Error messages */}
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm rounded-md flex items-start">
                  <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              {saved && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm rounded-md flex items-start">
                  <CheckCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                  <span>Profile updated successfully!</span>
                </div>
              )}
              
              {/* Save button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader size={16} className="animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
        
      case 'notifications':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6">Notification Settings</h2>
            
            <div className="space-y-6">
              {/* Email notifications */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="emailNotifications"
                        name="emailNotifications"
                        type="checkbox"
                        checked={notificationSettings.emailNotifications}
                        onChange={handleNotificationChange}
                        className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="emailNotifications" className="font-medium text-gray-700 dark:text-gray-300">
                        Email Notifications
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">
                        Receive email notifications for important updates.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="commentNotifications"
                        name="commentNotifications"
                        type="checkbox"
                        checked={notificationSettings.commentNotifications}
                        onChange={handleNotificationChange}
                        className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="commentNotifications" className="font-medium text-gray-700 dark:text-gray-300">
                        Comment Notifications
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">
                        Receive notifications when someone comments on your posts.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="followNotifications"
                        name="followNotifications"
                        type="checkbox"
                        checked={notificationSettings.followNotifications}
                        onChange={handleNotificationChange}
                        className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="followNotifications" className="font-medium text-gray-700 dark:text-gray-300">
                        Follow Notifications
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">
                        Receive notifications when someone follows you.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="mentionNotifications"
                        name="mentionNotifications"
                        type="checkbox"
                        checked={notificationSettings.mentionNotifications}
                        onChange={handleNotificationChange}
                        className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="mentionNotifications" className="font-medium text-gray-700 dark:text-gray-300">
                        Mention Notifications
                      </label>
                      <p className="text-gray-500 dark:text-gray-400">
                        Receive notifications when someone mentions you in a post or comment.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Newsletter */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium mb-4">Newsletter</h3>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="newsletterSubscription"
                      name="newsletterSubscription"
                      type="checkbox"
                      checked={notificationSettings.newsletterSubscription}
                      onChange={handleNotificationChange}
                      className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="newsletterSubscription" className="font-medium text-gray-700 dark:text-gray-300">
                      Weekly Newsletter
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">
                      Receive our weekly newsletter with the best articles and resources.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Save button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <Save size={16} className="mr-2" />
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        );
        
      case 'appearance':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6">Appearance Settings</h2>
            
            <div className="space-y-6">
              {/* Theme settings */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium mb-4">Theme</h3>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Dark Mode</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Switch between light and dark theme
                    </p>
                  </div>
                  <button
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      darkMode ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                    onClick={() => dispatch(toggleDarkMode())}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        darkMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                    <span className="sr-only">Toggle Dark Mode</span>
                  </button>
                </div>
                
                {/* Font size */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Font Size</h4>
                  <div className="flex items-center space-x-4">
                    <button
                      className={`px-3 py-1 rounded-md ${
                        fontSize === 'small' 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                      onClick={() => dispatch(setFontSize('small'))}
                    >
                      Small
                    </button>
                    <button
                      className={`px-3 py-1 rounded-md ${
                        fontSize === 'medium' 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                      onClick={() => dispatch(setFontSize('medium'))}
                    >
                      Medium
                    </button>
                    <button
                      className={`px-3 py-1 rounded-md ${
                        fontSize === 'large' 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                      onClick={() => dispatch(setFontSize('large'))}
                    >
                      Large
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Code editor settings */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium mb-4">Code Editor</h3>
                
                {/* Code theme selector */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Code Theme</h4>
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-primary focus:border-primary rounded-md bg-white dark:bg-gray-900"
                    value={codeTheme}
                    onChange={(e) => dispatch(setCodeTheme(e.target.value))}
                  >
                    <optgroup label="Light Themes">
                      {availableCodeThemes.light.map((theme) => (
                        <option key={theme.id} value={theme.id}>
                          {theme.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Dark Themes">
                      {availableCodeThemes.dark.map((theme) => (
                        <option key={theme.id} value={theme.id}>
                          {theme.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
                
                {/* Code display options */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Display Options</h4>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Show Line Numbers</span>
                      <button
                        className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                          showLineNumbers ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                        onClick={() => dispatch(toggleLineNumbers())}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            showLineNumbers ? 'translate-x-5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Wrap Code</span>
                      <button
                        className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                          wrapCode ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                        onClick={() => dispatch(toggleWrapCode())}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            wrapCode ? 'translate-x-5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'security':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
            
            <div className="space-y-6">
              {/* Password change */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium mb-4">Change Password</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-900"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-900"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-900"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Two-factor authentication */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <button
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      twoFactorEnabled ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                    <span className="sr-only">Toggle 2FA</span>
                  </button>
                </div>
                
                {twoFactorEnabled && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Two-factor authentication is enabled. Your account is secure.
                    </p>
                    <button
                      type="button"
                      className="mt-2 text-sm text-primary hover:text-primary-dark"
                    >
                      Reconfigure 2FA
                    </button>
                  </div>
                )}
                
                {!twoFactorEnabled && (
                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800/30">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      We strongly recommend enabling two-factor authentication for added security.
                    </p>
                  </div>
                )}
              </div>
              
              {/* Active Sessions */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium mb-4">Active Sessions</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Current Session</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Browser: Chrome on Windows • IP: 192.168.1.1</div>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      Active
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Mobile App</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Device: iPhone • Last active: 2 hours ago</div>
                    </div>
                    <button className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                      Revoke
                    </button>
                  </div>
                </div>
                
                <div className="mt-4">
                  <button
                    type="button"
                    className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium"
                  >
                    Sign out from all devices
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'data':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6">Data & Privacy</h2>
            
            <div className="space-y-6">
              {/* Data export */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium mb-4">Export Your Data</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Download a copy of your CodeSource data, including your profile information, posts, and code snippets.
                </p>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <Download size={16} className="mr-2" />
                  Request Data Export
                </button>
              </div>
              
              {/* Delete account */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-4">Delete Account</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings navigation */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <nav className="space-y-1">
              <button
                className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                  activeTab === 'profile'
                    ? 'bg-primary/5 border-l-4 border-primary text-primary dark:text-primary-light'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                <User size={18} className="mr-3" />
                Profile
              </button>
              
              <button
                className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                  activeTab === 'notifications'
                    ? 'bg-primary/5 border-l-4 border-primary text-primary dark:text-primary-light'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => setActiveTab('notifications')}
              >
                <Bell size={18} className="mr-3" />
                Notifications
              </button>
              
              <button
                className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                  activeTab === 'appearance'
                    ? 'bg-primary/5 border-l-4 border-primary text-primary dark:text-primary-light'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => setActiveTab('appearance')}
              >
                <Palette size={18} className="mr-3" />
                Appearance
              </button>
              
              <button
                className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                  activeTab === 'security'
                    ? 'bg-primary/5 border-l-4 border-primary text-primary dark:text-primary-light'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => setActiveTab('security')}
              >
                <Lock size={18} className="mr-3" />
                Security
              </button>
              
              <button
                className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                  activeTab === 'data'
                    ? 'bg-primary/5 border-l-4 border-primary text-primary dark:text-primary-light'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => setActiveTab('data')}
              >
                <Database size={18} className="mr-3" />
                Data & Privacy
              </button>
            </nav>
          </div>
        </div>
        
        {/* Settings content */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;