import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Search, Filter, TrendingUp, Clock, BarChart2, Zap, 
  Code, BookOpen, Server, Database, Globe, CloudLightning, 
  Shield, Cpu, Calendar, Coffee, Star, PenTool, X, ChevronDown
} from 'lucide-react';
import ArticleCard from '../components/blog/ArticleCard';

const ExplorePage = () => {
  const dispatch = useDispatch();
  
  // State for content
  const [articles, setArticles] = useState([]);
  const [tags, setTags] = useState([]);
  const [featuredAuthors, setFeaturedAuthors] = useState([]);
  const [collections, setCollections] = useState([]);
  
  // State for loading
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('trending');
  const [activeTag, setActiveTag] = useState('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    timeRange: 'week',
    categories: [],
    readTime: 'any'
  });
  
  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, these would be API calls
        // Here we'll just use setTimeout to simulate network requests
        
        // Fetch articles
        setTimeout(() => {
          const mockArticles = [
            {
              id: 1,
              title: 'Building Scalable React Applications with Redux Toolkit',
              excerpt: 'Learn how to structure large-scale React applications with Redux Toolkit for optimal performance and maintainability.',
              coverImage: '/api/placeholder/640/360',
              author: {
                id: 1,
                name: 'Sarah Chen',
                avatar: '/api/placeholder/40/40',
                username: 'sarahchen'
              },
              publishedAt: '2023-05-15T10:30:00Z',
              readTime: 8,
              tags: ['react', 'redux', 'javascript'],
              commentsCount: 24,
              likesCount: 182,
              bookmarked: false,
              featured: true
            },
            {
              id: 2,
              title: 'Advanced TypeScript Patterns for Frontend Developers',
              excerpt: 'Explore advanced TypeScript features and patterns that will take your frontend development skills to the next level.',
              coverImage: '/api/placeholder/640/360',
              author: {
                id: 2,
                name: 'Alex Rivera',
                avatar: '/api/placeholder/40/40',
                username: 'alexrivera'
              },
              publishedAt: '2023-05-12T14:45:00Z',
              readTime: 12,
              tags: ['typescript', 'javascript', 'frontend'],
              commentsCount: 18,
              likesCount: 145,
              bookmarked: true,
              featured: true
            },
            {
              id: 3,
              title: 'Microservices Architecture with Node.js and Docker',
              excerpt: 'A comprehensive guide to building and deploying microservices using Node.js, Express, and Docker containers.',
              coverImage: '/api/placeholder/640/360',
              author: {
                id: 3,
                name: 'Michael Johnson',
                avatar: '/api/placeholder/40/40',
                username: 'michaelj'
              },
              publishedAt: '2023-05-10T09:15:00Z',
              readTime: 15,
              tags: ['node.js', 'microservices', 'docker'],
              commentsCount: 32,
              likesCount: 210,
              bookmarked: false,
              featured: false
            },
            {
              id: 4,
              title: 'CSS Grid vs Flexbox: When to Use Each Layout System',
              excerpt: 'Understand the strengths and weaknesses of CSS Grid and Flexbox to choose the right layout system for your projects.',
              coverImage: '/api/placeholder/640/360',
              author: {
                id: 4,
                name: 'Emma Patel',
                avatar: '/api/placeholder/40/40',
                username: 'emmapatel'
              },
              publishedAt: '2023-05-08T16:20:00Z',
              readTime: 6,
              tags: ['css', 'frontend', 'web design'],
              commentsCount: 15,
              likesCount: 98,
              bookmarked: false,
              featured: false
            },
            {
              id: 5,
              title: 'Building a Real-time Chat Application with Socket.io',
              excerpt: 'Learn how to create a real-time chat application using Socket.io, React, and Express for seamless communication.',
              coverImage: '/api/placeholder/640/360',
              author: {
                id: 5,
                name: 'David Kim',
                avatar: '/api/placeholder/40/40',
                username: 'davidkim'
              },
              publishedAt: '2023-05-06T11:30:00Z',
              readTime: 10,
              tags: ['socket.io', 'react', 'node.js'],
              commentsCount: 27,
              likesCount: 173,
              bookmarked: true,
              featured: true
            },
            {
              id: 6,
              title: 'Introduction to GraphQL for REST API Developers',
              excerpt: 'Transitioning from REST to GraphQL? This guide covers everything you need to know about this powerful query language.',
              coverImage: '/api/placeholder/640/360',
              author: {
                id: 6,
                name: 'Olivia Martinez',
                avatar: '/api/placeholder/40/40',
                username: 'oliviam'
              },
              publishedAt: '2023-05-04T13:45:00Z',
              readTime: 9,
              tags: ['graphql', 'api', 'backend'],
              commentsCount: 21,
              likesCount: 132,
              bookmarked: false,
              featured: false
            },
          ];
          
          setArticles(mockArticles);
          
          // Fetch tags
          const mockTags = [
            { id: 'javascript', name: 'JavaScript', count: 1243 },
            { id: 'react', name: 'React', count: 982 },
            { id: 'node.js', name: 'Node.js', count: 784 },
            { id: 'typescript', name: 'TypeScript', count: 651 },
            { id: 'frontend', name: 'Frontend', count: 589 },
            { id: 'css', name: 'CSS', count: 478 },
            { id: 'backend', name: 'Backend', count: 412 },
            { id: 'database', name: 'Database', count: 375 },
            { id: 'api', name: 'API', count: 328 },
            { id: 'devops', name: 'DevOps', count: 305 },
            { id: 'security', name: 'Security', count: 298 },
            { id: 'algorithms', name: 'Algorithms', count: 267 },
          ];
          
          setTags(mockTags);
          
          // Fetch featured authors
          const mockFeaturedAuthors = [
            {
              id: 1,
              name: 'Sarah Chen',
              username: 'sarahchen',
              avatar: '/api/placeholder/64/64',
              bio: 'Senior Frontend Developer at TechFlow Inc.',
              articleCount: 24,
              followers: 1248
            },
            {
              id: 2,
              name: 'Alex Rivera',
              username: 'alexrivera',
              avatar: '/api/placeholder/64/64',
              bio: 'Full Stack Developer | JavaScript Enthusiast',
              articleCount: 18,
              followers: 943
            },
            {
              id: 3,
              name: 'Michael Johnson',
              username: 'michaelj',
              avatar: '/api/placeholder/64/64',
              bio: 'Backend Engineer specializing in microservices',
              articleCount: 15,
              followers: 782
            },
            {
              id: 4,
              name: 'Emma Patel',
              username: 'emmapatel',
              avatar: '/api/placeholder/64/64',
              bio: 'UX Developer | CSS Wizard',
              articleCount: 12,
              followers: 654
            },
          ];
          
          setFeaturedAuthors(mockFeaturedAuthors);
          
          // Fetch collections
          const mockCollections = [
            {
              id: 'tutorials',
              name: 'Tutorials',
              description: 'Step-by-step guides to learn new technologies',
              icon: Coffee,
              articleCount: 487,
              color: 'bg-amber-100 text-amber-600 border-amber-200'
            },
            {
              id: 'best-practices',
              name: 'Best Practices',
              description: 'Industry standards and recommended approaches',
              icon: Star,
              articleCount: 324,
              color: 'bg-blue-100 text-blue-600 border-blue-200'
            },
            {
              id: 'case-studies',
              name: 'Case Studies',
              description: 'Real-world examples and solutions',
              icon: BookOpen,
              articleCount: 156,
              color: 'bg-emerald-100 text-emerald-600 border-emerald-200'
            },
            {
              id: 'getting-started',
              name: 'Getting Started',
              description: 'Beginner-friendly introductions to technologies',
              icon: Zap,
              articleCount: 289,
              color: 'bg-purple-100 text-purple-600 border-purple-200'
            },
          ];
          
          setCollections(mockCollections);
          
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        setError('Failed to load content. Please try again later.');
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter articles based on active tab and filters
  const filteredArticles = () => {
    let result = [...articles];
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(article => 
        article.title.toLowerCase().includes(query) || 
        article.excerpt.toLowerCase().includes(query) || 
        article.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Filter by tab
    switch (activeTab) {
      case 'trending':
        result = result.sort((a, b) => b.likesCount - a.likesCount);
        break;
      case 'latest':
        result = result.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        break;
      case 'featured':
        result = result.filter(article => article.featured);
        break;
      default:
        break;
    }
    
    // Filter by tag
    if (activeTag !== 'all') {
      result = result.filter(article => article.tags.includes(activeTag));
    }
    
    // Apply additional filters
    if (filters.categories.length > 0) {
      result = result.filter(article => 
        article.tags.some(tag => filters.categories.includes(tag))
      );
    }
    
    if (filters.readTime !== 'any') {
      switch (filters.readTime) {
        case 'short':
          result = result.filter(article => article.readTime <= 5);
          break;
        case 'medium':
          result = result.filter(article => article.readTime > 5 && article.readTime <= 10);
          break;
        case 'long':
          result = result.filter(article => article.readTime > 10);
          break;
        default:
          break;
      }
    }
    
    return result;
  };
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    // Actually, we're already filtering as they type in the controlled input
    // This is for when the user presses enter or clicks the search button
  };
  
  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setActiveTag('all');
    setFilters({
      timeRange: 'week',
      categories: [],
      readTime: 'any'
    });
  };
  
  // Format large numbers
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };
  
  // Toggle category in filters
  const toggleCategory = (category) => {
    setFilters(prev => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      
      return {
        ...prev,
        categories
      };
    });
  };
  
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="w-full bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Explore Coding Articles & Tutorials
            </h1>
            <p className="text-lg text-neutral-600">
              Discover insightful articles, tutorials, and code snippets from top developers around the world.
            </p>
          </div>
          
          {/* Search bar */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                className="w-full py-3 pl-12 pr-4 rounded-full border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-soft"
                placeholder="Search articles, topics, or tags..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Search className="h-5 w-5 text-neutral-400" />
              </div>
              {searchQuery && (
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-neutral-400 hover:text-neutral-600"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-64 md:mr-8 mb-8 md:mb-0">
            <div className="md:sticky md:top-24">
              {/* Filter section */}
              <div className="bg-white rounded-xl border border-neutral-200 shadow-soft p-5 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-neutral-900">Filters</h3>
                  {(searchQuery || activeTag !== 'all' || filters.categories.length > 0 || filters.readTime !== 'any') && (
                    <button 
                      className="text-sm text-primary-600 hover:text-primary-700"
                      onClick={clearFilters}
                    >
                      Clear all
                    </button>
                  )}
                </div>
                
                {/* Time range filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-neutral-700 mb-3">Time Range</h4>
                  <div className="space-y-2">
                    {['day', 'week', 'month', 'year', 'all'].map(range => (
                      <label key={range} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          className="form-radio"
                          checked={filters.timeRange === range}
                          onChange={() => setFilters({...filters, timeRange: range})}
                        />
                        <span className="ml-2 text-sm text-neutral-600 capitalize">
                          {range === 'all' ? 'All time' : `Past ${range}`}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Categories filter */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-neutral-700 mb-3">Categories</h4>
                  <div className="space-y-2">
                    {['javascript', 'react', 'node.js', 'css', 'frontend', 'backend'].map(category => (
                      <label key={category} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          checked={filters.categories.includes(category)}
                          onChange={() => toggleCategory(category)}
                        />
                        <span className="ml-2 text-sm text-neutral-600 capitalize">
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Read time filter */}
                <div className="mb-2">
                  <h4 className="text-sm font-medium text-neutral-700 mb-3">Read Time</h4>
                  <div className="space-y-2">
                    {[
                      { value: 'any', label: 'Any length' },
                      { value: 'short', label: 'Short (< 5 min)' },
                      { value: 'medium', label: 'Medium (5-10 min)' },
                      { value: 'long', label: 'Long (> 10 min)' },
                    ].map(option => (
                      <label key={option.value} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          className="form-radio"
                          checked={filters.readTime === option.value}
                          onChange={() => setFilters({...filters, readTime: option.value})}
                        />
                        <span className="ml-2 text-sm text-neutral-600">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Tags section */}
              <div className="bg-white rounded-xl border border-neutral-200 shadow-soft p-5">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 12).map(tag => (
                    <button
                      key={tag.id}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                        activeTag === tag.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      } transition-colors`}
                      onClick={() => setActiveTag(tag.id === activeTag ? 'all' : tag.id)}
                    >
                      #{tag.name}
                    </button>
                  ))}
                </div>
                <Link 
                  to="/tags" 
                  className="inline-block mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  View all tags
                </Link>
              </div>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="flex items-center mb-8 overflow-x-auto pb-2">
              <div className="flex space-x-1 bg-neutral-100 p-1 rounded-lg">
                <button
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'trending'
                      ? 'bg-white text-neutral-900 shadow-soft'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                  onClick={() => setActiveTab('trending')}
                >
                  <TrendingUp className="h-4 w-4 mr-1.5" />
                  Trending
                </button>
                <button
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'latest'
                      ? 'bg-white text-neutral-900 shadow-soft'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                  onClick={() => setActiveTab('latest')}
                >
                  <Clock className="h-4 w-4 mr-1.5" />
                  Latest
                </button>
                <button
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'featured'
                      ? 'bg-white text-neutral-900 shadow-soft'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                  onClick={() => setActiveTab('featured')}
                >
                  <Star className="h-4 w-4 mr-1.5" />
                  Featured
                </button>
              </div>
              
              <div className="ml-auto">
                {/* Mobile filter toggle */}
                <button 
                  className="md:hidden flex items-center px-3 py-1.5 text-sm font-medium border border-neutral-300 rounded-md bg-white text-neutral-700 hover:bg-neutral-50"
                  onClick={() => setFiltersOpen(!filtersOpen)}
                >
                  <Filter className="h-4 w-4 mr-1.5" />
                  Filters
                  {(searchQuery || activeTag !== 'all' || filters.categories.length > 0 || filters.readTime !== 'any') && (
                    <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-700">
                      !
                    </span>
                  )}
                </button>
              </div>
            </div>
            
            {/* Results count and active filters */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-neutral-900">
                  {isLoading ? 'Loading articles...' : `${filteredArticles().length} articles found`}
                </h2>
              </div>
              
              {/* Active filters */}
              {(activeTag !== 'all' || filters.categories.length > 0 || filters.readTime !== 'any') && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {activeTag !== 'all' && (
                    <div className="flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm">
                      <span>Tag: {activeTag}</span>
                      <button
                        className="ml-1.5 text-primary-700 hover:text-primary-900"
                        onClick={() => setActiveTag('all')}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                  
                  {filters.categories.map(category => (
                    <div 
                      key={category}
                      className="flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm"
                    >
                      <span>Category: {category}</span>
                      <button
                        className="ml-1.5 text-primary-700 hover:text-primary-900"
                        onClick={() => toggleCategory(category)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  
                  {filters.readTime !== 'any' && (
                    <div className="flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm">
                      <span>
                        Read time: {
                          filters.readTime === 'short' ? 'Short (< 5 min)' :
                          filters.readTime === 'medium' ? 'Medium (5-10 min)' :
                          'Long (> 10 min)'
                        }
                      </span>
                      <button
                        className="ml-1.5 text-primary-700 hover:text-primary-900"
                        onClick={() => setFilters({...filters, readTime: 'any'})}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Loading state */}
            {isLoading ? (
              <div className="space-y-8">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="h-64 bg-neutral-200 rounded-xl mb-4"></div>
                    <div className="h-8 bg-neutral-200 rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-neutral-200 rounded mb-2 w-1/2"></div>
                    <div className="flex items-center mt-4">
                      <div className="h-10 w-10 rounded-full bg-neutral-200 mr-3"></div>
                      <div>
                        <div className="h-4 bg-neutral-200 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-neutral-200 rounded w-24"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md">
                <p className="font-medium">{error}</p>
              </div>
            ) : (
              <>
                {/* Articles grid */}
                {filteredArticles().length === 0 ? (
                  <div className="text-center py-16">
                    <BookOpen className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
                    <h3 className="text-xl font-semibold text-neutral-800 mb-2">No articles found</h3>
                    <p className="text-neutral-500 mb-6">
                      Try adjusting your filters or search query to find what you're looking for.
                    </p>
                    <button 
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                      onClick={clearFilters}
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-8">
                    {filteredArticles().map(article => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                )}
                
                {/* Show more button */}
                {filteredArticles().length > 0 && (
                  <div className="text-center mt-12">
                    <button className="btn-outline">
                      Load More Articles
                    </button>
                  </div>
                )}
              </>
            )}
            
            {/* Collections section */}
            <div className="mt-16 pt-8 border-t border-neutral-200">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Featured Collections</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {collections.map(collection => {
                  const CollectionIcon = collection.icon;
                  return (
                    <Link
                      key={collection.id}
                      to={`/collection/${collection.id}`}
                      className="flex items-start p-5 rounded-xl bg-white border border-neutral-200 shadow-soft hover:shadow-soft-md transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className={`flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg mr-4 ${collection.color}`}>
                        <CollectionIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                          {collection.name}
                        </h3>
                        <p className="text-neutral-600 text-sm mb-2">{collection.description}</p>
                        <div className="text-sm text-neutral-500">
                          {collection.articleCount} articles
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
            
            {/* Featured authors section */}
            <div className="mt-16 pt-8 border-t border-neutral-200">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Featured Authors</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {featuredAuthors.map(author => (
                  <Link
                    key={author.id}
                    to={`/profile/${author.username}`}
                    className="text-center p-5 rounded-xl bg-white border border-neutral-200 shadow-soft hover:shadow-soft-md transition-all duration-300 hover:-translate-y-1"
                  >
                    <img
                      src={author.avatar}
                      alt={author.name}
                      className="h-20 w-20 rounded-full mx-auto mb-4 border-2 border-neutral-200"
                    />
                    <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                      {author.name}
                    </h3>
                    <p className="text-neutral-600 text-sm line-clamp-2 mb-2">{author.bio}</p>
                    <div className="flex justify-center items-center space-x-4 text-sm text-neutral-500">
                      <div className="flex items-center">
                        <FileText className="h-3.5 w-3.5 mr-1" />
                        {author.articleCount}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-3.5 w-3.5 mr-1" />
                        {formatNumber(author.followers)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Categories section */}
            <div className="mt-16 pt-8 border-t border-neutral-200">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Popular Categories</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link to="/category/javascript" className="block p-6 bg-gradient-to-br from-yellow-50 to-amber-50 border border-amber-100 rounded-xl hover:shadow-soft-md transition-shadow">
                  <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 mb-4">
                    <Code className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-1">JavaScript</h3>
                  <p className="text-sm text-neutral-600 mb-3">Modern JavaScript concepts, tips, and best practices</p>
                  <span className="text-xs font-medium text-neutral-500">842 articles</span>
                </Link>
                
                <Link to="/category/react" className="block p-6 bg-gradient-to-br from-sky-50 to-blue-50 border border-blue-100 rounded-xl hover:shadow-soft-md transition-shadow">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                    <Code className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-1">React</h3>
                  <p className="text-sm text-neutral-600 mb-3">Component design, hooks, state management, and more</p>
                  <span className="text-xs font-medium text-neutral-500">765 articles</span>
                </Link>
                
                <Link to="/category/node" className="block p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-emerald-100 rounded-xl hover:shadow-soft-md transition-shadow">
                  <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mb-4">
                    <Server className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-1">Node.js</h3>
                  <p className="text-sm text-neutral-600 mb-3">Server-side JavaScript, APIs, and backend development</p>
                  <span className="text-xs font-medium text-neutral-500">531 articles</span>
                </Link>
                
                <Link to="/category/typescript" className="block p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl hover:shadow-soft-md transition-shadow">
                  <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                    <Code className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-1">TypeScript</h3>
                  <p className="text-sm text-neutral-600 mb-3">Type systems, interfaces, and advanced patterns</p>
                  <span className="text-xs font-medium text-neutral-500">478 articles</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile filters (offscreen panel) */}
      {filtersOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-white md:hidden">
            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
              <h3 className="text-lg font-semibold text-neutral-900">Filters</h3>
              <button
                className="p-2 text-neutral-500 hover:text-neutral-700"
                onClick={() => setFiltersOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-screen pb-20">
              {/* Mobile filters content - same as sidebar filters */}
              {/* Time range filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-neutral-700 mb-3">Time Range</h4>
                <div className="space-y-2">
                  {['day', 'week', 'month', 'year', 'all'].map(range => (
                    <label key={range} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        className="form-radio"
                        checked={filters.timeRange === range}
                        onChange={() => setFilters({...filters, timeRange: range})}
                      />
                      <span className="ml-2 text-sm text-neutral-600 capitalize">
                        {range === 'all' ? 'All time' : `Past ${range}`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Categories filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-neutral-700 mb-3">Categories</h4>
                <div className="space-y-2">
                  {['javascript', 'react', 'node.js', 'css', 'frontend', 'backend'].map(category => (
                    <label key={category} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={filters.categories.includes(category)}
                        onChange={() => toggleCategory(category)}
                      />
                      <span className="ml-2 text-sm text-neutral-600 capitalize">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Read time filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-neutral-700 mb-3">Read Time</h4>
                <div className="space-y-2">
                  {[
                    { value: 'any', label: 'Any length' },
                    { value: 'short', label: 'Short (< 5 min)' },
                    { value: 'medium', label: 'Medium (5-10 min)' },
                    { value: 'long', label: 'Long (> 10 min)' },
                  ].map(option => (
                    <label key={option.value} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        className="form-radio"
                        checked={filters.readTime === option.value}
                        onChange={() => setFilters({...filters, readTime: option.value})}
                      />
                      <span className="ml-2 text-sm text-neutral-600">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Popular tags */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-neutral-700 mb-3">Popular Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 12).map(tag => (
                    <button
                      key={tag.id}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                        activeTag === tag.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      } transition-colors`}
                      onClick={() => {
                        setActiveTag(tag.id === activeTag ? 'all' : tag.id);
                        setFiltersOpen(false);
                      }}
                    >
                      #{tag.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-neutral-200">
                <div className="flex space-x-3">
                  <button
                    className="flex-1 py-2.5 bg-neutral-100 text-neutral-700 rounded-md font-medium"
                    onClick={() => {
                      clearFilters();
                      setFiltersOpen(false);
                    }}
                  >
                    Clear
                  </button>
                  <button
                    className="flex-1 py-2.5 bg-primary-600 text-white rounded-md font-medium"
                    onClick={() => setFiltersOpen(false)}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExplorePage;