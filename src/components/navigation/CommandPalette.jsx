// src/components/navigation/CommandPalette.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Command, Search, Home, FileText, Settings, User, BookOpen, Code, 
  PlusCircle, Bookmark, List, Zap, Upload, Download, Shuffle, Moon, 
  Sun, LogOut, Bell, Github, Tool, Bookmark as BookmarkIcon, Terminal,
  Hash, Folder, Star, GitPullRequest, Database, Layers, Key, HelpCircle
} from 'lucide-react';
import { toggleDarkMode, toggleCommandPalette, closeCommandPalette } from '../../store/slices/uiSlice';
import { logoutUser } from '../../store/slices/authSlice';
import { useGetUserProfileQuery } from '../../services/apiService';

// Command categories
const CATEGORIES = {
  NAVIGATION: 'Navigation',
  ACTIONS: 'Actions',
  CREATE: 'Create New',
  TOOLS: 'Developer Tools',
  SEARCH: 'Search',
  THEME: 'Appearance',
  ACCOUNT: 'Account',
};

const CommandPalette = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isOpen } = useSelector(state => state.ui.commandPalette);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { darkMode } = useSelector(state => state.ui);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [filteredCommands, setFilteredCommands] = useState([]);
  const [recentCommands, setRecentCommands] = useState([]);
  const inputRef = useRef(null);
  const commandListRef = useRef(null);
  const activeItemRef = useRef(null);
  
  // Fetch user data if authenticated
  const { data: userData } = useGetUserProfileQuery(
    user?.id,
    { skip: !isAuthenticated || !user?.id }
  );
  
  // Define all available commands
  const allCommands = [
    // Navigation
    {
      id: 'home',
      name: 'Go to Home',
      shortcut: 'g h',
      icon: <Home size={18} />,
      category: CATEGORIES.NAVIGATION,
      action: () => navigate('/'),
      keywords: ['dashboard', 'feed', 'main', 'homepage'],
    },
    {
      id: 'explore',
      name: 'Explore Topics',
      shortcut: 'g e',
      icon: <Hash size={18} />,
      category: CATEGORIES.NAVIGATION,
      action: () => navigate('/explore'),
      keywords: ['topics', 'discover', 'browse', 'categories'],
    },
    {
      id: 'bookmarks',
      name: 'View Bookmarks',
      shortcut: 'g b',
      icon: <BookmarkIcon size={18} />,
      category: CATEGORIES.NAVIGATION,
      action: () => navigate('/bookmarks'),
      keywords: ['saved', 'favorites', 'reading list'],
      requiresAuth: true,
    },
    {
      id: 'playground',
      name: 'Code Playground',
      shortcut: 'g p',
      icon: <Terminal size={18} />,
      category: CATEGORIES.NAVIGATION,
      action: () => navigate('/playground'),
      keywords: ['code', 'editor', 'sandbox', 'execute', 'run'],
    },
    {
      id: 'profile',
      name: 'Your Profile',
      shortcut: 'g u',
      icon: <User size={18} />,
      category: CATEGORIES.NAVIGATION,
      action: () => navigate(`/profile/${user?.id}`),
      keywords: ['account', 'me', 'my profile'],
      requiresAuth: true,
    },
    {
      id: 'settings',
      name: 'Settings',
      shortcut: 'g s',
      icon: <Settings size={18} />,
      category: CATEGORIES.NAVIGATION,
      action: () => navigate('/settings'),
      keywords: ['preferences', 'config', 'options'],
      requiresAuth: true,
    },
    
    // Actions
    {
      id: 'new-story',
      name: 'Create New Post',
      shortcut: 'c p',
      icon: <PlusCircle size={18} />,
      category: CATEGORIES.CREATE,
      action: () => navigate('/new-story'),
      keywords: ['write', 'new', 'article', 'blog'],
      requiresAuth: true,
    },
    {
      id: 'new-snippet',
      name: 'Create Code Snippet',
      shortcut: 'c s',
      icon: <Code size={18} />,
      category: CATEGORIES.CREATE,
      action: () => navigate('/new-snippet'),
      keywords: ['code', 'gist', 'sample'],
      requiresAuth: true,
    },
    {
      id: 'new-series',
      name: 'Create Article Series',
      shortcut: 'c e',
      icon: <List size={18} />,
      category: CATEGORIES.CREATE,
      action: () => navigate('/new-series'),
      keywords: ['collection', 'tutorial', 'guide'],
      requiresAuth: true,
    },
    
    // Tools
    {
      id: 'github-integration',
      name: 'GitHub Integration',
      icon: <Github size={18} />,
      category: CATEGORIES.TOOLS,
      action: () => navigate('/github-integration'),
      keywords: ['git', 'repo', 'repository', 'connect'],
      requiresAuth: true,
    },
    {
      id: 'api-docs',
      name: 'API Documentation',
      icon: <Database size={18} />,
      category: CATEGORIES.TOOLS,
      action: () => navigate('/api-docs'),
      keywords: ['api', 'endpoints', 'reference', 'documentation'],
    },
    {
      id: 'developer-tools',
      name: 'Developer Tools',
      icon: <Tool size={18} />,
      category: CATEGORIES.TOOLS,
      action: () => navigate('/developer-tools'),
      keywords: ['tools', 'debug', 'utilities'],
      requiresAuth: true,
    },
    {
      id: 'analytics',
      name: 'View Analytics',
      icon: <Layers size={18} />,
      category: CATEGORIES.TOOLS,
      action: () => navigate('/analytics'),
      keywords: ['stats', 'metrics', 'performance', 'views'],
      requiresAuth: true,
    },
    {
      id: 'code-generators',
      name: 'Code Generators',
      icon: <Zap size={18} />,
      category: CATEGORIES.TOOLS,
      action: () => navigate('/code-generators'),
      keywords: ['generate', 'boilerplate', 'scaffold', 'template'],
    },
    
    // Search
    {
      id: 'search',
      name: 'Search Content',
      shortcut: '/',
      icon: <Search size={18} />,
      category: CATEGORIES.SEARCH,
      action: () => {
        dispatch(closeCommandPalette());
        setTimeout(() => {
          const searchInput = document.querySelector('#global-search-input');
          if (searchInput) {
            searchInput.focus();
          } else {
            navigate('/search');
          }
        }, 100);
      },
      keywords: ['find', 'query', 'lookup'],
    },
    {
      id: 'search-code',
      name: 'Search Code Snippets',
      icon: <Code size={18} />,
      category: CATEGORIES.SEARCH,
      action: () => navigate('/search?type=code'),
      keywords: ['snippets', 'find code', 'search code', 'examples'],
    },
    {
      id: 'search-users',
      name: 'Search Users',
      icon: <User size={18} />,
      category: CATEGORIES.SEARCH,
      action: () => navigate('/search?type=users'),
      keywords: ['people', 'authors', 'find users', 'profiles'],
    },
    
    // Theme
    {
      id: 'toggle-theme',
      name: darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      shortcut: 'ctrl+j',
      icon: darkMode ? <Sun size={18} /> : <Moon size={18} />,
      category: CATEGORIES.THEME,
      action: () => dispatch(toggleDarkMode()),
      keywords: ['dark', 'light', 'theme', 'appearance', 'mode'],
    },
    
    // Account
    {
      id: 'logout',
      name: 'Sign Out',
      icon: <LogOut size={18} />,
      category: CATEGORIES.ACCOUNT,
      action: () => {
        dispatch(logoutUser());
        navigate('/');
      },
      keywords: ['logout', 'sign out', 'exit'],
      requiresAuth: true,
    },
    {
      id: 'notifications',
      name: 'View Notifications',
      icon: <Bell size={18} />,
      category: CATEGORIES.ACCOUNT,
      action: () => navigate('/notifications'),
      keywords: ['alerts', 'mentions', 'activity'],
      requiresAuth: true,
    },
    {
      id: 'api-keys',
      name: 'Manage API Keys',
      icon: <Key size={18} />,
      category: CATEGORIES.ACCOUNT,
      action: () => navigate('/settings/api-keys'),
      keywords: ['tokens', 'access', 'credentials'],
      requiresAuth: true,
    },
    {
      id: 'help',
      name: 'Help & Support',
      icon: <HelpCircle size={18} />,
      category: CATEGORIES.ACCOUNT,
      action: () => navigate('/help'),
      keywords: ['support', 'docs', 'faq', 'assistance'],
    },
  ];
  
  // Get recent commands from localStorage on mount
  useEffect(() => {
    const savedRecent = localStorage.getItem('recentCommands');
    if (savedRecent) {
      try {
        setRecentCommands(JSON.parse(savedRecent));
      } catch (error) {
        console.error('Failed to parse recent commands:', error);
      }
    }
  }, []);
  
  // Filter commands based on query and auth status
  useEffect(() => {
    if (!query) {
      const availableCommands = allCommands.filter(cmd => 
        !cmd.requiresAuth || isAuthenticated
      );
      
      // Group by category
      const groupedCommands = Object.values(
        availableCommands.reduce((acc, command) => {
          if (!acc[command.category]) {
            acc[command.category] = {
              category: command.category,
              commands: []
            };
          }
          acc[command.category].commands.push(command);
          return acc;
        }, {})
      );
      
      // Add recent commands section if available
      if (recentCommands.length > 0) {
        const recentCommandsData = recentCommands
          .map(id => allCommands.find(cmd => cmd.id === id))
          .filter(cmd => cmd && (!cmd.requiresAuth || isAuthenticated))
          .slice(0, 5);
        
        if (recentCommandsData.length > 0) {
          groupedCommands.unshift({
            category: 'Recent',
            commands: recentCommandsData
          });
        }
      }
      
      setFilteredCommands(groupedCommands);
    } else {
      // Flat list of filtered commands when searching
      const searchableCommands = allCommands.filter(cmd => 
        !cmd.requiresAuth || isAuthenticated
      );
      
      const matched = searchableCommands.filter(cmd => {
        const searchTerms = [cmd.name.toLowerCase(), ...(cmd.keywords || [])];
        return searchTerms.some(term => term.includes(query.toLowerCase()));
      });
      
      setFilteredCommands([{ 
        category: 'Search Results', 
        commands: matched 
      }]);
    }
    
    setActiveIndex(0);
  }, [query, isAuthenticated, recentCommands, darkMode]);
  
  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);
  
  // Scroll active item into view
  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        block: 'nearest',
      });
    }
  }, [activeIndex]);
  
  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    // Count total commands
    const totalCommands = filteredCommands.reduce(
      (count, group) => count + group.commands.length, 
      0
    );
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(index => (index + 1) % totalCommands);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(index => (index - 1 + totalCommands) % totalCommands);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      executeActiveCommand();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      dispatch(closeCommandPalette());
    }
  };
  
  // Execute the active command
  const executeActiveCommand = () => {
    // Find the active command
    let currentIndex = 0;
    let activeCommand = null;
    
    for (const group of filteredCommands) {
      for (const command of group.commands) {
        if (currentIndex === activeIndex) {
          activeCommand = command;
          break;
        }
        currentIndex++;
      }
      if (activeCommand) break;
    }
    
    if (activeCommand) {
      // Update recent commands
      const updatedRecent = [
        activeCommand.id,
        ...recentCommands.filter(id => id !== activeCommand.id)
      ].slice(0, 5);
      
      setRecentCommands(updatedRecent);
      localStorage.setItem('recentCommands', JSON.stringify(updatedRecent));
      
      // Execute command action
      activeCommand.action();
      
      // Close palette
      dispatch(closeCommandPalette());
    }
  };
  
  // Get flattened index for each command
  const getFlattenedIndex = (groupIndex, commandIndex) => {
    let index = 0;
    for (let i = 0; i < groupIndex; i++) {
      index += filteredCommands[i].commands.length;
    }
    return index + commandIndex;
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-80 transition-opacity"
          onClick={() => dispatch(closeCommandPalette())}
        ></div>
        
        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
          <div className="flex items-center border-b border-gray-200 dark:border-gray-700 px-4 py-3">
            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20 text-primary">
              <Command size={18} />
            </div>
            <input
              ref={inputRef}
              type="text"
              className="w-full bg-transparent border-0 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:ring-0 text-base"
              placeholder="Search for commands..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="ml-3 flex items-center gap-1">
              <kbd className="hidden sm:inline-flex h-6 items-center rounded border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-1.5 font-mono text-xs text-gray-500 dark:text-gray-400">
                ↑↓
              </kbd>
              <kbd className="hidden sm:inline-flex h-6 items-center rounded border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-1.5 font-mono text-xs text-gray-500 dark:text-gray-400">
                ⏎
              </kbd>
              <kbd className="hidden sm:inline-flex h-6 items-center rounded border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-1.5 font-mono text-xs text-gray-500 dark:text-gray-400">
                esc
              </kbd>
            </div>
          </div>
          
          <div 
            ref={commandListRef}
            className="max-h-[60vh] overflow-y-auto py-2"
          >
            {filteredCommands.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                <HelpCircle size={36} className="mx-auto mb-2 opacity-50" />
                <p>No commands found</p>
                <p className="text-sm mt-1">Try a different search term</p>
              </div>
            ) : (
              filteredCommands.map((group, groupIndex) => (
                <div key={group.category} className="mb-3">
                  <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                    {group.category}
                  </h3>
                  <ul>
                    {group.commands.map((command, cmdIndex) => {
                      const flatIndex = getFlattenedIndex(groupIndex, cmdIndex);
                      const isActive = activeIndex === flatIndex;
                      
                      return (
                        <li
                          key={command.id}
                          ref={isActive ? activeItemRef : null}
                          className={`px-4 py-2 cursor-pointer ${
                            isActive 
                              ? 'bg-primary/10 dark:bg-primary/20' 
                              : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                          onClick={() => {
                            setActiveIndex(flatIndex);
                            executeActiveCommand();
                          }}
                          onMouseEnter={() => setActiveIndex(flatIndex)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className={`mr-3 flex h-8 w-8 items-center justify-center rounded-lg ${
                                isActive 
                                  ? 'bg-primary text-white' 
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                              }`}>
                                {command.icon}
                              </span>
                              <span className="font-medium">{command.name}</span>
                            </div>
                            {command.shortcut && (
                              <div className="hidden sm:flex items-center space-x-1">
                                {command.shortcut.split(' ').map((key, i) => (
                                  <React.Fragment key={i}>
                                    {i > 0 && <span className="text-gray-400">+</span>}
                                    <kbd className="inline-flex h-6 items-center rounded border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-1.5 font-mono text-xs text-gray-500 dark:text-gray-400">
                                      {key}
                                    </kbd>
                                  </React.Fragment>
                                ))}
                              </div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))
            )}
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex justify-between items-center">
              <div>
                Press <kbd className="inline-flex h-5 items-center rounded border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-1 font-mono text-xs mx-1">?</kbd> anywhere to open this palette
              </div>
              <div>
                <a 
                  href="/keyboard-shortcuts" 
                  className="text-primary hover:text-primary-dark transition-colors" 
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(closeCommandPalette());
                    navigate('/keyboard-shortcuts');
                  }}
                >
                  View all shortcuts
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;