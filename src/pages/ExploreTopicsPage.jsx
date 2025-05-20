// src/pages/ExploreTopicsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Hash, Trending, Code, Terminal, Bookmark, Eye, Filter, Search,
  ArrowUp, ArrowDown, Clock, Zap, Activity, Users, BookOpen,
  Laptop, Server, Database, Cloud, Shield, ChevronDown, ChevronUp, 
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import EnhancedPostCard from '../components/posts/EnhancedPostCard';

// Mock data for topics
const TOPICS = [
  { 
    id: 'javascript', 
    name: 'JavaScript', 
    icon: <Code size={20} />,
    color: '#f7df1e',
    description: 'High-level, often just-in-time compiled language that conforms to the ECMAScript specification.',
    followers: 32516,
    postCount: 12453,
    trending: true,
    categories: ['language', 'frontend', 'web'],
    relatedTopics: ['typescript', 'react', 'node-js'],
  },
  { 
    id: 'python', 
    name: 'Python', 
    icon: <Terminal size={20} />,
    color: '#3776ab',
    description: 'Interpreted high-level general-purpose programming language known for its readability.',
    followers: 45283,
    postCount: 18721,
    trending: true,
    categories: ['language', 'data-science', 'machine-learning'],
    relatedTopics: ['django', 'flask', 'pandas'],
  },
  { 
    id: 'react', 
    name: 'React', 
    icon: <Code size={20} />,
    color: '#61dafb',
    description: 'JavaScript library for building user interfaces, especially single-page applications.',
    followers: 39482,
    postCount: 15834,
    trending: true,
    categories: ['framework', 'frontend', 'web'],
    relatedTopics: ['javascript', 'redux', 'nextjs'],
  },
  { 
    id: 'devops', 
    name: 'DevOps', 
    icon: <Server size={20} />,
    color: '#6c5ce7',
    description: 'Set of practices that combines software development and IT operations to shorten the development lifecycle.',
    followers: 28319,
    postCount: 9873,
    trending: true,
    categories: ['practices', 'operations', 'infrastructure'],
    relatedTopics: ['kubernetes', 'docker', 'ci-cd'],
  },
  { 
    id: 'machine-learning', 
    name: 'Machine Learning', 
    icon: <Zap size={20} />,
    color: '#ff6b6b',
    description: 'Field of study that gives computers the ability to learn without being explicitly programmed.',
    followers: 35761,
    postCount: 11235,
    trending: true,
    categories: ['data-science', 'artificial-intelligence', 'algorithms'],
    relatedTopics: ['deep-learning', 'neural-networks', 'tensorflow'],
  },
  { 
    id: 'web-development', 
    name: 'Web Development', 
    icon: <Laptop size={20} />,
    color: '#0984e3',
    description: 'Building, creating, and maintaining websites including aspects such as web design, publishing, and database management.',
    followers: 42571,
    postCount: 19854,
    trending: false,
    categories: ['web', 'design', 'frontend'],
    relatedTopics: ['html', 'css', 'javascript'],
  },
  { 
    id: 'golang', 
    name: 'Go', 
    icon: <Code size={20} />,
    color: '#00add8',
    description: 'Statically typed, compiled programming language designed at Google, syntactically similar to C.',
    followers: 18942,
    postCount: 7826,
    trending: true,
    categories: ['language', 'backend', 'systems'],
    relatedTopics: ['backend', 'microservices', 'cloud'],
  },
  { 
    id: 'cybersecurity', 
    name: 'Cybersecurity', 
    icon: <Shield size={20} />,
    color: '#e84393',
    description: 'Practice of protecting systems, networks, and programs from digital attacks.',
    followers: 23517,
    postCount: 5683,
    trending: false,
    categories: ['security', 'networking', 'privacy'],
    relatedTopics: ['encryption', 'infosec', 'security'],
  },
  { 
    id: 'cloud-computing', 
    name: 'Cloud Computing', 
    icon: <Cloud size={20} />,
    color: '#4a69bd',
    description: 'On-demand availability of computer system resources, especially data storage and computing power.',
    followers: 29764,
    postCount: 10428,
    trending: false,
    categories: ['infrastructure', 'services', 'platforms'],
    relatedTopics: ['aws', 'azure', 'gcp'],
  },
  { 
    id: 'data-science', 
    name: 'Data Science', 
    icon: <Database size={20} />,
    color: '#20bf6b',
    description: 'Interdisciplinary field that uses scientific methods, processes, algorithms and systems to extract knowledge.',
    followers: 31526,
    postCount: 13571,
    trending: true,
    categories: ['analytics', 'statistics', 'science'],
    relatedTopics: ['machine-learning', 'python', 'data-visualization'],
  },
  { 
    id: 'typescript', 
    name: 'TypeScript', 
    icon: <Code size={20} />,
    color: '#3178c6',
    description: 'Strict syntactical superset of JavaScript that adds static typing to the language.',
    followers: 25183,
    postCount: 8976,
    trending: true,
    categories: ['language', 'frontend', 'web'],
    relatedTopics: ['javascript', 'react', 'angular'],
  },
  { 
    id: 'containers', 
    name: 'Containers', 
    icon: <Database size={20} />,
    color: '#0db7ed',
    description: 'Lightweight, standalone, executable package of software that includes everything needed to run an application.',
    followers: 21892,
    postCount: 6543,
    trending: false,
    categories: ['infrastructure', 'devops', 'cloud'],
    relatedTopics: ['docker', 'kubernetes', 'microservices'],
  },
];

