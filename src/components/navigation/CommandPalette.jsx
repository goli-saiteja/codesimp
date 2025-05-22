import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, FileText, Settings, Search, User, Bookmark, 
  TrendingUp, Tag, BarChart2, Calendar, Terminal,
  File, Coffee, Code, Bell, Filter, X, ArrowRight,
  HelpCircle, Star, Feather, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeSection, setActiveSection] = useState('all');
  const inputRef = useRef(null);
  const commandListRef = useRef(null);
  const navigate = useNavigate();
  
  // Reset state when opening palette
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      setActiveSection('all');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((prevIndex) => 
            prevIndex < filteredCommands.length - 1 ? prevIndex + 1 : prevIndex
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[activeIndex]) {
            executeCommand(filteredCommands[activeIndex]);
          }
          break;
        default:
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, query]);
  
  // Scroll active item into view
  useEffect(() => {
    const activeItem = document.getElementById(`command-${activeIndex}`);
    if (activeItem && commandListRef.current) {
      const container = commandListRef.current;
      const itemTop = activeItem.offsetTop;
      const itemBottom = itemTop + activeItem.offsetHeight;
      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.offsetHeight;
      
      if (itemTop < containerTop) {
        container.scrollTop = itemTop;
      } else if (itemBottom > containerBottom) {
        container.scrollTop = itemBottom - container.offsetHeight;
      }
    }
  }, [activeIndex]);
  
  // Command categories
  const categories = [
    { id: 'all', label: 'All', icon: Search },
    { id: 'navigation', label: 'Navigation', icon: ArrowRight },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'actions', label: 'Actions', icon: Terminal },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];
  
  // Command data
  const commands = [
    // Navigation commands
    { 
      id: 'home', 
      name: 'Go to Home', 
      shortcut: 'g h', 
      section: 'navigation',
      icon: Home, 
      action: () => navigate('/') 
    },
    { 
      id: 'explore', 
      name: 'Go to Explore', 
      shortcut: 'g e', 
      section: 'navigation',
      icon: TrendingUp, 
      action: () => navigate('/explore') 
    },
    { 
      id: 'bookmarks', 
      name: 'Go to Bookmarks', 
      shortcut: 'g b', 
      section: 'navigation',
      icon: Bookmark, 
      action: () => navigate('/bookmarks') 
    },
    { 
      id: 'profile', 
      name: 'Go to Profile', 
      shortcut: 'g p', 
      section: 'navigation',
      icon: User, 
      action: () => navigate('/profile') 
    },
    { 
      id: 'dashboard', 
      name: 'Go to Dashboard', 
      shortcut: 'g d', 
      section: 'navigation',
      icon: BarChart2, 
      action: () => navigate('/dashboard') 
    },
    { 
      id: 'notifications', 
      name: 'Go to Notifications', 
      shortcut: 'g n', 
      section: 'navigation',
      icon: Bell, 
      action: () => navigate('/notifications') 
    },
    { 
      id: 'settings', 
      name: 'Go to Settings', 
      shortcut: 'g s', 
      section: 'navigation',
      icon: Settings, 
      action: () => navigate('/settings') 
    },
    
    // Content commands
    { 
      id: 'create-article', 
      name: 'Create New Article', 
      shortcut: 'c a', 
      section: 'content',
      icon: Feather, 
      action: () => navigate('/editor') 
    },
    { 
      id: 'my-articles', 
      name: 'My Articles', 
      shortcut: 'm a', 
      section: 'content',
      icon: FileText, 
      action: () => navigate('/profile/articles') 
    },
    { 
      id: 'drafts', 
      name: 'View Drafts', 
      shortcut: 'v d', 
      section: 'content',
      icon: File, 
      action: () => navigate('/profile/drafts') 
    },
    { 
      id: 'browse-javascript', 
      name: 'Browse JavaScript Articles', 
      section: 'content',
      icon: Code, 
      action: () => navigate('/category/javascript') 
    },
    { 
      id: 'browse-react', 
      name: 'Browse React Articles', 
      section: 'content',
      icon: Code, 
      action: () => navigate('/category/react') 
    },
    
    // Action commands
    { 
      id: 'search-articles', 
      name: 'Search Articles', 
      shortcut: '/', 
      section: 'actions',
      icon: Search, 
      action: () => {
        onClose();
        setTimeout(() => {
          const searchInput = document.querySelector('input[placeholder*="Search"]');
          if (searchInput) searchInput.focus();
        }, 100);
      } 
    },
    { 
      id: 'toggle-theme', 
      name: 'Toggle Dark Theme', 
      shortcut: 't d', 
      section: 'actions',
      icon: Terminal, 
      action: () => {
        document.documentElement.classList.toggle('dark');
        onClose();
      } 
    },
    { 
      id: 'create-snippet', 
      name: 'Create Code Snippet', 
      section: 'actions',
      icon: Terminal, 
      action: () => navigate('/snippet/new') 
    },
    { 
      id: 'bookmark-page', 
      name: 'Bookmark Current Page', 
      shortcut: 'b', 
      section: 'actions',
      icon: Star, 
      action: () => {
        // Bookmark logic would go here
        onClose();
      } 
    },
    
    // Settings commands
    { 
      id: 'account-settings', 
      name: 'Account Settings', 
      section: 'settings',
      icon: User, 
      action: () => navigate('/settings/account') 
    },
    { 
      id: 'notification-settings', 
      name: 'Notification Settings', 
      section: 'settings',
      icon: Bell, 
      action: () => navigate('/settings/notifications') 
    },
    { 
      id: 'appearance-settings', 
      name: 'Appearance Settings', 
      section: 'settings',
      icon: Settings, 
      action: () => navigate('/settings/appearance') 
    },
    { 
      id: 'help', 
      name: 'Help & Support', 
      section: 'settings',
      icon: HelpCircle, 
      action: () => navigate('/help') 
    },
  ];
  
  // Filter commands based on query and active section
  const filteredCommands = commands.filter((command) => {
    const matchesQuery = query === '' || 
      command.name.toLowerCase().includes(query.toLowerCase());
    
    const matchesSection = activeSection === 'all' || 
      command.section === activeSection;
    
    return matchesQuery && matchesSection;
  });
  
  // Execute selected command
  const executeCommand = (command) => {
    onClose();
    command.action();
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 bg-neutral-900/50 backdrop-blur-sm">
          {/* Modal backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0"
            onClick={onClose}
          />
          
          {/* Command palette modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="relative mx-auto max-w-2xl transform divide-y divide-neutral-200 rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 overflow-hidden"
          >
            {/* Search input */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-neutral-400" />
              <input
                ref={inputRef}
                type="text"
                className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-neutral-900 placeholder:text-neutral-500 focus:ring-0 text-sm sm:text-base"
                placeholder="Search commands..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
              />
              <div className="absolute right-3 top-2.5">
                <kbd className="rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 text-xs font-medium text-neutral-500">
                  ESC
                </kbd>
              </div>
            </div>
            
            {/* Category tabs */}
            <div className="flex overflow-x-auto bg-neutral-50 px-2 text-sm font-medium text-neutral-900">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    className={`flex items-center space-x-1 whitespace-nowrap border-b-2 px-3 py-2 transition-colors ${
                      activeSection === category.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-neutral-600 hover:text-neutral-900'
                    }`}
                    onClick={() => {
                      setActiveSection(category.id);
                      setActiveIndex(0);
                    }}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{category.label}</span>
                  </button>
                );
              })}
            </div>
            
            {/* Command list */}
            <ul
              ref={commandListRef}
              className="max-h-72 scroll-py-2 overflow-y-auto py-2"
              role="listbox"
            >
              {filteredCommands.length === 0 ? (
                <li className="px-4 py-8 text-center">
                  <HelpCircle className="mx-auto h-6 w-6 text-neutral-400" />
                  <p className="mt-1 text-sm text-neutral-500">
                    No commands found. Try a different search.
                  </p>
                </li>
              ) : (
                filteredCommands.map((command, index) => {
                  const Icon = command.icon;
                  return (
                    <li
                      key={command.id}
                      id={`command-${index}`}
                      className={`cursor-pointer px-4 py-2 ${
                        activeIndex === index
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                      onClick={() => executeCommand(command)}
                      onMouseEnter={() => setActiveIndex(index)}
                      role="option"
                      aria-selected={activeIndex === index}
                    >
                      <div className="flex items-center">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-md ${
                          activeIndex === index
                            ? 'bg-primary-100 text-primary-600'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="ml-3 flex-1 truncate">{command.name}</span>
                        {command.shortcut && (
                          <span className="ml-2 flex items-center text-xs text-neutral-500">
                            {command.shortcut.split(' ').map((key, i) => (
                              <span key={i} className="flex items-center">
                                <kbd className="rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 font-medium text-neutral-500">
                                  {key}
                                </kbd>
                                {i < command.shortcut.split(' ').length - 1 && (
                                  <span className="mx-1">+</span>
                                )}
                              </span>
                            ))}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
            
            {filteredCommands.length > 0 && (
              <div className="flex flex-wrap items-center bg-neutral-50 px-4 py-2.5 text-xs text-neutral-500">
                <span className="flex items-center">
                  <ArrowRight className="mr-1 h-3.5 w-3.5" />
                  <span>to select</span>
                </span>
                <span className="mx-2">•</span>
                <span className="flex items-center">
                  <kbd className="rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 font-medium text-neutral-500">
                    ↑
                  </kbd>
                  <kbd className="ml-1 rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 font-medium text-neutral-500">
                    ↓
                  </kbd>
                  <span className="ml-1">to navigate</span>
                </span>
                <span className="mx-2">•</span>
                <span className="flex items-center">
                  <kbd className="rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 font-medium text-neutral-500">
                    Enter
                  </kbd>
                  <span className="ml-1">to confirm</span>
                </span>
                <span className="mx-2">•</span>
                <span className="flex items-center">
                  <kbd className="rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 font-medium text-neutral-500">
                    Esc
                  </kbd>
                  <span className="ml-1">to close</span>
                </span>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;