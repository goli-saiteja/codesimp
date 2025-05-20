// src/pages/PostDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Heart, MessageSquare, Bookmark, Share2, User, Calendar, Clock, 
  Eye, ThumbsUp, ThumbsDown, Code, Copy, Check, Play, ArrowLeft,
  Edit, AlertTriangle, Award, GitHub, Twitter, Linkedin, Facebook
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { fetchPostById } from '../store/slices/postsSlice';
import { addBookmark, removeBookmark } from '../store/slices/postsSlice';
import EnhancedPostCard from '../components/posts/EnhancedPostCard';
import CodeComparisonViewer from '../components/code/CodeComparisonViewer';
import CodePerformanceVisualizer from '../components/analytics/CodePerformanceVisualizer';

// Mock data for a blog post
const MOCK_POST = {
  id: '123',
  title: 'Building Scalable React Applications with Redux Toolkit',
  subtitle: 'Modern state management techniques for complex React applications',
  content: `
    <h2>Introduction</h2>
    <p>In modern web development, state management becomes increasingly important as applications grow in complexity. Redux has been a popular choice for React applications, but its verbosity and boilerplate code can be challenging. Redux Toolkit addresses these issues by providing utilities to simplify common Redux use cases.</p>
    
    <h2>What is Redux Toolkit?</h2>
    <p>Redux Toolkit is the official, opinionated, batteries-included toolset for efficient Redux development. It includes several utility functions that simplify the most common Redux use cases, including store setup, creating reducers, immutable update logic, and even creating entire "slices" of state at once.</p>
    
    <h3>Key Features</h3>
    <ul>
      <li>Simplified store configuration with configureStore</li>
      <li>Reducer creation with createReducer utility</li>
      <li>Slice generation with createSlice utility</li>
      <li>Easy creation of async thunks with createAsyncThunk</li>
      <li>Built-in immer middleware for simpler immutable updates</li>
    </ul>
    
    <h2>Setting Up Redux Toolkit</h2>
    <p>Let's start by setting up Redux Toolkit in your React application:</p>
    
    <pre><code>npm install @reduxjs/toolkit react-redux</code></pre>
    
    <p>Now, let's create a simple store with Redux Toolkit:</p>
    
    <pre><code class="language-javascript">
    // store.js
    import { configureStore } from '@reduxjs/toolkit';
    import rootReducer from './reducers';
    
    const store = configureStore({
      reducer: rootReducer,
    });
    
    export default store;
    </code></pre>
    
    <h2>Creating Slices</h2>
    <p>The createSlice utility is one of the most powerful features of Redux Toolkit. It allows you to define a slice of your state, along with the reducers that will update it, in a single function call:</p>
    
    <pre><code class="language-javascript">
    // userSlice.js
    import { createSlice } from '@reduxjs/toolkit';
    
    const userSlice = createSlice({
      name: 'user',
      initialState: {
        data: null,
        loading: false,
        error: null,
      },
      reducers: {
        userRequested: (state) => {
          state.loading = true;
        },
        userReceived: (state, action) => {
          state.loading = false;
          state.data = action.payload;
        },
        userRequestFailed: (state, action) => {
          state.loading = false;
          state.error = action.payload;
        },
      },
    });
    
    export const { userRequested, userReceived, userRequestFailed } = userSlice.actions;
    export default userSlice.reducer;
    </code></pre>
    
    <h2>Handling Async Operations</h2>
    <p>For async operations, Redux Toolkit provides the createAsyncThunk utility, which abstracts the process of dispatching actions before, during, and after an async request:</p>
    
    <pre><code class="language-javascript">
    // userSlice.js
    import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
    import api from '../api';
    
    export const fetchUser = createAsyncThunk(
      'user/fetchUser',
      async (userId, { rejectWithValue }) => {
        try {
          const response = await api.get(\`/users/\${userId}\`);
          return response.data;
        } catch (error) {
          return rejectWithValue(error.response.data);
        }
      }
    );
    
    const userSlice = createSlice({
      name: 'user',
      initialState: {
        data: null,
        loading: false,
        error: null,
      },
      reducers: {},
      extraReducers: (builder) => {
        builder
          .addCase(fetchUser.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchUser.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
          })
          .addCase(fetchUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          });
      },
    });
    
    export default userSlice.reducer;
    </code></pre>
    
    <h2>Using the Store in React Components</h2>
    <p>Now, let's use our Redux store in a React component:</p>
    
    <pre><code class="language-jsx">
    // UserProfile.jsx
    import React, { useEffect } from 'react';
    import { useSelector, useDispatch } from 'react-redux';
    import { fetchUser } from './userSlice';
    
    const UserProfile = ({ userId }) => {
      const dispatch = useDispatch();
      const { data: user, loading, error } = useSelector((state) => state.user);
      
      useEffect(() => {
        dispatch(fetchUser(userId));
      }, [dispatch, userId]);
      
      if (loading) return <div>Loading...</div>;
      if (error) return <div>Error: {error.message}</div>;
      if (!user) return null;
      
      return (
        <div>
          <h1>{user.name}</h1>
          <p>Email: {user.email}</p>
          <p>Bio: {user.bio}</p>
        </div>
      );
    };
    
    export default UserProfile;
    </code></pre>
    
    <h2>Benefits of Using Redux Toolkit</h2>
    <p>There are several advantages to using Redux Toolkit over vanilla Redux:</p>
    
    <ol>
      <li><strong>Less Boilerplate</strong>: Redux Toolkit significantly reduces the amount of code you need to write.</li>
      <li><strong>Built-in Best Practices</strong>: It incorporates Redux best practices out of the box.</li>
      <li><strong>Immutability</strong>: Immer is integrated, allowing you to write "mutating" logic in reducers that is automatically converted to immutable updates.</li>
      <li><strong>DevTools and Middleware</strong>: Redux DevTools and common middleware like redux-thunk are pre-configured.</li>
      <li><strong>Type Safety</strong>: Better TypeScript integration with improved type definitions.</li>
    </ol>
    
    <h2>Conclusion</h2>
    <p>Redux Toolkit simplifies the process of working with Redux, making your code more maintainable and concise. By leveraging its utilities, you can focus more on building features for your application rather than writing Redux boilerplate.</p>
    
    <p>For complex applications that require robust state management, Redux Toolkit is an excellent choice that combines the power of Redux with the simplicity of modern JavaScript patterns.</p>
  `,
  author: {
    id: '101',
    name: 'Sarah Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/41.jpg',
    bio: 'Senior Frontend Developer specializing in React and modern JavaScript frameworks. Passionate about clean code and user experience.',
    followers: 2345
  },
  publishedAt: '2025-05-10T12:00:00Z',
  updatedAt: '2025-05-15T09:30:00Z',
  readTime: 8,
  likes: 423,
  comments: 57,
  views: 8742,
  tags: ['React', 'Redux', 'JavaScript', 'Web Development'],
  coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  language: 'javascript',
  codeSnippets: [
    {
      id: 'cs1',
      title: 'Redux Toolkit Store Setup',
      language: 'javascript',
      code: `// store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;`,
    },
    {
      id: 'cs2',
      title: 'Redux Toolkit Slice',
      language: 'javascript',
      code: `// userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(\`/api/users/\${userId}\`);
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Standard reducer logic with auto-generated action types
    resetUser: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUser } = userSlice.actions;
export default userSlice.reducer;`,
    },
  ],
  featured: true,
  series: {
    id: 's1',
    title: 'Modern React Development',
    partNumber: 2,
    totalParts: 5,
  },
  relatedPosts: [
    {
      id: '124',
      title: 'Understanding React Hooks for State Management',
      excerpt: 'Learn how to use React Hooks effectively to manage component state without external libraries.',
      author: {
        id: '101',
        name: 'Sarah Johnson',
        avatar: 'https://randomuser.me/api/portraits/women/41.jpg',
      },
      publishedAt: '2025-04-25T10:15:00Z',
      readTime: 6,
      likes: 318,
      comments: 42,
      views: 5629,
      tags: ['React', 'Hooks', 'JavaScript', 'Frontend'],
      coverImage: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    },
    {
      id: '125',
      title: 'Testing Redux Applications with Jest and React Testing Library',
      excerpt: 'A comprehensive guide to testing your Redux store, actions, reducers, and connected components.',
      author: {
        id: '102',
        name: 'Michael Chen',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      },
      publishedAt: '2025-05-05T14:30:00Z',
      readTime: 10,
      likes: 245,
      comments: 38,
      views: 4217,
      tags: ['Redux', 'Testing', 'Jest', 'JavaScript'],
      coverImage: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1506&q=80',
    },
    {
      id: '126',
      title: 'Performance Optimization Techniques for React Applications',
      excerpt: 'Learn how to identify and solve performance bottlenecks in your React apps using profiling tools and best practices.',
      author: {
        id: '103',
        name: 'Alex Rodriguez',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      },
      publishedAt: '2025-05-12T09:45:00Z',
      readTime: 12,
      likes: 387,
      comments: 62,
      views: 7123,
      tags: ['React', 'Performance', 'Optimization', 'JavaScript'],
      coverImage: 'https://images.unsplash.com/photo-1607706189992-eae578626c86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    },
  ],
};

// Mock comments data
const MOCK_COMMENTS = [
  {
    id: 'c1',
    author: {
      id: '201',
      name: 'David Kim',
      avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
    },
    content: 'Great article! I\'ve been using Redux Toolkit for a few months now and it has definitely simplified my state management code. The createSlice function is a game-changer.',
    publishedAt: '2025-05-12T14:23:00Z',
    likes: 24,
    replies: [
      {
        id: 'r1',
        author: {
          id: '101',
          name: 'Sarah Johnson',
          avatar: 'https://randomuser.me/api/portraits/women/41.jpg',
        },
        content: 'Thanks, David! Glad you found it helpful. createSlice is indeed my favorite feature too.',
        publishedAt: '2025-05-12T15:47:00Z',
        likes: 8,
      },
    ],
  },
  {
    id: 'c2',
    author: {
      id: '202',
      name: 'Emma Wilson',
      avatar: 'https://randomuser.me/api/portraits/women/29.jpg',
    },
    content: 'I appreciate the detailed explanation of createAsyncThunk. I was struggling with handling async operations in Redux, but your examples made it click for me. Would love to see more content on Redux Toolkit\'s advanced features!',
    publishedAt: '2025-05-13T09:12:00Z',
    likes: 18,
    replies: [],
  },
  {
    id: 'c3',
    author: {
      id: '203',
      name: 'James Thompson',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    },
    content: 'How would you compare Redux Toolkit to other state management solutions like MobX or the Context API + useReducer hook? Do you think it\'s still worth learning RTK for new projects?',
    publishedAt: '2025-05-14T11:35:00Z',
    likes: 7,
    replies: [
      {
        id: 'r2',
        author: {
          id: '101',
          name: 'Sarah Johnson',
          avatar: 'https://randomuser.me/api/portraits/women/41.jpg',
        },
        content: 'Great question, James! It really depends on the scale and requirements of your project. For smaller applications, Context API + useReducer might be sufficient. For larger applications with complex state and many contributors, I still prefer Redux Toolkit for its structured approach and excellent dev tools. MobX is also powerful but follows a different paradigm. I will consider writing a comparison article soon!',
        publishedAt: '2025-05-14T13:20:00Z',
        likes: 15,
      },
      {
        id: 'r3',
        author: {
          id: '204',
          name: 'Sophia Chen',
          avatar: 'https://randomuser.me/api/portraits/women/62.jpg',
        },
        content: 'I\'ve used all three in production, and I agree with Sarah. Redux Toolkit shines in larger teams and complex applications. The dev tools alone make it worth considering!',
        publishedAt: '2025-05-14T14:05:00Z',
        likes: 10,
      },
    ],
  },
];

const PostDetailPage = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const { darkMode } = useSelector(state => state.ui);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showCodePerformance, setShowCodePerformance] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [activeCodeSnippet, setActiveCodeSnippet] = useState(null);
  const [copied, setCopied] = useState(false);
  
  // Fetch post data
  useEffect(() => {
    // In a real app, this would dispatch an action to fetch the post from the API
    // dispatch(fetchPostById(postId));
    
    // For this example, we'll use mock data
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setPost(MOCK_POST);
      setComments(MOCK_COMMENTS);
      setLoading(false);
    }, 800);
  }, [postId, dispatch]);
  
  // Handle bookmark toggle
  const toggleBookmark = () => {
    if (!isAuthenticated) {
      // Would typically show a login prompt
      return;
    }
    
    if (isBookmarked) {
      dispatch(removeBookmark(postId));
    } else {
      dispatch(addBookmark(postId));
    }
    
    setIsBookmarked(!isBookmarked);
  };
  
  // Handle like toggle
  const toggleLike = () => {
    if (!isAuthenticated) {
      // Would typically show a login prompt
      return;
    }
    
    setIsLiked(!isLiked);
    
    // Would typically dispatch an action to update the like status in the API
  };
  
  // Handle comment submission
  const submitComment = (e) => {
    e.preventDefault();
    
    if (!isAuthenticated || !newComment.trim()) {
      return;
    }
    
    // Would typically dispatch an action to submit the comment to the API
    const newCommentObj = {
      id: `c${comments.length + 1}`,
      author: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
      },
      content: newComment,
      publishedAt: new Date().toISOString(),
      likes: 0,
      replies: [],
    };
    
    setComments([newCommentObj, ...comments]);
    setNewComment('');
  };
  
  // Copy code to clipboard
  const copyCodeToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2 mb-8"></div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <AlertTriangle size={48} className="mx-auto mb-4 text-red-500" />
        <h1 className="text-2xl font-bold mb-2">Error Loading Post</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <Link to="/" className="text-primary hover:text-primary-dark">
          Return to Home Page
        </Link>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <AlertTriangle size={48} className="mx-auto mb-4 text-yellow-500" />
        <h1 className="text-2xl font-bold mb-2">Post Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          The post you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/" className="text-primary hover:text-primary-dark">
          Return to Home Page
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      {/* Back button */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <Link to="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light">
          <ArrowLeft size={16} className="mr-1" />
          <span>Back to articles</span>
        </Link>
      </div>
      
      {/* Article header */}
      <motion.header 
        className="max-w-4xl mx-auto px-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {post.series && (
          <div className="mb-4">
            <Link 
              to={`/series/${post.series.id}`}
              className="inline-flex items-center text-sm text-primary dark:text-primary-light hover:underline"
            >
              <span>{post.series.title}</span>
              <span className="mx-2">•</span>
              <span>Part {post.series.partNumber} of {post.series.totalParts}</span>
            </Link>
          </div>
        )}
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {post.title}
        </h1>
        
        {post.subtitle && (
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            {post.subtitle}
          </p>
        )}
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map(tag => (
            <Link 
              key={tag} 
              to={`/topic/${tag.toLowerCase()}`}
              className="inline-flex items-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full px-3 py-1 text-sm"
            >
              {tag}
            </Link>
          ))}
        </div>
        
        {/* Author and metadata */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center">
            <Link to={`/profile/${post.author.id}`} className="flex items-center">
              <img 
                src={post.author.avatar} 
                alt={post.author.name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {post.author.name}
                </h3>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar size={14} className="mr-1" />
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  <span className="mx-2">•</span>
                  <Clock size={14} className="mr-1" />
                  <span>{post.readTime} min read</span>
                </div>
              </div>
            </Link>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={toggleLike}
              className={`flex items-center space-x-1 p-2 rounded-full ${
                isLiked 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              aria-label={isLiked ? 'Unlike post' : 'Like post'}
            >
              <Heart size={20} className={isLiked ? 'fill-current' : ''} />
            </button>
            
            <button 
              onClick={toggleBookmark}
              className={`flex items-center space-x-1 p-2 rounded-full ${
                isBookmarked 
                ? 'text-primary dark:text-primary-light' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark post'}
            >
              <Bookmark size={20} className={isBookmarked ? 'fill-current' : ''} />
            </button>
            
            <button 
              className="flex items-center space-x-1 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              aria-label="Share post"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </motion.header>
      
      {/* Cover image */}
      <div className="max-w-5xl mx-auto px-4 mb-10">
        <div className="rounded-lg overflow-hidden">
          <img 
            src={post.coverImage} 
            alt={post.title}
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
      
      {/* Article content */}
      <motion.article 
        className="max-w-4xl mx-auto px-4 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div 
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </motion.article>
      
      {/* Code Performance section */}
      {post.codeSnippets && post.codeSnippets.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 mb-10">
          <button
            onClick={() => setShowCodePerformance(!showCodePerformance)}
            className="flex items-center text-primary dark:text-primary-light hover:underline mb-4"
          >
            {showCodePerformance ? 'Hide Code Analysis' : 'View Code Performance Analysis'}
          </button>
          
          {showCodePerformance && (
            <CodePerformanceVisualizer 
              languageFilter={[post.language]}
              metric="executionTime"
            />
          )}
        </div>
      )}
      
      {/* Code snippets */}
      {post.codeSnippets && post.codeSnippets.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Code Snippets
          </h2>
          
          <div className="space-y-6">
            {post.codeSnippets.map((snippet) => (
              <div key={snippet.id} className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="bg-gray-100 dark:bg-gray-800 p-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <Code size={18} className="mr-2 text-primary" />
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">
                      {snippet.title}
                    </h3>
                    <span className="ml-2 text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300">
                      {snippet.language}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyCodeToClipboard(snippet.code)}
                      className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      title="Copy code"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                    
                    <Link
                      to={`/playground?code=${encodeURIComponent(snippet.code)}&language=${snippet.language}`}
                      className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      title="Run in playground"
                    >
                      <Play size={16} />
                    </Link>
                  </div>
                </div>
                
                <div className="relative">
                  <SyntaxHighlighter
                    language={snippet.language}
                    style={darkMode ? atomDark : oneLight}
                    showLineNumbers
                    customStyle={{ margin: 0, borderRadius: 0 }}
                  >
                    {snippet.code}
                  </SyntaxHighlighter>
                </div>
              </div>
            ))}
          </div>
          
          {post.codeSnippets.length > 1 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Code Comparison
              </h3>
              
              <CodeComparisonViewer 
                snippets={post.codeSnippets}
                title="Compare Code Implementations"
                allowEditing={false}
              />
            </div>
          )}
        </div>
      )}
      
      {/* Author bio */}
      <div className="max-w-4xl mx-auto px-4 mb-10">
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center">
            <img 
              src={post.author.avatar} 
              alt={post.author.name}
              className="w-20 h-20 rounded-full mb-4 md:mb-0 md:mr-6"
            />
            
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                About {post.author.name}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {post.author.bio}
              </p>
              
              <div className="flex items-center space-x-4">
                <Link 
                  to={`/profile/${post.author.id}`}
                  className="text-primary dark:text-primary-light hover:underline"
                >
                  View Profile
                </Link>
                <div className="text-gray-500 dark:text-gray-400">
                  <span className="font-medium">{post.author.followers.toLocaleString()}</span> Followers
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Comments section */}
      <div className="max-w-4xl mx-auto px-4 mb-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Comments ({comments.length})
        </h2>
        
        {isAuthenticated ? (
          <form onSubmit={submitComment} className="mb-8">
            <div className="flex items-start space-x-4">
              <img 
                src={user?.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'} 
                alt="Your avatar"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add your comment..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows={3}
                ></textarea>
                <div className="mt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg"
                    disabled={!newComment.trim()}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-8 text-center">
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              Please sign in to join the conversation
            </p>
            <Link 
              to="/auth/login"
              className="inline-block px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg"
            >
              Sign In
            </Link>
          </div>
        )}
        
        {comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-200 dark:border-gray-700 pb-6">
                <div className="flex items-start space-x-4">
                  <Link to={`/profile/${comment.author.id}`}>
                    <img 
                      src={comment.author.avatar} 
                      alt={comment.author.name}
                      className="w-10 h-10 rounded-full"
                    />
                  </Link>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <Link to={`/profile/${comment.author.id}`} className="font-medium text-gray-900 dark:text-white">
                        {comment.author.name}
                      </Link>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(comment.publishedAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      {comment.content}
                    </p>
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                        <ThumbsUp size={16} className="mr-1" />
                        <span>{comment.likes}</span>
                      </button>
                      <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                        Reply
                      </button>
                    </div>
                    
                    {/* Comment replies */}
                    {comment.replies.length > 0 && (
                      <div className="mt-4 space-y-4 pl-6 border-l-2 border-gray-200 dark:border-gray-700">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex items-start space-x-4">
                            <Link to={`/profile/${reply.author.id}`}>
                              <img 
                                src={reply.author.avatar} 
                                alt={reply.author.name}
                                className="w-8 h-8 rounded-full"
                              />
                            </Link>
                            <div>
                              <div className="flex items-center mb-1">
                                <Link to={`/profile/${reply.author.id}`} className="font-medium text-gray-900 dark:text-white mr-2">
                                  {reply.author.name}
                                </Link>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatDate(reply.publishedAt)}
                                </span>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 mb-2">
                                {reply.content}
                              </p>
                              <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm">
                                <ThumbsUp size={14} className="mr-1" />
                                <span>{reply.likes}</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
              No comments yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Be the first to join the conversation
            </p>
          </div>
        )}
      </div>
      
      {/* Related posts */}
      {post.relatedPosts && post.relatedPosts.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800/50 py-12">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Related Articles
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {post.relatedPosts.map((relatedPost) => (
                <EnhancedPostCard 
                  key={relatedPost.id} 
                  post={relatedPost} 
                  variant="default"
                  showCodePreview={false}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Share section */}
      <div className="max-w-4xl mx-auto px-4 py-10 text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Share this article
        </h3>
        <div className="flex justify-center space-x-4">
          <button className="p-3 rounded-full bg-[#1DA1F2] text-white hover:bg-opacity-90">
            <Twitter size={20} />
          </button>
          <button className="p-3 rounded-full bg-[#4267B2] text-white hover:bg-opacity-90">
            <Facebook size={20} />
          </button>
          <button className="p-3 rounded-full bg-[#0077B5] text-white hover:bg-opacity-90">
            <Linkedin size={20} />
          </button>
          <button className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-opacity-90">
            <Share2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;