// Mock data for popular posts by topic
const POPULAR_POSTS = [
  {
    id: '1',
    title: 'Understanding React Hooks: A Deep Dive into useState and useEffect',
    excerpt: 'Learn how to effectively use React Hooks to manage state and side effects in your functional components.',
    author: {
      id: '101',
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/41.jpg',
      followers: 2345
    },
    publishedAt: '2025-05-08T09:30:00Z',
    readTime: 12,
    likes: 567,
    comments: 83,
    views: 10291,
    tags: ['React', 'JavaScript', 'Web Development'],
    coverImage: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    language: 'javascript',
    topic: 'react',
  },
  {
    id: '2',
    title: 'Building Microservices with Go and Docker',
    excerpt: 'A comprehensive guide to building scalable microservices using Go programming language and Docker containerization.',
    author: {
      id: '102',
      name: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      followers: 1872
    },
    publishedAt: '2025-05-12T14:15:00Z',
    readTime: 15,
    likes: 723,
    comments: 103,
    views: 15423,
    tags: ['Go', 'Docker', 'Microservices'],
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    language: 'go',
    topic: 'golang',
  },
  {
    id: '3',
    title: 'Machine Learning for Beginners: From Theory to Practice',
    excerpt: 'An introduction to machine learning concepts and practical implementation using Python and scikit-learn.',
    author: {
      id: '103',
      name: 'Alex Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      followers: 3219
    },
    publishedAt: '2025-05-03T11:45:00Z',
    readTime: 18,
    likes: 912,
    comments: 145,
    views: 25846,
    tags: ['Machine Learning', 'Python', 'Data Science'],
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    language: 'python',
    topic: 'machine-learning',
  },
  {
    id: '4',
    title: 'Implementing CI/CD Pipelines with GitHub Actions',
    excerpt: 'Learn how to set up efficient continuous integration and deployment workflows using GitHub Actions.',
    author: {
      id: '104',
      name: 'Emma Wilson',
      avatar: 'https://randomuser.me/api/portraits/women/29.jpg',
      followers: 1542
    },
    publishedAt: '2025-05-06T08:20:00Z',
    readTime: 10,
    likes: 486,
    comments: 67,
    views: 9723,
    tags: ['DevOps', 'CI/CD', 'GitHub'],
    coverImage: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80',
    language: 'yaml',
    topic: 'devops',
  },
  {
    id: '5',
    title: 'Securing Web Applications: Best Practices and Common Vulnerabilities',
    excerpt: 'A comprehensive guide to protecting your web applications from common security threats and vulnerabilities.',
    author: {
      id: '105',
      name: 'David Kim',
      avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
      followers: 2865
    },
    publishedAt: '2025-05-09T16:40:00Z',
    readTime: 14,
    likes: 678,
    comments: 91,
    views: 12547,
    tags: ['Cybersecurity', 'Web Development', 'Security'],
    coverImage: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    language: 'javascript',
    topic: 'cybersecurity',
  },
  {
    id: '6',
    title: 'Advanced TypeScript Patterns for Enterprise Applications',
    excerpt: 'Discover advanced TypeScript patterns and techniques for building scalable and maintainable enterprise applications.',
    author: {
      id: '106',
      name: 'Olivia Martinez',
      avatar: 'https://randomuser.me/api/portraits/women/57.jpg',
      followers: 2103
    },
    publishedAt: '2025-05-11T10:15:00Z',
    readTime: 16,
    likes: 543,
    comments: 72,
    views: 11368,
    tags: ['TypeScript', 'Enterprise', 'Programming'],
    coverImage: 'https://images.unsplash.com/photo-1607706189992-eae578626c86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    language: 'typescript',
    topic: 'typescript',
  },
];

const ExploreTopicsPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode } = useSelector(state => state.ui);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  const [currentTopic, setCurrentTopic] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [timeFilter, setTimeFilter] = useState('all');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTopics, setFilteredTopics] = useState(TOPICS);
  
  // Initialize topic and posts
  useEffect(() => {
    // Reset scroll position when navigating to a new topic
    window.scrollTo(0, 0);
    
    if (topicId) {
      // Find the current topic
      const topic = TOPICS.find(t => t.id === topicId);
      setCurrentTopic(topic || null);
      
      // Initialize following status (in a real app, this would be fetched from the API)
      setIsFollowing(false);
      
      // Filter posts for this topic
      const topicPosts = POPULAR_POSTS.filter(post => post.topic === topicId || post.tags.includes(topic?.name));
      setPosts(topicPosts);
    } else {
      setCurrentTopic(null);
      setPosts(POPULAR_POSTS);
    }
    
    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, [topicId]);
  
  // Filter topics based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTopics(TOPICS);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = TOPICS.filter(topic => 
        topic.name.toLowerCase().includes(query) || 
        topic.description.toLowerCase().includes(query) ||
        topic.categories.some(cat => cat.toLowerCase().includes(query))
      );
      setFilteredTopics(filtered);
    }
  }, [searchQuery]);
  
  // Sort posts based on criteria
  const sortPosts = (posts, sortBy, timeFilter) => {
    let filtered = [...posts];
    
    // Apply time filter
    if (timeFilter !== 'all') {
      const now = new Date();
      let startDate = new Date();
      
      switch(timeFilter) {
        case 'today':
          startDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          break;
      }
      
      filtered = filtered.filter(post => new Date(post.publishedAt) >= startDate);
    }
    
    // Sort by selected criteria
    switch(sortBy) {
      case 'popular':
        return filtered.sort((a, b) => b.views - a.views);
      case 'recent':
        return filtered.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      case 'trending':
        return filtered.sort((a, b) => (b.views / b.readTime) - (a.views / a.readTime));
      case 'comments':
        return filtered.sort((a, b) => b.comments - a.comments);
      default:
        return filtered;
    }
  };
  
  const sortedPosts = sortPosts(posts, sortBy, timeFilter);
  
  // Toggle follow status
  const toggleFollow = () => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
    
    setIsFollowing(!isFollowing);
    // In a real app, dispatch an action to update the follow status in the API
  };
  
  // Get category badges with limited display
  const getCategories = (categories, limit = 3) => {
    const displayCategories = showAllCategories ? categories : categories.slice(0, limit);
    
    return (
      <div className="flex flex-wrap gap-2">
        {displayCategories.map(category => (
          <Link 
            key={category}
            to={`/search?category=${category}`}
            className="inline-flex items-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full px-3 py-1 text-xs"
          >
            {category.replace('-', ' ')}
          </Link>
        ))}
        
        {!showAllCategories && categories.length > limit && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowAllCategories(true);
            }}
            className="inline-flex items-center text-primary dark:text-primary-light hover:underline text-xs"
          >
            +{categories.length - limit} more
          </button>
        )}
      </div>
    );
  };
  
  return (
    <div>
      {/* Topic Detail View */}
      {currentTopic ? (
        <div>
          {/* Topic Header */}
          <div className="max-w-6xl mx-auto px-4 mb-10">
            <div className="flex items-center mb-6">
              <Link to="/explore" className="text-primary dark:text-primary-light hover:underline text-sm flex items-center">
                <ArrowLeft size={16} className="mr-1" />
                Back to Topics
              </Link>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center">
              <div 
                className="w-16 h-16 rounded-lg flex items-center justify-center text-white mb-4 md:mb-0 md:mr-6"
                style={{ backgroundColor: currentTopic.color }}
              >
                {currentTopic.icon}
              </div>
              
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {currentTopic.name}
                  </h1>
                  
                  <button
                    onClick={toggleFollow}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      isFollowing 
                        ? 'bg-primary/10 text-primary dark:bg-primary-dark/20 dark:text-primary-light border border-primary/30'
                        : 'bg-primary hover:bg-primary-dark text-white'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 my-3">
                  {currentTopic.description}
                </p>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Users size={16} className="mr-2" />
                    <span>{currentTopic.followers.toLocaleString()} followers</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen size={16} className="mr-2" />
                    <span>{currentTopic.postCount.toLocaleString()} posts</span>
                  </div>
                  {currentTopic.trending && (
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <Trending size={16} className="mr-2" />
                      <span>Trending</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Categories */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categories
              </h3>
              {getCategories(currentTopic.categories)}
            </div>
            
            {/* Related Topics */}
            {currentTopic.relatedTopics && currentTopic.relatedTopics.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Related Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentTopic.relatedTopics.map(relatedTopicId => {
                    const relatedTopic = TOPICS.find(t => t.id === relatedTopicId);
                    if (!relatedTopic) return null;
                    
                    return (
                      <Link 
                        key={relatedTopic.id}
                        to={`/topic/${relatedTopic.id}`}
                        className="inline-flex items-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full px-3 py-1 text-sm"
                      >
                        {relatedTopic.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          
          {/* Content Filters */}
          <div className="bg-gray-50 dark:bg-gray-800/50 py-4 border-y border-gray-200 dark:border-gray-700 mb-8">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Sort By
                    </label>
                    <select
                      id="sort-by"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-1.5 pl-3 pr-10 text-sm focus:ring-primary focus:border-primary"
                    >
                      <option value="popular">Most Popular</option>
                      <option value="recent">Most Recent</option>
                      <option value="trending">Trending</option>
                      <option value="comments">Most Discussed</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="time-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Time Period
                    </label>
                    <select
                      id="time-filter"
                      value={timeFilter}
                      onChange={(e) => setTimeFilter(e.target.value)}
                      className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-1.5 pl-3 pr-10 text-sm focus:ring-primary focus:border-primary"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="year">This Year</option>
                    </select>
                  </div>
                </div>
                
                <div className="relative">
                  <button
                    className="flex items-center space-x-2 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Filter size={16} />
                    <span>More Filters</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Topic Content */}
          <div className="max-w-6xl mx-auto px-4 mb-10">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden animate-pulse">
                    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedPosts.map(post => (
                  <EnhancedPostCard 
                    key={post.id} 
                    post={post} 
                    variant="default"
                    showCodePreview={false}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <BookOpen size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  No posts found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  There are no posts for this topic with the current filters. Try changing the filters or check back later.
                </p>
                <button 
                  className="mt-4 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg flex items-center mx-auto"
                  onClick={() => {
                    setSortBy('popular');
                    setTimeFilter('all');
                  }}
                >
                  <RefreshCw size={16} className="mr-2" />
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Topics Explore Page */
        <div>
          {/* Hero section */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 py-10 mb-8">
            <div className="max-w-6xl mx-auto px-4">
              <div className="max-w-3xl">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Explore Topics
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  Discover communities and content across different programming languages, frameworks, and technologies.
                </p>
                
                {/* Search input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Trending Topics */}
          <div className="max-w-6xl mx-auto px-4 mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <Trending size={24} className="mr-2 text-primary" />
                Trending Topics
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTopics.filter(topic => topic.trending).map(topic => (
                <Link 
                  key={topic.id}
                  to={`/topic/${topic.id}`}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center mb-4">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center mr-4"
                      style={{ backgroundColor: `${topic.color}20`, color: topic.color }}
                    >
                      {topic.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {topic.name}
                      </h3>
                      <div className="flex items-center mt-1 text-sm text-green-600 dark:text-green-400">
                        <Trending size={14} className="mr-1" />
                        <span>Trending</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {topic.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <Users size={14} className="mr-1" />
                      {topic.followers.toLocaleString()} followers
                    </span>
                    <span className="flex items-center">
                      <BookOpen size={14} className="mr-1" />
                      {topic.postCount.toLocaleString()} posts
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* All Topics */}
          <div className="max-w-6xl mx-auto px-4 mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <Hash size={24} className="mr-2 text-primary" />
                All Topics
              </h2>
              
              <div className="flex items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                  Sort by:
                </span>
                <select
                  className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-1.5 pl-3 pr-10 text-sm focus:ring-primary focus:border-primary"
                >
                  <option>Popular</option>
                  <option>Name (A-Z)</option>
                  <option>Recent Activity</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
              {filteredTopics.map(topic => (
                <div key={topic.id} className="flex">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0"
                    style={{ backgroundColor: `${topic.color}20`, color: topic.color }}
                  >
                    {topic.icon}
                  </div>
                  <div>
                    <Link to={`/topic/${topic.id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary-light">
                        {topic.name}
                      </h3>
                    </Link>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                      {topic.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <Users size={12} className="mr-1" />
                        {topic.followers.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <BookOpen size={12} className="mr-1" />
                        {topic.postCount.toLocaleString()}
                      </span>
                      {topic.trending && (
                        <span className="flex items-center text-green-600 dark:text-green-400">
                          <Trending size={12} className="mr-1" />
                          Trending
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredTopics.length === 0 && (
              <div className="text-center py-16">
                <Search size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  No topics found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  No topics match your search criteria. Try using different keywords.
                </p>
                <button 
                  className="mt-4 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg flex items-center mx-auto"
                  onClick={() => setSearchQuery('')}
                >
                  <RefreshCw size={16} className="mr-2" />
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for ArrowLeft icon
const ArrowLeft = ({ size = 24, className = '' }) => (
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
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

export default ExploreTopicsPage;