import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchArticleById, toggleLike, toggleBookmark } from '../store/slices/articleSlice';
import { 
  ArrowLeft, Calendar, Clock, Heart, Bookmark, Share2, MessageSquare, 
  Twitter, Facebook, Linkedin, Link2, Copy, Check, MoreHorizontal, 
  Flag, Eye, Printer, BookmarkCheck, Edit, Trash2, Code
} from 'lucide-react';
import CodeEditor from '../components/editor/CodeEditor';
import CodeComparisonViewer from '../components/code/CodeComparisonViewer';
import { formatDistanceToNow, format } from 'date-fns';

const ArticlePage = () => {
  const { articleId, slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const article = useSelector(state => state.articles.currentArticle);
  const loading = useSelector(state => state.articles.loading);
  const error = useSelector(state => state.articles.error);
  const { user } = useSelector(state => state.auth);
  
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [moreOptionsOpen, setMoreOptionsOpen] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState(null);
  
  // Fetch article data
  useEffect(() => {
    if (articleId) {
      dispatch(fetchArticleById(articleId));
    }
  }, [articleId, dispatch]);
  
  // Update local state from article data
  useEffect(() => {
    if (article) {
      setLiked(article.liked || false);
      setBookmarked(article.bookmarked || false);
      setLikesCount(article.likesCount || 0);
    }
  }, [article]);
  
  // Handle like toggle
  const handleLikeToggle = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    dispatch(toggleLike(articleId));
  };
  
  // Handle bookmark toggle
  const handleBookmarkToggle = () => {
    setBookmarked(!bookmarked);
    dispatch(toggleBookmark(articleId));
  };
  
  // Copy article URL to clipboard
  const copyArticleUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Print article
  const printArticle = () => {
    window.print();
  };
  
  // Share on social media
  const shareOnSocial = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(article ? article.title : 'Check out this article');
    
    let shareUrl;
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShareMenuOpen(false);
  };
  
  // Handle scrolling behavior for table of contents
  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll('h2, h3');
      const tocLinks = document.querySelectorAll('.toc-link');
      
      if (headings.length === 0 || tocLinks.length === 0) return;
      
      // Find the heading that is currently in view
      let currentHeadingId = '';
      
      headings.forEach(heading => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
          currentHeadingId = heading.id;
        }
      });
      
      // Highlight the corresponding TOC link
      tocLinks.forEach(link => {
        if (link.getAttribute('href') === `#${currentHeadingId}`) {
          link.classList.add('text-primary-600', 'bg-primary-50');
        } else {
          link.classList.remove('text-primary-600', 'bg-primary-50');
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Generate table of contents from content
  const generateTableOfContents = () => {
    if (!article || !article.content) return [];
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(article.content, 'text/html');
    const headings = Array.from(doc.querySelectorAll('h2, h3'));
    
    return headings.map((heading, index) => {
      return {
        id: heading.id || `heading-${index}`,
        text: heading.textContent,
        level: heading.tagName === 'H2' ? 2 : 3
      };
    });
  };
  
  // Format the date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return format(date, 'MMMM d, yyyy');
  };
  
  // Process content to add code highlighting
  const processContent = (content) => {
    if (!content) return '';
    
    // For a real implementation, you would parse the HTML and enhance code blocks
    // This is a simplified example
    return content;
  };
  
  // Render code blocks
  const renderCodeBlock = (code, language = 'javascript', filename = null) => {
    return (
      <div className="my-6">
        <CodeEditor
          initialCode={code}
          language={language}
          editable={false}
          theme="dark"
          minHeight="150px"
          filename={filename}
        />
      </div>
    );
  };
  
  // Mock article data for preview
  const mockArticle = {
    id: 1,
    title: 'Building Scalable React Applications with Redux Toolkit',
    content: `
      <h2 id="introduction">Introduction</h2>
      <p>Redux Toolkit is the official, opinionated, batteries-included toolset for efficient Redux development. It simplifies common Redux use cases, including store setup, creating reducers, immutable update logic, and even creating entire "slices" of state at once.</p>
      
      <p>In this article, we'll explore how to leverage Redux Toolkit to build scalable React applications that are maintainable and performant.</p>
      
      <h2 id="getting-started">Getting Started with Redux Toolkit</h2>
      <p>To get started with Redux Toolkit, first install the package:</p>
      
      <h3 id="installation">Installation</h3>
      <p>Using npm:</p>
      
      <pre><code class="language-bash">npm install @reduxjs/toolkit react-redux</code></pre>
      
      <p>Or using yarn:</p>
      
      <pre><code class="language-bash">yarn add @reduxjs/toolkit react-redux</code></pre>
      
      <h2 id="creating-store">Creating a Redux Store</h2>
      <p>Redux Toolkit's <code>configureStore</code> function simplifies the store setup process. It automatically sets up the store with good default settings:</p>
      
      <pre><code class="language-javascript">import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';

const store = configureStore({
  reducer: rootReducer,
});

export default store;</code></pre>

      <p>This automatically sets up the Redux DevTools Extension, adds the redux-thunk middleware, and enables development checks like immutability detection.</p>
      
      <h2 id="creating-slices">Creating Redux Slices</h2>
      <p>The <code>createSlice</code> function is the heart of Redux Toolkit. It allows you to write reducers and actions in a more concise way:</p>
      
      <pre><code class="language-javascript">import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers
      // It doesn't actually mutate the state because it uses Immer
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

// Action creators are generated for each reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;</code></pre>

      <h2 id="async-logic">Handling Async Logic</h2>
      <p>For async operations, Redux Toolkit offers <code>createAsyncThunk</code>:</p>
      
      <pre><code class="language-javascript">import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Create an async thunk
export const fetchUserData = createAsyncThunk(
  'users/fetchUserData',
  async (userId, thunkAPI) => {
    const response = await fetch(`https://api.example.com/users/${userId}`);
    return await response.json();
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;</code></pre>

      <h2 id="performance">Performance Optimization</h2>
      <p>When it comes to performance optimization, there are several best practices to follow with Redux Toolkit:</p>
      
      <h3 id="selectors">Using Selectors</h3>
      <p>Selectors help derive data from the store, ensuring components only re-render when necessary:</p>
      
      <pre><code class="language-javascript">import { createSelector } from '@reduxjs/toolkit';

// Basic selector
export const selectUser = (state) => state.user.data;

// Memoized selector for derived data
export const selectUserDetails = createSelector(
  [selectUser],
  (user) => ({
    fullName: user ? `${user.firstName} ${user.lastName}` : '',
    avatarUrl: user ? user.avatarUrl : null,
  })
);</code></pre>

      <h2 id="comparing-approaches">Comparing Traditional Redux vs. Redux Toolkit</h2>
      <p>Let's compare the traditional Redux approach with Redux Toolkit for creating a counter feature:</p>
    `,
    excerpt: 'Learn how to structure large-scale React applications with Redux Toolkit for optimal performance and maintainability.',
    coverImage: '/api/placeholder/1200/630',
    author: {
      id: 1,
      name: 'Sarah Chen',
      avatar: '/api/placeholder/64/64',
      username: 'sarahchen',
      bio: 'Frontend Developer | React Enthusiast',
    },
    publishedAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-16T14:22:00Z',
    readTime: 8,
    tags: ['react', 'redux', 'javascript'],
    commentsCount: 24,
    likesCount: 182,
    bookmarked: false,
    views: 1432,
    relatedArticles: [
      {
        id: 2,
        title: 'Advanced TypeScript Patterns for Frontend Developers',
        excerpt: 'Explore advanced TypeScript features and patterns that will take your frontend development skills to the next level.',
        coverImage: '/api/placeholder/640/360',
        author: {
          name: 'Alex Rivera',
          avatar: '/api/placeholder/40/40',
        },
        publishedAt: '2023-05-12T14:45:00Z',
        readTime: 12,
      },
      {
        id: 3,
        title: 'React Performance Optimization Techniques',
        excerpt: 'Learn how to optimize your React applications for better performance and user experience.',
        coverImage: '/api/placeholder/640/360',
        author: {
          name: 'Michael Johnson',
          avatar: '/api/placeholder/40/40',
        },
        publishedAt: '2023-05-10T09:15:00Z',
        readTime: 10,
      },
    ],
    comments: [
      {
        id: 1,
        author: {
          id: 2,
          name: 'Alex Rivera',
          avatar: '/api/placeholder/40/40',
          username: 'alexrivera'
        },
        content: 'Great article! I really appreciated the section on performance optimization.',
        createdAt: '2023-05-15T16:45:00Z',
        likesCount: 5,
      },
      {
        id: 2,
        author: {
          id: 3,
          name: 'Emma Patel',
          avatar: '/api/placeholder/40/40',
          username: 'emmapatel'
        },
        content: 'This was exactly what I needed. The comparison between traditional Redux and Redux Toolkit really helped me understand the benefits.',
        createdAt: '2023-05-16T09:20:00Z',
        likesCount: 3,
      },
    ]
  };
  
  // Default to mock data if API data is not yet loaded
  const articleData = article || mockArticle;
  const tableOfContents = generateTableOfContents();
  
  // Code comparison examples
  const reduxComparisonSnippets = [
    {
      id: 'traditional',
      name: 'Traditional Redux',
      language: 'javascript',
      code: `// actions.js
export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';
export const INCREMENT_BY_AMOUNT = 'INCREMENT_BY_AMOUNT';

export const increment = () => ({
  type: INCREMENT
});

export const decrement = () => ({
  type: DECREMENT
});

export const incrementByAmount = (amount) => ({
  type: INCREMENT_BY_AMOUNT,
  payload: amount
});

// reducer.js
const initialState = {
  value: 0
};

export default function counterReducer(state = initialState, action) {
  switch (action.type) {
    case INCREMENT:
      return {
        ...state,
        value: state.value + 1
      };
    case DECREMENT:
      return {
        ...state,
        value: state.value - 1
      };
    case INCREMENT_BY_AMOUNT:
      return {
        ...state,
        value: state.value + action.payload
      };
    default:
      return state;
  }
}`
    },
    {
      id: 'toolkit',
      name: 'Redux Toolkit',
      language: 'javascript',
      code: `// counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0
  },
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers
      // It doesn't actually mutate the state because it uses Immer
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    }
  }
});

