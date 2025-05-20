// src/components/search/AIAssistedSearch.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Search, X, Filter, Clock, Star, Code, Zap, 
  BookOpen, Trending, Tag, Command, Settings, AlertCircle
} from 'lucide-react';
import { setSearchQuery, setSearchFilters, clearSearch } from '../../store/slices/searchSlice';
import { useSearchQuery } from '../../services/apiService';
import { useDebounce } from '../../hooks/useDebounce';

// Languages for code-specific searches
const PROGRAMMING_LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', icon: '📘' },
  { id: 'typescript', name: 'TypeScript', icon: '📘' },
  { id: 'python', name: 'Python', icon: '🐍' },
  { id: 'java', name: 'Java', icon: '☕' },
  { id: 'csharp', name: 'C#', icon: '📗' },
  { id: 'cpp', name: 'C++', icon: '📙' },
  { id: 'go', name: 'Go', icon: '🐹' },
  { id: 'ruby', name: 'Ruby', icon: '💎' },
  { id: 'rust', name: 'Rust', icon: '🦀' },
  { id: 'kotlin', name: 'Kotlin', icon: '🏝️' },
  { id: 'swift', name: 'Swift', icon: '🐦' },
  { id: 'php', name: 'PHP', icon: '🐘' },
];

// AI-suggested search patterns
const AI_SEARCH_PATTERNS = [
  { type: 'function', pattern: 'function:methodName', description: 'Search for specific function implementations' },
  { type: 'class', pattern: 'class:ClassName', description: 'Find class definitions and usage' },
  { type: 'error', pattern: 'error:"error message"', description: 'Find solutions for specific error messages' },
  { type: 'pattern', pattern: 'pattern:designPattern', description: 'Search for design pattern implementations' },
  { type: 'package', pattern: 'package:packageName', description: 'Find tutorials and guides for specific packages' },
  { type: 'performance', pattern: 'performance:topic', description: 'Performance optimization techniques' },
  { type: 'security', pattern: 'security:vulnerability', description: 'Security best practices and fixes' },
  { type: 'testing', pattern: 'testing:framework', description: 'Testing methods and frameworks' },
];

