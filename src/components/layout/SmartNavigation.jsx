// src/components/layout/SmartNavigation.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, Sun, Moon, Bell, Search, User, ChevronDown, 
  Code, BookOpen, Hash, Star, Cpu, Coffee, Lightbulb,
  Rss, HelpCircle, Zap, Settings, LogOut, Bookmark,
  Inbox, Maximize2, PlusCircle, Command, Github
} from 'lucide-react';
import { toggleDarkMode, toggleCommandPalette } from '../../store/slices/uiSlice';
import { logoutUser } from '../../store/slices/authSlice';
import AIAssistedSearch from '../search/AIAssistedSearch';
import { useGetNotificationsQuery } from '../../services/apiService';

// Smart header that adapts to user behavior and content
const SmartNavigation = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode } = useSelector(state => state.ui);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [suggestedTopics, setSuggestedTopics] = useState([]);
  const profileMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const notificationBellRef = useRef(null);
  
  // Fetch notifications
  const { data: notifications, isLoading: notificationsLoading } = useGetNotificationsQuery(
    undefined,
    { skip: !isAuthenticated }
  );
  
  const unreadNotifications = notifications?.filter(n => !n.read) || [];
  
  // Generated topics based on user behavior and trending content
  const topics = [
    { id: 'react', name: 'React', icon: <Code size={18} /> },
    { id: 'python', name: 'Python', icon: <Code size={18} /> },
    { id: 'javascript', name: 'JavaScript', icon: <Code size={18} /> },
    { id: 'devops', name: 'DevOps', icon: <Cpu size={18} /> },
    { id: 'machine-learning', name: 'Machine Learning', icon: <Lightbulb size={18} /> },
    { id: 'web-development', name: 'Web Development', icon: <BookOpen size={18} /> },
    { id: 'algorithms', name: 'Algorithms', icon: <Zap size={18} /> },
    { id: 'typescript', name: 'TypeScript', icon: <Code size={18} /> },
    { id: 'databases', name: 'Databases', icon: <Cpu size={18} /> },
    { id: 'backend', name: 'Backend', icon: <Cpu size={18} /> },
    { id: 'frontend', name: 'Frontend', icon: <Coffee size={18} /> },
  ];
  
  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      // Detect which section is currently in view
      const sections = document.querySelectorAll('section[id]');
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (offset >= sectionTop - 100 && offset < sectionTop + sectionHeight - 100) {
          setActiveSection(section.id);
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Handle clicks outside of dropdown menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close profile menu if clicked outside
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
      
      // Close notifications if clicked outside
      if (notificationsRef.current && 
          !notificationsRef.current.contains(event.target) && 
          notificationBellRef.current && 
          !notificationBellRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Reset mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);
  
  // Generate suggested topics based on path and theme
  useEffect(() => {
    // Simulate personalized topic recommendations
    const currentPath = location.pathname;
    let recommended = [];
    
    if (currentPath.includes('/post')) {
      // When viewing a post, suggest related topics
      recommended = ['algorithms', 'typescript', 'react', 'python'].map(id => 
        topics.find(t => t.id === id)
      );
    } else if (currentPath === '/') {
      // On homepage, suggest popular topics
      recommended = ['javascript', 'python', 'react', 'machine-learning'].map(id => 
        topics.find(t => t.id === id)
      );
    } else if (currentPath.includes('/profile')) {
      // On profile page, suggest topics user might like
      recommended = ['devops', 'algorithms', 'databases', 'frontend'].map(id => 
        topics.find(t => t.id === id)
      );
    } else {
      // Default suggestions
      recommended = ['javascript', 'python', 'react', 'algorithms'].map(id => 
        topics.find(t => t.id === id)
      );
    }
    
    setSuggestedTopics(recommended.filter(Boolean));
  }, [location.pathname]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K to open command palette
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        dispatch(toggleCommandPalette());
      }
      
      // '/' to focus search
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        setShowSearchBar(true);
      }
      
      // Escape to close search
      if (e.key === 'Escape' && showSearchBar) {
        setShowSearchBar(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, showSearchBar]);
  
  // Check if a nav item is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  // Handle logout
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };
  
  // Element classes based on state
  const navClasses = `fixed top-0 left-0 right-0 z-30 transition-all duration-200 ${
    scrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm' : 'bg-white dark:bg-gray-900'
  }`;
  
  const linkClasses = (active) => `
    px-3 py-2 rounded-md text-sm font-medium transition-colors
    ${active 
      ? 'text-primary dark:text-primary-light bg-primary/10 dark:bg-primary-dark/20' 
      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
    }
  `;
  
  const iconButtonClasses = `
    p-2 rounded-full text-gray-700 dark:text-gray-300 
    hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors
  `;
  
  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and primary navigation */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
                  <Code size={20} className="text-white" />
                </div>
                <span className="font-bold text-xl text-gray-900 dark:text-white">CodeSource</span>
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-1">
              <Link to="/" className={linkClasses(isActive('/'))}>
                Home
              </Link>
              <Link to="/explore" className={linkClasses(isActive('/explore'))}>
                Explore
              </Link>
              <Link to="/playground" className={linkClasses(isActive('/playground'))}>
                Playground
              </Link>
              
              {/* Topics dropdown */}
              <div className="relative group">
                <button className={`${linkClasses(false)} flex items-center`}>
                  <span>Topics</span>
                  <ChevronDown size={16} className="ml-1" />
                </button>
                <div className="hidden group-hover:block absolute z-10 -left-2 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg w-56 transition-all duration-200 origin-top-left">
                  <div className="p-2">
                    <div className="grid grid-cols-2 gap-1">
                      {topics.slice(0, 6).map(topic => (
                        <Link
                          key={topic.id}
                          to={`/topic/${topic.id}`}
                          className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <span className="mr-2 text-primary">{topic.icon}</span>
                          <span>{topic.name}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                      <Link
                        to="/topics"
                        className="flex items-center px-3 py-2 text-sm font-medium text-primary rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        View All Topics
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center space-x-1">
            {/* Search toggle */}
            <button 
              className={`${iconButtonClasses} hidden md:flex items-center`}
              onClick={() => setShowSearchBar(!showSearchBar)}
              title="Search"
            >
              <Search size={20} />
            </button>
            
            {/* Theme toggle */}
            <button 
              className={iconButtonClasses}
              onClick={() => dispatch(toggleDarkMode())}
              title={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {/* Command palette trigger */}
            <button 
              className={`${iconButtonClasses} hidden md:flex items-center`}
              onClick={() => dispatch(toggleCommandPalette())}
              title="Command Palette (Ctrl+K)"
            >
              <Command size={20} />
            </button>
            
            {isAuthenticated ? (
              <>
                {/* Create new post button */}
                <Link
                  to="/new-story"
                  className="hidden md:flex items-center bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <PlusCircle size={18} className="mr-1.5" />
                  <span>Write</span>
                </Link>
                
                {/* Notifications */}
                <div className="relative">
                  <button
                    ref={notificationBellRef}
                    className={`${iconButtonClasses} relative`}
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    title="Notifications"
                  >
                    <Bell size={20} />
                    {unreadNotifications.length > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
                    )}
                  </button>
                  
                  {/* Notifications dropdown */}
                  {notificationsOpen && (
                    <div 
                      ref={notificationsRef}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
                    >
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-sm font-medium">Notifications</h3>
                        {unreadNotifications.length > 0 && (
                          <button className="text-xs text-primary hover:text-primary-dark">
                            Mark all as read
                          </button>
                        )}
                      </div>
                      
                      <div className="max-h-96 overflow-y-auto">
                        {notificationsLoading ? (
                          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                            Loading notifications...
                          </div>
                        ) : notifications?.length > 0 ? (
                          <div>
                            {notifications.slice(0, 5).map(notification => (
                              <div 
                                key={notification.id}
                                className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer ${
                                  !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                }`}
                              >
                                <div className="flex">
                                  <div className="flex-shrink-0 mr-3 mt-1">
                                    {notification.type === 'comment' && (
                                      <Inbox size={20} className="text-blue-500" />
                                    )}
                                    {notification.type === 'like' && (
                                      <Star size={20} className="text-yellow-500" />
                                    )}
                                    {notification.type === 'mention' && (
                                      <User size={20} className="text-green-500" />
                                    )}
                                    {notification.type === 'follow' && (
                                      <User size={20} className="text-purple-500" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-800 dark:text-gray-200">
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                      {new Date(notification.createdAt).toLocaleTimeString([], { 
                                        hour: '2-digit', 
                                        minute: '2-digit',
                                        hour12: true
                                      })}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                            
                            <div className="p-3 text-center">
                              <Link
                                to="/notifications"
                                className="text-sm text-primary hover:text-primary-dark font-medium"
                              >
                                View all notifications
                              </Link>
                            </div>
                          </div>
                        ) : (
                          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            <Bell size={24} className="mx-auto mb-2 opacity-50" />
                            <p>No notifications yet</p>
                            <p className="text-xs mt-1">We'll notify you when something happens</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* User profile menu */}
                <div className="relative">
                  <button
                    className="flex items-center"
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  >
                    <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                          <User size={16} />
                        </div>
                      )}
                    </div>
                    <ChevronDown 
                      size={16} 
                      className="ml-1 text-gray-600 dark:text-gray-400 hidden md:block" 
                    />
                  </button>
                  
                  {/* Profile dropdown */}
                  {profileMenuOpen && (
                    <div 
                      ref={profileMenuRef}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
                    >
                      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {user?.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user?.email}
                        </div>
                      </div>
                      
                      <div className="py-1">
                        <Link
                          to={`/profile/${user?.id}`}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <User size={16} className="mr-2" />
                          Your Profile
                        </Link>
                        <Link
                          to="/bookmarks"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <Bookmark size={16} className="mr-2" />
                          Bookmarks
                        </Link>
                        <Link
                          to="/analytics"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <Zap size={16} className="mr-2" />
                          Analytics
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <Settings size={16} className="mr-2" />
                          Settings
                        </Link>
                      </div>
                      
                      <div className="py-1 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <LogOut size={16} className="mr-2" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Auth buttons for logged out users */}
                <Link
                  to="/auth/login"
                  className="hidden md:block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign in
                </Link>
                <Link
                  to="/auth/register"
                  className="hidden md:block bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign up
                </Link>
              </>
            )}
            
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Full-width search bar */}
      {showSearchBar && (
        <div className="absolute left-0 right-0 top-16 bg-white dark:bg-gray-900 p-4 border-t border-b border-gray-200 dark:border-gray-700 shadow-md z-40 transition-all duration-300">
          <div className="max-w-3xl mx-auto relative">
            <AIAssistedSearch 
              fullWidth={true} 
              showTrending={true}
            />
            <button 
              className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              onClick={() => setShowSearchBar(false)}
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Suggested topics */}
          <div className="max-w-3xl mx-auto mt-4">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
              Suggested Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {suggestedTopics.map(topic => (
                <Link
                  key={topic.id}
                  to={`/topic/${topic.id}`}
                  className="flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300"
                  onClick={() => setShowSearchBar(false)}
                >
                  <span className="mr-1 text-primary">{topic.icon}</span>
                  <span>{topic.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-30">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/') 
                  ? 'text-primary bg-primary/10 dark:bg-primary-dark/20' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/explore" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/explore') 
                  ? 'text-primary bg-primary/10 dark:bg-primary-dark/20' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Explore
            </Link>
            <Link 
              to="/playground" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/playground') 
                  ? 'text-primary bg-primary/10 dark:bg-primary-dark/20' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Playground
            </Link>
            
            {/* Topics section */}
            <div className="py-2">
              <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Popular Topics
              </h3>
              <div className="mt-1 grid grid-cols-2 gap-1">
                {topics.slice(0, 6).map(topic => (
                  <Link
                    key={topic.id}
                    to={`/topic/${topic.id}`}
                    className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  >
                    <span className="mr-2 text-primary">{topic.icon}</span>
                    <span>{topic.name}</span>
                  </Link>
                ))}
              </div>
              <Link
                to="/topics"
                className="block px-3 py-2 mt-1 text-sm font-medium text-primary"
              >
                View all topics
              </Link>
            </div>
            
            {!isAuthenticated && (
              <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center px-3 space-x-3">
                  <Link
                    to="/auth/login"
                    className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-center text-sm font-medium text-primary bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-primary dark:border-primary-dark"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/auth/register"
                    className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-center text-sm font-medium text-white bg-primary hover:bg-primary-dark"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            )}
            
            {isAuthenticated && (
              <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                <div className="px-3">
                  <Link
                    to="/new-story"
                    className="block w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-center text-sm font-medium text-white bg-primary hover:bg-primary-dark"
                  >
                    Create New Post
                  </Link>
                </div>
                
                <div className="mt-3 space-y-1">
                  <Link
                    to={`/profile/${user?.id}`}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/bookmarks"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Bookmarks
                  </Link>
                  <Link
                    to="/notifications"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Notifications
                    {unreadNotifications.length > 0 && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                        {unreadNotifications.length}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
            
            <div className="pt-2 pb-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between px-3 py-2">
                <button 
                  className="flex items-center text-sm text-gray-700 dark:text-gray-300"
                  onClick={() => dispatch(toggleDarkMode())}
                >
                  {darkMode ? (
                    <>
                      <Sun size={16} className="mr-2" />
                      <span>Light mode</span>
                    </>
                  ) : (
                    <>
                      <Moon size={16} className="mr-2" />
                      <span>Dark mode</span>
                    </>
                  )}
                </button>
                
                <button 
                  className="flex items-center text-sm text-gray-700 dark:text-gray-300"
                  onClick={() => dispatch(toggleCommandPalette())}
                >
                  <Command size={16} className="mr-2" />
                  <span>Commands</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Scrollspy navigation - shows on scroll for long content pages */}
      {scrolled && location.pathname.includes('/post/') && (
        <div className="hidden lg:block fixed top-20 right-4 z-20">
          <nav className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold">Table of Contents</h3>
            </div>
            <ul className="p-2 space-y-1 max-h-[calc(100vh-180px)] overflow-y-auto">
              {['introduction', 'setup', 'implementation', 'examples', 'conclusion'].map(section => (
                <li key={section}>
                  <a
                    href={`#${section}`}
                    className={`block px-3 py-2 text-sm rounded-md ${
                      activeSection === section
                        ? 'text-primary bg-primary/10 dark:bg-primary-dark/20 font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </a>
                </li>
              ))}
            </ul>
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
              <button className="w-full flex items-center justify-center px-3 py-2 text-sm text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                <Share2 size={16} className="mr-2" />
                Share article
              </button>
            </div>
          </nav>
        </div>
      )}
      
      {/* GitHub connection reminder */}
      {isAuthenticated && location.pathname === '/profile/' + user?.id && (
        <div className="fixed bottom-4 right-4 z-20 max-w-sm bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Github size={24} className="text-gray-700 dark:text-gray-300" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Connect your GitHub account
              </h3>
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Link your GitHub repositories to showcase your projects directly on your profile.
              </div>
              <div className="mt-2">
                <Link
                  to="/settings/integrations"
                  className="text-sm font-medium text-primary hover:text-primary-dark"
                >
                  Connect now
                </Link>
              </div>
            </div>
            <button className="ml-auto flex-shrink-0 text-gray-400 hover:text-gray-500">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default SmartNavigation;