// Action creators are generated for each reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;`
    }
  ];
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-neutral-200 rounded w-3/4"></div>
          <div className="h-64 bg-neutral-200 rounded"></div>
          <div className="space-y-3">
            <div className="h-4 bg-neutral-200 rounded"></div>
            <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
            <div className="h-4 bg-neutral-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md">
          <p className="font-medium">Error loading article: {error}</p>
          <p className="mt-2">Please try again later.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white">
      {/* Article header */}
      <div className="w-full bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
          <div className="mb-8">
            <button
              className="inline-flex items-center text-neutral-600 hover:text-neutral-900"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Back</span>
            </button>
          </div>
          
          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
            {articleData.title}
          </h1>
          
          {/* Meta info */}
          <div className="flex items-center mb-6">
            <Link to={`/profile/${articleData.author.username}`} className="flex items-center group">
              <img
                src={articleData.author.avatar}
                alt={articleData.author.name}
                className="h-10 w-10 rounded-full mr-3 border-2 border-transparent group-hover:border-primary-300"
              />
              <div>
                <h3 className="text-neutral-900 font-medium group-hover:text-primary-600">
                  {articleData.author.name}
                </h3>
                <div className="flex items-center text-sm text-neutral-500">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span className="mr-3">{formatDate(articleData.publishedAt)}</span>
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>{articleData.readTime} min read</span>
                </div>
              </div>
            </Link>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {articleData.tags.map(tag => (
              <Link
                key={tag}
                to={`/tag/${tag}`}
                className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-sm font-medium rounded-full transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <button
              className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                liked
                  ? 'bg-error-100 text-error-700'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
              onClick={handleLikeToggle}
            >
              <Heart className={`h-4 w-4 mr-1.5 ${liked ? 'fill-error-500' : ''}`} />
              <span>{likesCount}</span>
            </button>
            
            <button
              className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                bookmarked
                  ? 'bg-primary-100 text-primary-700' 
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
              onClick={handleBookmarkToggle}
            >
              {bookmarked ? (
                <BookmarkCheck className="h-4 w-4 mr-1.5 fill-primary-500" />
              ) : (
                <Bookmark className="h-4 w-4 mr-1.5" />
              )}
              <span>Save</span>
            </button>
            
            {/* Share dropdown */}
            <div className="relative">
              <button
                className="flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                onClick={() => setShareMenuOpen(!shareMenuOpen)}
              >
                <Share2 className="h-4 w-4 mr-1.5" />
                <span>Share</span>
              </button>
              
              {shareMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShareMenuOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <button
                        className="w-full flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        onClick={() => shareOnSocial('twitter')}
                      >
                        <Twitter className="h-4 w-4 mr-3 text-blue-400" />
                        Twitter
                      </button>
                      <button
                        className="w-full flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        onClick={() => shareOnSocial('facebook')}
                      >
                        <Facebook className="h-4 w-4 mr-3 text-blue-600" />
                        Facebook
                      </button>
                      <button
                        className="w-full flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        onClick={() => shareOnSocial('linkedin')}
                      >
                        <Linkedin className="h-4 w-4 mr-3 text-blue-700" />
                        LinkedIn
                      </button>
                      <button
                        className="w-full flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        onClick={copyArticleUrl}
                      >
                        {copied ? (
                          <>
                            <Check className="h-4 w-4 mr-3 text-green-500" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Link2 className="h-4 w-4 mr-3 text-neutral-500" />
                            Copy link
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* More options */}
            <div className="relative ml-auto">
              <button
                className="p-1.5 rounded-full text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
                onClick={() => setMoreOptionsOpen(!moreOptionsOpen)}
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
              
              {moreOptionsOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setMoreOptionsOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      {user && user.id === articleData.author.id && (
                        <>
                          <Link
                            to={`/editor/${articleId}`}
                            className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                          >
                            <Edit className="h-4 w-4 mr-3 text-neutral-500" />
                            Edit article
                          </Link>
                          <button
                            className="w-full flex items-center px-4 py-2 text-sm text-error-600 hover:bg-error-50"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this article?')) {
                                // Handle delete
                                navigate('/');
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-3" />
                            Delete article
                          </button>
                          <div className="border-t border-neutral-200 my-1"></div>
                        </>
                      )}
                      <button
                        className="w-full flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        onClick={printArticle}
                      >
                        <Printer className="h-4 w-4 mr-3 text-neutral-500" />
                        Print article
                      </button>
                      <button
                        className="w-full flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        onClick={() => {
                          // Report content
                          setMoreOptionsOpen(false);
                        }}
                      >
                        <Flag className="h-4 w-4 mr-3 text-neutral-500" />
                        Report content
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Cover image */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="rounded-xl overflow-hidden shadow-soft-lg">
          <img
            src={articleData.coverImage}
            alt={articleData.title}
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar */}
          <div className="lg:w-64 lg:pr-8 mb-8 lg:mb-0">
            <div className="lg:sticky lg:top-24">
              {/* Table of contents */}
              {tableOfContents.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-3 uppercase tracking-wider">
                    Table of Contents
                  </h3>
                  <nav className="space-y-1">
                    {tableOfContents.map(heading => (
                      <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        className={`block px-3 py-2 text-sm rounded-md toc-link ${
                          heading.level === 3 ? 'pl-6 text-neutral-600' : 'font-medium text-neutral-800'
                        } hover:bg-neutral-100 hover:text-neutral-900 transition-colors`}
                      >
                        {heading.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}
              
              {/* Read more from author */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-neutral-900 mb-3 uppercase tracking-wider">
                  More from {articleData.author.name}
                </h3>
                <Link 
                  to={`/profile/${articleData.author.username}`}
                  className="flex items-center mb-4 group"
                >
                  <img
                    src={articleData.author.avatar}
                    alt={articleData.author.name}
                    className="h-12 w-12 rounded-full mr-3 border-2 border-transparent group-hover:border-primary-300"
                  />
                  <div>
                    <div className="text-neutral-900 font-medium group-hover:text-primary-600">
                      {articleData.author.name}
                    </div>
                    <div className="text-sm text-neutral-500">
                      {articleData.author.bio}
                    </div>
                  </div>
                </Link>
                <Link
                  to={`/profile/${articleData.author.username}/articles`}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  View all articles
                </Link>
              </div>
              
              {/* Stats */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-neutral-900 mb-3 uppercase tracking-wider">
                  Article Stats
                </h3>
                <div className="bg-neutral-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neutral-900">
                        {articleData.views.toLocaleString()}
                      </div>
                      <div className="text-xs text-neutral-500 flex items-center justify-center">
                        <Eye className="h-3 w-3 mr-1" />
                        Views
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neutral-900">
                        {articleData.likesCount.toLocaleString()}
                      </div>
                      <div className="text-xs text-neutral-500 flex items-center justify-center">
                        <Heart className="h-3 w-3 mr-1" />
                        Likes
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neutral-900">
                        {articleData.commentsCount.toLocaleString()}
                      </div>
                      <div className="text-xs text-neutral-500 flex items-center justify-center">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Comments
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neutral-900">
                        {articleData.readTime}
                      </div>
                      <div className="text-xs text-neutral-500 flex items-center justify-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Min read
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tags */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-3 uppercase tracking-wider">
                  Related Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {articleData.tags.map(tag => (
                    <Link
                      key={tag}
                      to={`/tag/${tag}`}
                      className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-sm font-medium rounded-full transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="lg:flex-1">
            <article className="prose prose-lg max-w-none">
              {/* Process the article content */}
              <div dangerouslySetInnerHTML={{ __html: processContent(articleData.content) }} />
              
              {/* Add code comparison example */}
              <h2 id="comparing-code">Comparing Traditional Redux vs. Redux Toolkit</h2>
              <p>
                Let's compare the traditional Redux approach with Redux Toolkit to see how much more concise and maintainable your code becomes:
              </p>
              
              <CodeComparisonViewer
                title="Redux Implementation Comparison"
                description="Traditional Redux requires separate files for actions and reducers, while Redux Toolkit combines them into a single 'slice'."
                codeSnippets={reduxComparisonSnippets}
                highlightChanges={true}
                showStats={true}
                stats={{
                  traditional: {
                    complexity: 'O(n)',
                    executionTime: '1.2',
                    linesOfCode: '45'
                  },
                  toolkit: {
                    complexity: 'O(n)',
                    executionTime: '0.8', 
                    linesOfCode: '27'
                  }
                }}
              />
              
              <h2 id="conclusion">Conclusion</h2>
              <p>
                Redux Toolkit significantly simplifies Redux development by providing utilities to handle the most common use cases. It reduces boilerplate, improves readability, and helps enforce best practices.
              </p>
              <p>
                By adopting Redux Toolkit in your React applications, you'll be able to build more scalable, maintainable, and performant state management solutions.
              </p>
            </article>
            
            {/* Author bio */}
            <div className="mt-12 p-6 bg-neutral-50 rounded-xl border border-neutral-200">
              <div className="flex items-start md:items-center flex-col md:flex-row">
                <img
                  src={articleData.author.avatar}
                  alt={articleData.author.name}
                  className="h-16 w-16 rounded-full mb-4 md:mb-0 md:mr-4 border-2 border-white"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                    Written by {articleData.author.name}
                  </h3>
                  <p className="text-neutral-600 mb-3">
                    {articleData.author.bio}
                  </p>
                  <div className="flex space-x-2">
                    <Link
                      to={`/profile/${articleData.author.username}`}
                      className="px-3 py-1 bg-primary-600 text-white text-sm font-medium rounded hover:bg-primary-700 transition-colors"
                    >
                      Follow
                    </Link>
                    <Link
                      to={`/profile/${articleData.author.username}`}
                      className="px-3 py-1 bg-white text-neutral-800 text-sm font-medium rounded border border-neutral-300 hover:bg-neutral-100 transition-colors"
                    >
                      More articles
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Related articles */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articleData.relatedArticles.map(article => (
                  <Link
                    key={article.id}
                    to={`/article/${article.id}`}
                    className="group block"
                  >
                    <div className="bg-white rounded-lg overflow-hidden shadow-soft border border-neutral-200 transition-all group-hover:shadow-soft-md group-hover:-translate-y-1 duration-300">
                      <div className="h-40 overflow-hidden">
                        <img
                          src={article.coverImage}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-neutral-600 text-sm mb-3 line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <img
                              src={article.author.avatar}
                              alt={article.author.name}
                              className="h-6 w-6 rounded-full mr-2"
                            />
                            <span className="text-xs text-neutral-500">
                              {article.author.name}
                            </span>
                          </div>
                          <div className="text-xs text-neutral-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {article.readTime} min read
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Comments section */}
            <div className="mt-12" id="comments">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                Comments ({articleData.comments.length})
              </h2>
              
              {/* Comment form */}
              <div className="mb-8">
                <div className="flex space-x-4">
                  <img
                    src={user ? user.avatar : '/api/placeholder/40/40'}
                    alt="Your avatar"
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="flex-1">
                    <textarea
                      placeholder="Add a comment..."
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      rows="3"
                    ></textarea>
                    <div className="mt-2 flex justify-end">
                      <button className="px-4 py-2 bg-primary-600 text-white font-medium rounded hover:bg-primary-700 transition-colors">
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Comments list */}
              <div className="space-y-6">
                {articleData.comments.map(comment => (
                  <div key={comment.id} className="flex space-x-4">
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="bg-neutral-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-neutral-900">
                            {comment.author.name}
                          </div>
                          <div className="text-xs text-neutral-500">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                          </div>
                        </div>
                        <p className="text-neutral-700">
                          {comment.content}
                        </p>
                      </div>
                      <div className="flex items-center mt-2 ml-2">
                        <button className="text-xs text-neutral-500 hover:text-neutral-700 flex items-center mr-4">
                          <Heart className="h-3 w-3 mr-1" />
                          {comment.likesCount}
                        </button>
                        <button className="text-xs text-neutral-500 hover:text-neutral-700 flex items-center">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;