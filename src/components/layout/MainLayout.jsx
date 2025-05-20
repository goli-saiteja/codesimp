// src/components/layout/MainLayout.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import { 
  Search, Bell, BookOpen, Bookmark, User, Settings, 
  Home, Code, Award, Terminal, Hash, Zap, Users, Coffee,
  Trending, Clock, BarChart2, GitHub, Database, Layers, 
  HelpCircle, LogOut, Mail
} from 'lucide-react';
import SmartNavigation from './SmartNavigation';
import CommandPalette from '../navigation/CommandPalette';
import AIAssistedSearch from '../search/AIAssistedSearch';
import Footer from './Footer';
import { toggleSidebar, updateScreenSize } from '../../store/slices/uiSlice';
import { logoutUser } from '../../store/slices/authSlice';

// Main layout component with responsive sidebar and content area
const MainLayout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { darkMode, sidebarOpen, isMobile } = useSelector(state => state.ui);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [showSearch, setShowSearch] = useState(false);
  const [pageTitle, setPageTitle] = useState('');
  const [scrolled, setScrolled] = useState(false);
  
  // Update page title based on route
  useEffect(() => {
    const path = location.pathname;
    let title = 'Home';
    
    if (path.startsWith('/post/')) {
      title = 'Article';
    } else if (path.startsWith('/profile/')) {
      title = 'Profile';
    } else if (path === '/explore') {
      title = 'Explore';
    } else if (path === '/playground') {
      title = 'Code Playground';
    } else if (path === '/bookmarks') {
      title = 'Bookmarks';
    } else if (path === '/settings') {
      title = 'Settings';
    } else if (path === '/analytics') {
      title = 'Analytics';
    } else if (path === '/new-story') {
      title = 'New Post';
    }
    
    setPageTitle(title);
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location]);
  
  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      dispatch(updateScreenSize());
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize on mount
    
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);
  
  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    dispatch(toggleSidebar());
  };
  
  // Handle logout
  const handleLogout = () => {
    dispatch(logoutUser());
  };
  
  // Sidebar navigation items
  const mainNavItems = [
    { name: 'Home', icon: <Home size={20} />, path: '/' },
    { name: 'Explore', icon: <Hash size={20} />, path: '/explore' },
    { name: 'Playground', icon: <Terminal size={20} />, path: '/playground' },
  ];
  
  const discoverNavItems = [
    { name: 'Popular', icon: <Trending size={20} />, path: '/popular' },
    { name: 'Recent', icon: <Clock size={20} />, path: '/recent' },
    { name: 'Topics', icon: <BookOpen size={20} />, path: '/topics' },
    { name: 'Authors', icon: <Users size={20} />, path: '/authors' },
  ];
  
  const userNavItems = isAuthenticated ? [
    { name: 'Your Profile', icon: <User size={20} />, path: `/profile/${user?.id}` },
    { name: 'Bookmarks', icon: <Bookmark size={20} />, path: '/bookmarks' },
    { name: 'Analytics', icon: <BarChart2 size={20} />, path: '/analytics' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ] : [];
  
  const bottomNavItems = [
    { name: 'Help Center', icon: <HelpCircle size={20} />, path: '/help' },
    { name: 'Feedback', icon: <Mail size={20} />, path: '/feedback' },
  ];
  
  // Determine sidebar width class
  const sidebarWidthClass = sidebarOpen ? 'w-64' : 'w-16';
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Smart Navigation Header */}
      <SmartNavigation />
      
      {/* Command Palette */}
      <CommandPalette />
      
      {/* Main Content */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar - Hidden on mobile */}
        <aside 
          className={`hidden md:block fixed inset-y-0 left-0 z-20 transform top-16 ${sidebarWidthClass} overflow-y-auto bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out ${
            scrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md' : ''
          }`}
        >
          <nav className="mt-5 px-2 space-y-6">
            {/* Main Navigation */}
            <div>
              <p className={`px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${!sidebarOpen && 'sr-only'}`}>
                Main
              </p>
              <div className="space-y-1">
                {mainNavItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.path}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      location.pathname === item.path
                        ? 'bg-primary/10 text-primary dark:text-primary-light'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    } ${!sidebarOpen && 'justify-center'}`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {sidebarOpen && <span className="ml-3">{item.name}</span>}
                  </a>
                ))}
              </div>
            </div>
            
            {/* Discover Section */}
            <div>
              <p className={`px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${!sidebarOpen && 'sr-only'}`}>
                Discover
              </p>
              <div className="space-y-1">
                {discoverNavItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.path}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      location.pathname === item.path
                        ? 'bg-primary/10 text-primary dark:text-primary-light'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    } ${!sidebarOpen && 'justify-center'}`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {sidebarOpen && <span className="ml-3">{item.name}</span>}
                  </a>
                ))}
              </div>
            </div>
            
            {/* User Section - Only shown if authenticated */}
            {isAuthenticated && userNavItems.length > 0 && (
              <div>
                <p className={`px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${!sidebarOpen && 'sr-only'}`}>
                  Personal
                </p>
                <div className="space-y-1">
                  {userNavItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.path}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        location.pathname === item.path
                          ? 'bg-primary/10 text-primary dark:text-primary-light'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      } ${!sidebarOpen && 'justify-center'}`}
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      {sidebarOpen && <span className="ml-3">{item.name}</span>}
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            {/* Featured Technologies */}
            {sidebarOpen && (
              <div>
                <p className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Featured Technologies
                </p>
                <div className="px-3 py-2">
                  <div className="flex flex-wrap gap-2">
                    <a
                      href="/topic/react"
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    >
                      <Code size={12} className="mr-1" />
                      React
                    </a>
                    <a
                      href="/topic/python"
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    >
                      <Terminal size={12} className="mr-1" />
                      Python
                    </a>
                    <a
                      href="/topic/devops"
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                    >
                      <Layers size={12} className="mr-1" />
                      DevOps
                    </a>
                    <a
                      href="/topic/typescript"
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
                    >
                      <Code size={12} className="mr-1" />
                      TypeScript
                    </a>
                    <a
                      href="/topic/ai"
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                    >
                      <Zap size={12} className="mr-1" />
                      AI/ML
                    </a>
                  </div>
                </div>
              </div>
            )}
            
            {/* Bottom navigation */}
            <div className="mt-auto">
              <div className="space-y-1">
                {bottomNavItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.path}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${!sidebarOpen && 'justify-center'}`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {sidebarOpen && <span className="ml-3">{item.name}</span>}
                  </a>
                ))}
                
                {isAuthenticated && (
                  <button
                    onClick={handleLogout}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 ${!sidebarOpen && 'justify-center'}`}
                  >
                    <span className="flex-shrink-0">
                      <LogOut size={20} />
                    </span>
                    {sidebarOpen && <span className="ml-3">Sign Out</span>}
                  </button>
                )}
              </div>
            </div>
          </nav>
        </aside>
        
        {/* Toggle button - Visible on larger screens */}
        <button
          className="hidden md:block fixed bottom-4 left-4 z-20 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={handleSidebarToggle}
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? (
            <ChevronLeft size={20} />
          ) : (
            <ChevronRight size={20} />
          )}
        </button>
        
        {/* Main content area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-8 py-10 pb-20 md:ml-16">
          {/* Main content from individual pages */}
          <Outlet />
        </main>
      </div>
      
      {/* Footer */}
      <Footer />
      
      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-80 transition-opacity"
              onClick={() => setShowSearch(false)}
            ></div>
            
            <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
              <div className="p-4">
                <AIAssistedSearch 
                  fullWidth 
                  showTrending
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper icons
const ChevronLeft = ({ size = 24, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRight = ({ size = 24, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

export default MainLayout;