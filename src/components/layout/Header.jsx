import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  Search, Bell, BookOpen, Code, Feather, 
  User, Menu, Sun, Moon, Settings, LogOut, 
  Github, HelpCircle, BarChart2, Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CommandPalette from '../navigation/CommandPalette';

const Header = ({ isScrolled, toggleSidebar, sidebarOpen, user }) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle clicks outside of dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', newMode);
  };
  
  // Handle logout
  const handleLogout = () => {
    // dispatch(logout());
    navigate('/login');
  };
  
  // Toggle command palette with keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      
      if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen]);
  
  return (
    <>
      <header 
        className={`sticky top-0 z-10 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-sm shadow-sm border-b border-neutral-200/70' 
            : 'bg-transparent'
        }`}
      >
        <div className="px-4 py-3 md:px-6">
          <div className="flex items-center justify-between">
            {/* Left section: Logo (mobile) & Toggle */}
            <div className="flex items-center md:hidden">
              <button 
                onClick={toggleSidebar}
                className="mr-3 p-2 rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <Menu className="h-5 w-5" />
              </button>
              
              <Link to="/" className="flex items-center md:hidden">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center text-white font-bold text-lg">
                  C
                </div>
                <span className="ml-2 text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
                  CodeSiMP
                </span>
              </Link>
            </div>
            
            {/* Center section: Search */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-auto relative">
              <div 
                className={`relative w-full transition-all duration-300 ${
                  searchFocused ? 'scale-105' : 'scale-100'
                }`}
              >
                <input
                  type="text"
                  placeholder="Search articles, code, or topics..."
                  className="pl-10 pr-4 py-2 w-full rounded-full bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-300"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  onClick={() => setCommandPaletteOpen(true)}
                  readOnly
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
                <div className="absolute right-3 top-2 rounded border border-neutral-300 bg-neutral-200/50 px-1.5 py-0.5 text-xs font-medium text-neutral-500">
                  <span className="mr-1">⌘</span>K
                </div>
              </div>
            </div>
            
            {/* Right section: Actions */}
            <div className="flex items-center space-x-1 md:space-x-2">
              {/* Mobile search button */}
              <button 
                className="md:hidden p-2 rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
                onClick={() => setCommandPaletteOpen(true)}
              >
                <Search className="h-5 w-5" />
              </button>
              
              {/* Write button */}
              <Link 
                to="/editor"
                className="hidden md:flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              >
                <Feather className="h-4 w-4 mr-1.5" />
                Write
              </Link>
              
              {/* Explore button */}
              <Link 
                to="/explore" 
                className="hidden md:flex items-center p-2 rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
                title="Explore"
              >
                <BookOpen className="h-5 w-5" />
              </Link>
              
              {/* Notifications */}
              <div className="relative" ref={notificationsRef}>
                <button 
                  className="p-2 rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 relative"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  title="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary-500 ring-2 ring-white"></span>
                </button>
                
                {/* Notifications dropdown */}
                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-80 origin-top-right rounded-lg bg-white py-1 shadow-soft-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20"
                    >
                      <div className="px-4 py-2 border-b border-neutral-200">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-neutral-900">Notifications</h3>
                          <Link to="/notifications" className="text-xs font-medium text-primary-600 hover:text-primary-700">
                            View all
                          </Link>
                        </div>
                      </div>
                      
                      <div className="max-h-96 overflow-y-auto py-1">
                        {/* Notification items */}
                        <div className="px-4 py-2 hover:bg-neutral-50 transition-colors duration-150">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mr-3 mt-1">
                              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                                <Code className="h-4 w-4 text-primary-600" />
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-neutral-700">
                                <span className="font-medium">Sarah Chen</span> commented on your article <span className="font-medium">Building a React Component Library</span>
                              </p>
                              <p className="text-xs text-neutral-500 mt-1">2 hours ago</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="px-4 py-2 hover:bg-neutral-50 transition-colors duration-150">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mr-3 mt-1">
                              <div className="h-8 w-8 rounded-full bg-success-100 flex items-center justify-center">
                                <Feather className="h-4 w-4 text-success-600" />
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-neutral-700">
                                Your article <span className="font-medium">10 TypeScript Tips for React Developers</span> has been featured on the homepage!
                              </p>
                              <p className="text-xs text-neutral-500 mt-1">Yesterday</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="px-4 py-2 hover:bg-neutral-50 transition-colors duration-150">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mr-3 mt-1">
                              <img
                                src="/api/placeholder/40/40"
                                alt="User avatar"
                                className="h-8 w-8 rounded-full"
                              />
                            </div>
                            <div>
                              <p className="text-sm text-neutral-700">
                                <span className="font-medium">Alex Rivera</span> started following you
                              </p>
                              <p className="text-xs text-neutral-500 mt-1">2 days ago</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="px-4 py-2 border-t border-neutral-200">
                        <button className="w-full py-1.5 px-3 text-xs font-medium text-center rounded-md bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors">
                          Mark all as read
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Profile */}
              <div className="relative" ref={profileRef}>
                <button 
                  className="flex items-center focus:outline-none"
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <img
                    src="/api/placeholder/40/40"
                    alt="User avatar"
                    className="h-8 w-8 rounded-full border-2 border-transparent hover:border-primary-300 transition-colors duration-200"
                  />
                </button>
                
                {/* Profile dropdown */}
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white py-1 shadow-soft-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20"
                    >
                      <div className="px-4 py-3 border-b border-neutral-200">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 mr-3">
                            <img
                              src="/api/placeholder/40/40"
                              alt="User avatar"
                              className="h-10 w-10 rounded-full"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neutral-900">{user?.name || 'Dev Smith'}</p>
                            <p className="text-xs text-neutral-500">@{user?.username || 'devsmith'}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="py-1">
                        <Link to="/profile" className="dropdown-item flex items-center">
                          <User className="h-4 w-4 mr-2 text-neutral-500" />
                          <span>Profile</span>
                        </Link>
                        
                        <Link to="/bookmarks" className="dropdown-item flex items-center">
                          <Bookmark className="h-4 w-4 mr-2 text-neutral-500" />
                          <span>Bookmarks</span>
                        </Link>
                        
                        <Link to="/dashboard" className="dropdown-item flex items-center">
                          <BarChart2 className="h-4 w-4 mr-2 text-neutral-500" />
                          <span>Dashboard</span>
                        </Link>
                        
                        <Link to="/settings" className="dropdown-item flex items-center">
                          <Settings className="h-4 w-4 mr-2 text-neutral-500" />
                          <span>Settings</span>
                        </Link>
                        
                        <button 
                          className="dropdown-item w-full flex items-center justify-between"
                          onClick={toggleDarkMode}
                        >
                          <span className="flex items-center">
                            {isDarkMode ? (
                              <Sun className="h-4 w-4 mr-2 text-neutral-500" />
                            ) : (
                              <Moon className="h-4 w-4 mr-2 text-neutral-500" />
                            )}
                            <span>Theme</span>
                          </span>
                          <span className="text-xs font-medium text-neutral-500">
                            {isDarkMode ? 'Light' : 'Dark'}
                          </span>
                        </button>
                      </div>
                      
                      <div className="py-1 border-t border-neutral-200">
                        <Link to="/github-integration" className="dropdown-item flex items-center">
                          <Github className="h-4 w-4 mr-2 text-neutral-500" />
                          <span>GitHub Integration</span>
                        </Link>
                        
                        <Link to="/help" className="dropdown-item flex items-center">
                          <HelpCircle className="h-4 w-4 mr-2 text-neutral-500" />
                          <span>Help & Support</span>
                        </Link>
                      </div>
                      
                      <div className="py-1 border-t border-neutral-200">
                        <button 
                          className="dropdown-item w-full flex items-center text-error-600 hover:text-error-700 hover:bg-error-50"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Command Palette */}
      <CommandPalette 
        isOpen={commandPaletteOpen} 
        onClose={() => setCommandPaletteOpen(false)}
      />
    </>
  );
};

export default Header;