const AIAssistedSearch = ({ fullWidth = false, showTrending = true, className = '' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchQuery, filters } = useSelector(state => state.search);
  const [query, setQuery] = useState(searchQuery || '');
  const [isOpen, setIsOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState(filters || {});
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [activeResult, setActiveResult] = useState(-1);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const debouncedQuery = useDebounce(query, 300);
  
  // RTK Query for search results
  const { data, isLoading, error } = useSearchQuery(
    { query: debouncedQuery, ...activeFilters },
    { skip: debouncedQuery.length < 2 }
  );
  
  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      } catch (error) {
        console.error('Failed to parse recent searches:', error);
      }
    }
  }, []);
  
  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowFilters(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Update suggestions when search results change
  useEffect(() => {
    if (data && debouncedQuery.length >= 2) {
      setSuggestions(data.results || []);
    } else {
      setSuggestions([]);
    }
  }, [data, debouncedQuery]);
  
  // Generate AI suggestions based on the current query
  useEffect(() => {
    if (debouncedQuery.length >= 3) {
      // Identify context in query to make intelligent suggestions
      const queryWords = debouncedQuery.toLowerCase().split(' ');
      const suggestions = [];
      
      // Check for programming language references
      const languageMatches = PROGRAMMING_LANGUAGES.filter(lang => 
        queryWords.includes(lang.name.toLowerCase()) || 
        queryWords.includes(lang.id.toLowerCase())
      );
      
      if (languageMatches.length > 0) {
        // Suggest common patterns for this language
        const language = languageMatches[0];
        suggestions.push({
          type: 'language',
          text: `${language.name} best practices`,
          query: `${language.name} best practices`,
          icon: language.icon,
        });
        
        // Check for problem-solving context
        if (queryWords.some(word => ['error', 'bug', 'issue', 'problem', 'fix'].includes(word))) {
          suggestions.push({
            type: 'error',
            text: `${language.name} common errors`,
            query: `${language.name} common errors and fixes`,
            icon: '🔧',
          });
        }
        
        // Check for learning context
        if (queryWords.some(word => ['learn', 'tutorial', 'guide', 'how'].includes(word))) {
          suggestions.push({
            type: 'tutorial',
            text: `${language.name} beginner tutorial`,
            query: `${language.name} beginner tutorial step by step`,
            icon: '📚',
          });
        }
      }
      
      // Check for technology context
      const techKeywords = ['react', 'vue', 'angular', 'node', 'express', 'django', 'flask', 'spring', 'tensorflow'];
      const techMatches = techKeywords.filter(tech => queryWords.includes(tech));
      
      if (techMatches.length > 0) {
        const tech = techMatches[0];
        suggestions.push({
          type: 'tech',
          text: `${tech} architecture patterns`,
          query: `${tech} architecture design patterns best practices`,
          icon: '📐',
        });
      }
      
      // Add smart operator suggestions
      const hasOperator = AI_SEARCH_PATTERNS.some(pattern => 
        debouncedQuery.includes(`${pattern.type}:`)
      );
      
      if (!hasOperator && debouncedQuery.length >= 5) {
        // Suggest relevant search operators based on query content
        if (queryWords.some(word => ['function', 'method', 'api'].includes(word))) {
          suggestions.push({
            type: 'operator',
            text: `Try: function:${queryWords[queryWords.length - 1]}`,
            query: `function:${queryWords[queryWords.length - 1]}`,
            icon: '⚡',
          });
        } else if (queryWords.some(word => ['class', 'component', 'object'].includes(word))) {
          suggestions.push({
            type: 'operator',
            text: `Try: class:${queryWords[queryWords.length - 1]}`,
            query: `class:${queryWords[queryWords.length - 1]}`,
            icon: '⚡',
          });
        } else if (queryWords.some(word => ['error', 'exception', 'bug'].includes(word))) {
          suggestions.push({
            type: 'operator',
            text: `Try: error:"${debouncedQuery.substring(debouncedQuery.indexOf('error') + 6)}"`,
            query: `error:"${debouncedQuery.substring(debouncedQuery.indexOf('error') + 6)}"`,
            icon: '⚡',
          });
        }
      }
      
      setAiSuggestions(suggestions);
    } else {
      setAiSuggestions([]);
    }
  }, [debouncedQuery]);
  
  // Handle search input change
  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setIsOpen(true);
    setActiveResult(-1);
  };
  
  // Clear search
  const handleClearSearch = () => {
    setQuery('');
    setIsOpen(false);
    setActiveResult(-1);
    dispatch(clearSearch());
    inputRef.current?.focus();
  };
  
  // Handle search submission
  const handleSearch = (searchTerm = query) => {
    if (!searchTerm.trim()) return;
    
    // Save to recent searches
    const updatedRecent = [
      { text: searchTerm, timestamp: new Date().toISOString() },
      ...recentSearches.filter(item => item.text !== searchTerm),
    ].slice(0, 5);
    
    setRecentSearches(updatedRecent);
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));
    
    // Update Redux state
    dispatch(setSearchQuery(searchTerm));
    dispatch(setSearchFilters(activeFilters));
    
    // Navigate to search results page
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    
    // Close dropdown
    setIsOpen(false);
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    // All results combined (AI suggestions, search results, etc.)
    const allResults = [
      ...aiSuggestions, 
      ...suggestions,
      ...recentSearches.map(item => ({ type: 'recent', text: item.text, query: item.text }))
    ];
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveResult(prev => (prev >= allResults.length - 1 ? 0 : prev + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveResult(prev => (prev <= 0 ? allResults.length - 1 : prev - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeResult >= 0 && activeResult < allResults.length) {
        handleSearch(allResults[activeResult].query);
      } else {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    }
  };
  
  // Toggle filter panel
  const toggleFilters = (e) => {
    e.stopPropagation();
    setShowFilters(!showFilters);
  };
  
  // Update filter settings
  const handleFilterChange = (key, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };
  
  return (
    <div 
      ref={searchRef}
      className={`relative ${fullWidth ? 'w-full' : 'w-64 md:w-96'} ${className}`}
    >
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          <Search size={18} />
        </div>
        <input
          ref={inputRef}
          type="search"
          placeholder="Search code patterns, tutorials, solutions..."
          className="w-full py-2.5 pl-10 pr-12 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
          {query && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <X size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={toggleFilters}
            className={`p-1 rounded-full ${
              Object.keys(activeFilters).length > 0 
                ? 'text-primary' 
                : 'text-gray-400 hover:text-gray-500 dark:hover:text-gray-300'
            }`}
          >
            <Filter size={16} />
          </button>
        </div>
      </div>
      
      {/* Filter Panel */}
      {showFilters && (
        <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg animate-in">
          <div className="p-3">
            <h3 className="text-sm font-semibold mb-2">Filter Results</h3>
            
            <div className="space-y-3">
              {/* Content Type Filter */}
              <div>
                <label className="text-xs font-medium">Content Type</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {['Articles', 'Tutorials', 'Code Snippets', 'Discussions', 'Projects'].map(type => (
                    <button
                      key={type}
                      className={`text-xs px-2 py-1 rounded ${
                        activeFilters.contentType === type.toLowerCase() 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                      onClick={() => handleFilterChange('contentType', 
                        activeFilters.contentType === type.toLowerCase() ? null : type.toLowerCase()
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Programming Language Filter */}
              <div>
                <label className="text-xs font-medium">Programming Language</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {PROGRAMMING_LANGUAGES.slice(0, 8).map(lang => (
                    <button
                      key={lang.id}
                      className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${
                        activeFilters.language === lang.id 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                      onClick={() => handleFilterChange('language', 
                        activeFilters.language === lang.id ? null : lang.id
                      )}
                    >
                      <span>{lang.icon}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Date Range Filter */}
              <div>
                <label className="text-xs font-medium">Date Range</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {['Last Week', 'Last Month', 'Last Year', 'All Time'].map(range => (
                    <button
                      key={range}
                      className={`text-xs px-2 py-1 rounded ${
                        activeFilters.dateRange === range.toLowerCase().replace(' ', '_') 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                      onClick={() => handleFilterChange('dateRange', 
                        activeFilters.dateRange === range.toLowerCase().replace(' ', '_') 
                          ? null 
                          : range.toLowerCase().replace(' ', '_')
                      )}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Experience Level Filter */}
              <div>
                <label className="text-xs font-medium">Experience Level</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                    <button
                      key={level}
                      className={`text-xs px-2 py-1 rounded ${
                        activeFilters.level === level.toLowerCase() 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                      onClick={() => handleFilterChange('level', 
                        activeFilters.level === level.toLowerCase() ? null : level.toLowerCase()
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Filter Actions */}
            <div className="flex justify-between mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
              <button
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setActiveFilters({})}
              >
                Reset Filters
              </button>
              <button
                className="text-xs text-primary hover:text-primary-dark font-medium"
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto animate-in">
          {/* AI Search Suggestions based on current query */}
          {aiSuggestions.length > 0 && (
            <div className="p-2">
              <div className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                <Zap size={14} />
                <span>AI Suggestions</span>
              </div>
              <ul>
                {aiSuggestions.map((suggestion, index) => (
                  <li key={`ai-${index}`}>
                    <button
                      className={`flex items-center px-3 py-2 w-full text-left rounded ${
                        activeResult === index 
                          ? 'bg-primary/10 dark:bg-primary/20' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => handleSearch(suggestion.query)}
                      onMouseEnter={() => setActiveResult(index)}
                    >
                      <span className="mr-2">{suggestion.icon}</span>
                      <div>
                        <div className="text-sm font-medium">{suggestion.text}</div>
                        {suggestion.type === 'operator' && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Performs a specialized semantic search
                          </div>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Search Results */}
          {isLoading ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <div className="flex justify-center mb-2">
                <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
              <p>Searching for the best results...</p>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="p-2">
              <div className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                <Search size={14} />
                <span>Search Results</span>
              </div>
              <ul>
                {suggestions.map((result, index) => (
                  <li key={result.id}>
                    <button
                      className={`flex items-center px-3 py-2 w-full text-left rounded ${
                        activeResult === aiSuggestions.length + index 
                          ? 'bg-primary/10 dark:bg-primary/20' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => handleSearch(result.title)}
                      onMouseEnter={() => setActiveResult(aiSuggestions.length + index)}
                    >
                      {result.type === 'article' ? (
                        <BookOpen size={16} className="mr-2 text-primary" />
                      ) : result.type === 'snippet' ? (
                        <Code size={16} className="mr-2 text-primary" />
                      ) : (
                        <Search size={16} className="mr-2 text-primary" />
                      )}
                      <div>
                        <div className="text-sm font-medium" 
                          dangerouslySetInnerHTML={{ 
                            __html: result.title.replace(
                              new RegExp(`(${query})`, 'gi'), 
                              '<span class="bg-yellow-200 dark:bg-yellow-800">$1</span>'
                            )
                          }} 
                        />
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {result.excerpt.substring(0, 60)}...
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <AlertCircle size={24} className="mx-auto mb-2" />
              <p>No results found for "{query}"</p>
              <p className="text-xs mt-1">Try different keywords or check your filters</p>
            </div>
          ) : null}
          
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                <Clock size={14} />
                <span>Recent Searches</span>
              </div>
              <ul>
                {recentSearches.map((item, index) => (
                  <li key={`recent-${index}`}>
                    <button
                      className={`flex items-center px-3 py-2 w-full text-left rounded ${
                        activeResult === aiSuggestions.length + suggestions.length + index 
                          ? 'bg-primary/10 dark:bg-primary/20' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => handleSearch(item.text)}
                      onMouseEnter={() => setActiveResult(aiSuggestions.length + suggestions.length + index)}
                    >
                      <Clock size={16} className="mr-2 text-gray-400" />
                      <span className="text-sm">{item.text}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Trending Searches */}
          {showTrending && !query && (
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                <Trending size={14} />
                <span>Trending Searches</span>
              </div>
              <ul>
                {[
                  'React performance optimization',
                  'Modern JavaScript features',
                  'GraphQL vs REST API',
                  'TypeScript best practices',
                  'Docker for developers'
                ].map((trend, index) => (
                  <li key={`trend-${index}`}>
                    <button
                      className="flex items-center px-3 py-2 w-full text-left rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => handleSearch(trend)}
                    >
                      <Trending size={16} className="mr-2 text-gray-400" />
                      <span className="text-sm">{trend}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Search Tips */}
          {!query && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center space-x-1 mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                <Command size={14} />
                <span>Search Tips</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">function:name</code>
                  <span>Find functions</span>
                </div>
                <div className="flex items-center space-x-1">
                  <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">class:name</code>
                  <span>Find classes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">error:"message"</code>
                  <span>Find error solutions</span>
                </div>
                <div className="flex items-center space-x-1">
                  <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">language:name</code>
                  <span>Filter by language</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIAssistedSearch;