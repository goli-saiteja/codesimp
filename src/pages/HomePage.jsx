// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Terminal, Code, Book, ArrowRight, Star, Clock, Lightning, 
  Tag, Cpu, Search, Zap, Share2, Award, Trending, Gift,
  Users, BookOpen, ThumbsUp, BarChart2, FilterIcon, RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import EnhancedPostCard from '../components/posts/EnhancedPostCard';
import AIAssistedSearch from '../components/search/AIAssistedSearch';
import { fetchPostsStart, fetchPostsSuccess, fetchPostsFailure } from '../store/slices/postsSlice';

// Mock data for featured posts
const FEATURED_POSTS = [
  {
    id: '1',
    title: 'Building Scalable React Applications with Redux Toolkit',
    excerpt: 'Learn how to structure large-scale React applications using Redux Toolkit for efficient state management and improved developer experience.',
    author: {
      id: '101',
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/41.jpg',
      followers: 2345
    },
    publishedAt: '2025-05-10T12:00:00Z',
    readTime: 8,
    likes: 423,
    comments: 57,
    views: 8742,
    tags: ['React', 'Redux', 'JavaScript', 'Web Development'],
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    language: 'javascript',
    codeSnippet: `// Create a Redux slice with Redux Toolkit
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const response = await fetch('https://api.example.com/users');
    return response.json();
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Synchronous reducers
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;`,
    featured: true,
  },
  {
    id: '2',
    title: 'Advanced TypeScript Patterns for React Developers',
    excerpt: 'Discover how to leverage TypeScripts type system to build more robust React applications with better developer experience and fewer runtime errors.',
    author: {
      id: '102',
      name: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      followers: 1872
    },
    publishedAt: '2025-05-08T09:30:00Z',
    readTime: 12,
    likes: 567,
    comments: 83,
    views: 10291,
    tags: ['TypeScript', 'React', 'Design Patterns', 'JavaScript'],
    coverImage: 'https://images.unsplash.com/photo-1607706189992-eae578626c86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    language: 'typescript',
    codeSnippet: `// Advanced TypeScript patterns for React

// 1. Discriminated Unions for Props
type SuccessProps = { status: 'success'; data: User[] };
type ErrorProps = { status: 'error'; error: Error };
type LoadingProps = { status: 'loading' };

// Union type of all possible props
type StatusProps = SuccessProps | ErrorProps | LoadingProps;

// Component with discriminated union props
function StatusDisplay(props: StatusProps) {
  switch (props.status) {
    case 'success':
      return <UserList users={props.data} />;
    case 'error':
      return <ErrorMessage error={props.error} />;
    case 'loading':
      return <Spinner />;
  }
}

// 2. Generic Components
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Usage with type inference
const users: User[] = [/* ... */];
<List items={users} renderItem={(user) => user.name} />`,
    featured: true,
  },
  {
    id: '3',
    title: 'Building a Microservices Architecture with Node.js and Docker',
    excerpt: 'Learn how to design, implement, and deploy a microservices architecture using Node.js, Express, and Docker containers for scalable applications.',
    author: {
      id: '103',
      name: 'Alex Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      followers: 3219
    },
    publishedAt: '2025-05-15T14:15:00Z',
    readTime: 15,
    likes: 723,
    comments: 103,
    views: 15423,
    tags: ['Microservices', 'Node.js', 'Docker', 'DevOps'],
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    language: 'javascript',
    codeSnippet: `// docker-compose.yml for a microservices architecture
version: '3'

services:
  api-gateway:
    build: ./api-gateway
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - USER_SERVICE_URL=http://user-service:4001
      - PRODUCT_SERVICE_URL=http://product-service:4002
    depends_on:
      - user-service
      - product-service
    networks:
      - microservices-net

  user-service:
    build: ./user-service
    environment:
      - NODE_ENV=production
      - PORT=4001
      - MONGODB_URI=mongodb://mongo-users:27017/users
    depends_on:
      - mongo-users
    networks:
      - microservices-net

  product-service:
    build: ./product-service
    environment:
      - NODE_ENV=production
      - PORT=4002
      - MONGODB_URI=mongodb://mongo-products:27017/products
    depends_on:
      - mongo-products
    networks:
      - microservices-net

  mongo-users:
    image: mongo:latest
    volumes:
      - mongo-users-data:/data/db
    networks:
      - microservices-net

  mongo-products:
    image: mongo:latest
    volumes:
      - mongo-products-data:/data/db
    networks:
      - microservices-net

networks:
  microservices-net:
    driver: bridge

volumes:
  mongo-users-data:
  mongo-products-data:`,
    featured: true,
  },
];

// Recent posts data
const RECENT_POSTS = [
  {
    id: '4',
    title: 'Implementing Authentication with JWT in Express.js Applications',
    excerpt: 'Step-by-step guide to implementing secure authentication using JSON Web Tokens in your Express.js applications.',
    author: {
      id: '104',
      name: 'Emma Wilson',
      avatar: 'https://randomuser.me/api/portraits/women/29.jpg',
      followers: 1542
    },
    publishedAt: '2025-05-17T10:20:00Z',
    readTime: 7,
    likes: 218,
    comments: 36,
    views: 4578,
    tags: ['Authentication', 'Express.js', 'JWT', 'Security'],
    coverImage: 'https://images.unsplash.com/photo-1546900703-cf06143d1239?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    language: 'javascript',
  },
  {
    id: '5',
    title: 'Machine Learning with Python: Building a Recommendation Engine',
    excerpt: 'Learn how to create a powerful recommendation engine using Python, pandas, and scikit-learn for your applications.',
    author: {
      id: '105',
      name: 'David Kim',
      avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
      followers: 2865
    },
    publishedAt: '2025-05-16T16:45:00Z',
    readTime: 14,
    likes: 473,
    comments: 59,
    views: 7812,
    tags: ['Machine Learning', 'Python', 'Data Science', 'Recommendation Systems'],
    coverImage: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    language: 'python',
  },
  {
    id: '6',
    title: 'Optimizing React Applications for Performance',
    excerpt: 'Strategies and techniques to improve the performance of your React applications, from code splitting to memoization.',
    author: {
      id: '106',
      name: 'Olivia Martinez',
      avatar: 'https://randomuser.me/api/portraits/women/57.jpg',
      followers: 2103
    },
    publishedAt: '2025-05-14T09:10:00Z',
    readTime: 10,
    likes: 392,
    comments: 47,
    views: 6238,
    tags: ['React', 'Performance', 'Optimization', 'JavaScript'],
    coverImage: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    language: 'javascript',
  },
];

// Trending topics data
const TRENDING_TOPICS = [
  { 
    id: 'react', 
    name: 'React', 
    description: 'A JavaScript library for building user interfaces',
    icon: <Code size={18} />,
    postCount: 3254,
    followersCount: 12745,
    color: '#61dafb',
  },
  { 
    id: 'typescript', 
    name: 'TypeScript', 
    description: 'JavaScript with syntax for types',
    icon: <Code size={18} />,
    postCount: 2187,
    followersCount: 9256,
    color: '#3178c6',
  },
  { 
    id: 'machine-learning', 
    name: 'Machine Learning', 
    description: 'Statistical techniques to give computers the ability to learn',
    icon: <Cpu size={18} />,
    postCount: 1856,
    followersCount: 8567,
    color: '#ff6b6b',
  },
  { 
    id: 'devops', 
    name: 'DevOps', 
    description: 'Practices that combine software development and IT operations',
    icon: <Terminal size={18} />,
    postCount: 1523,
    followersCount: 7432,
    color: '#6c5ce7',
  },
];

// Home page component
const HomePage = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector(state => state.posts);
  const { isAuthenticated } = useSelector(state => state.auth);
  const [activeFilter, setActiveFilter] = useState('featured');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Fetch posts on component mount
  useEffect(() => {
    dispatch(fetchPostsStart());
    
    // Simulate API call with mock data
    setTimeout(() => {
      const allPosts = [...FEATURED_POSTS, ...RECENT_POSTS];
      dispatch(fetchPostsSuccess(allPosts));
    }, 1000);
  }, [dispatch]);
  
  // Refresh posts
  const refreshPosts = () => {
    setIsRefreshing(true);
    dispatch(fetchPostsStart());
    
    // Simulate API call with mock data
    setTimeout(() => {
      const allPosts = [...FEATURED_POSTS, ...RECENT_POSTS];
      dispatch(fetchPostsSuccess(allPosts));
      setIsRefreshing(false);
    }, 1500);
  };
  
  // Filter posts based on active filter
  const filteredPosts = () => {
    switch (activeFilter) {
      case 'featured':
        return posts.filter(post => post.featured);
      case 'recent':
        return posts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      case 'popular':
        return posts.sort((a, b) => (b.views + b.likes * 2) - (a.views + a.likes * 2));
      default:
        return posts;
    }
  };
  
  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <section className="relative pb-20">
        {/* Hero background - subtle pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 -z-10"></div>
        
        <div className="max-w-6xl mx-auto px-4 pt-8 pb-16 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-28">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Premium Platform for
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary ml-2">
                Coding Blogs
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg text-gray-600 dark:text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Discover high-quality coding tutorials, in-depth technical articles, and interactive code examples from expert developers around the world.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {isAuthenticated ? (
                <Link 
                  to="/new-story" 
                  className="bg-primary hover:bg-primary-dark text-white font-medium px-6 py-3 rounded-lg flex items-center"
                >
                  <Zap size={18} className="mr-2" />
                  Start Writing
                </Link>
              ) : (
                <Link 
                  to="/auth/register" 
                  className="bg-primary hover:bg-primary-dark text-white font-medium px-6 py-3 rounded-lg flex items-center"
                >
                  <Zap size={18} className="mr-2" />
                  Join Now
                </Link>
              )}
              
              <Link 
                to="/playground" 
                className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 font-medium px-6 py-3 rounded-lg flex items-center"
              >
                <Terminal size={18} className="mr-2" />
                Try Code Playground
              </Link>
            </motion.div>
            
            {/* Search bar */}
            <motion.div 
              className="max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <AIAssistedSearch fullWidth />
            </motion.div>
          </div>
        </div>
        
        {/* Arrow down indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 0.5
          }}
        >
          <div className="text-gray-400 dark:text-gray-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M12 19L19 12M12 19L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </motion.div>
      </section>
      
      {/* Featured posts section */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <Award size={24} className="mr-2 text-primary" />
              Discover Content
            </h2>
            
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  activeFilter === 'featured'
                    ? 'bg-white dark:bg-gray-700 text-primary dark:text-primary-light shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
                onClick={() => setActiveFilter('featured')}
              >
                Featured
              </button>
              <button
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  activeFilter === 'recent'
                    ? 'bg-white dark:bg-gray-700 text-primary dark:text-primary-light shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
                onClick={() => setActiveFilter('recent')}
              >
                Recent
              </button>
              <button
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  activeFilter === 'popular'
                    ? 'bg-white dark:bg-gray-700 text-primary dark:text-primary-light shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
                onClick={() => setActiveFilter('popular')}
              >
                Popular
              </button>
              <button
                className="ml-1 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md"
                onClick={refreshPosts}
                disabled={isRefreshing}
              >
                <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
          
          {loading || isRefreshing ? (
            // Loading state
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            // Error state
            <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-lg mb-6">
              <h3 className="font-medium">Error loading posts</h3>
              <p className="text-sm mt-1">Please try again later</p>
              <button
                className="mt-2 bg-red-100 dark:bg-red-800 px-3 py-1 rounded-md text-sm font-medium"
                onClick={refreshPosts}
              >
                Try Again
              </button>
            </div>
          ) : (
            // Posts grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts().map((post) => (
                <EnhancedPostCard 
                  key={post.id} 
                  post={post} 
                  variant={post.featured && activeFilter === 'featured' ? 'featured' : 'default'}
                  showCodePreview={post.featured && activeFilter === 'featured'}
                />
              ))}
            </div>
          )}
          
          {/* View more link */}
          <div className="text-center mt-10">
            <Link to="/explore" className="inline-flex items-center text-primary dark:text-primary-light hover:text-primary-dark font-medium">
              <span>View more articles</span>
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Trending topics section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <Trending size={24} className="mr-2 text-primary" />
              Trending Topics
            </h2>
            
            <Link to="/topics" className="text-primary dark:text-primary-light hover:text-primary-dark font-medium flex items-center">
              <span>All Topics</span>
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRENDING_TOPICS.map((topic) => (
              <Link 
                key={topic.id} 
                to={`/topic/${topic.id}`}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: `${topic.color}20`, color: topic.color }}
                  >
                    {topic.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {topic.name}
                  </h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {topic.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center">
                    <BookOpen size={14} className="mr-1" />
                    {topic.postCount} posts
                  </span>
                  <span className="flex items-center">
                    <Users size={14} className="mr-1" />
                    {topic.followersCount} followers
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features highlight section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Premium Features for Developers
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              CodeSource is more than just a blog platform. It's a complete ecosystem for developers to learn, share, and grow together.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4">
                <Terminal size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Interactive Code Playground
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Run, edit, and share code snippets in multiple programming languages right in your browser.
              </p>
              <Link to="/playground" className="text-primary dark:text-primary-light hover:text-primary-dark font-medium flex items-center">
                <span>Try it now</span>
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4">
                <Lightning size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                AI-Powered Assistance
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Get intelligent code reviews, auto-completion, and content suggestions powered by advanced AI.
              </p>
              <Link to="/features/ai" className="text-primary dark:text-primary-light hover:text-primary-dark font-medium flex items-center">
                <span>Learn more</span>
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4">
                <GitHub size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                GitHub Integration
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Connect your GitHub repositories, showcase your projects, and import code examples directly.
              </p>
              <Link to="/features/github" className="text-primary dark:text-primary-light hover:text-primary-dark font-medium flex items-center">
                <span>Connect GitHub</span>
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4">
                <BarChart2 size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Advanced Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Gain insights into your content performance with detailed analytics and audience metrics.
              </p>
              <Link to="/features/analytics" className="text-primary dark:text-primary-light hover:text-primary-dark font-medium flex items-center">
                <span>Explore analytics</span>
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4">
                <Cpu size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Language-Specific Tools
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Access specialized tools and resources for different programming languages and frameworks.
              </p>
              <Link to="/features/tools" className="text-primary dark:text-primary-light hover:text-primary-dark font-medium flex items-center">
                <span>View tools</span>
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Developer Community
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Connect with like-minded developers, participate in discussions, and grow your network.
              </p>
              <Link to="/community" className="text-primary dark:text-primary-light hover:text-primary-dark font-medium flex items-center">
                <span>Join community</span>
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Join the CodeSource Community Today
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Share your knowledge, learn from others, and take your coding skills to the next level with our premium tools and features.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/auth/register" 
              className="bg-white text-primary hover:bg-gray-100 font-medium px-6 py-3 rounded-lg flex items-center justify-center"
            >
              <Gift size={18} className="mr-2" />
              Get Started - It's Free
            </Link>
            <Link 
              to="/features" 
              className="bg-white/20 hover:bg-white/30 text-white font-medium px-6 py-3 rounded-lg flex items-center justify-center backdrop-blur-sm"
            >
              <BookOpen size={18} className="mr-2" />
              Explore All Features
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// Helper component for Lightning icon
const Lightning = ({ size = 24, className = '' }) => (
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
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
  </svg>
);

export default HomePage;