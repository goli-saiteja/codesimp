import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Calendar, MapPin, Briefcase, Link as LinkIcon, Twitter, 
  Github, Globe, Settings, Edit, Users, FileText, Code, BookOpen,
  Award, Heart, MessageSquare, Eye, Star, Activity, BarChart2, 
  TrendingUp, Clock, Rss, Book, Coffee, Save, Bookmark, Plus
} from 'lucide-react';
import ArticleCard from '../components/blog/ArticleCard';
import { format } from 'date-fns';

const ProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Current authenticated user
  const currentUser = useSelector(state => state.auth.user);
  
  // State for profile data
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Tab state
  const [activeTab, setActiveTab] = useState('posts');
  
  // State for content
  const [articles, setArticles] = useState([]);
  const [pinnedArticles, setPinnedArticles] = useState([]);
  const [playgrounds, setPlaygrounds] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  
  // Stats state
  const [stats, setStats] = useState({
    articles: 0,
    playgrounds: 0,
    followers: 0,
    following: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0
  });
  
  // Track if this is the current user's profile
  const isOwnProfile = currentUser && username === currentUser.username;
  
  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, this would be an API call
        // For now, we'll use mock data
        setTimeout(() => {
          const mockProfile = {
            id: 1,
            username: username,
            name: 'Sarah Chen',
            avatar: '/api/placeholder/128/128',
            bio: 'Senior Frontend Developer specializing in React and modern JavaScript. I write about web development, performance optimization, and developer tooling.',
            location: 'San Francisco, CA',
            company: 'TechFlow Inc.',
            website: 'https://sarahchen.dev',
            twitter: 'sarahcodes',
            github: 'sarahchen',
            joinedAt: '2021-04-15T10:30:00Z',
            isFollowing: false,
            stats: {
              articles: 24,
              playgrounds: 12,
              followers: 1248,
              following: 357,
              totalViews: 256789,
              totalLikes: 8734,
              totalComments: 1289
            }
          };
          
          setProfile(mockProfile);
          setStats(mockProfile.stats);
          setIsLoading(false);
          
          // Also fetch related content
          fetchArticles();
          fetchPlaygrounds();
          fetchBookmarks();
          fetchFollowers();
          fetchFollowing();
          
        }, 800);
      } catch (error) {
        setError('Failed to load profile');
        setIsLoading(false);
      }
    };
    
    if (username) {
      fetchProfile();
    }
  }, [username]);
  
  // Fetch articles
  const fetchArticles = async () => {
    try {
      // Mock data
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
            featured: true,
            pinned: true
          },
          {
            id: 2,
            title: 'Mastering TypeScript Generics: Advanced Patterns for Flexible Code',
            excerpt: 'Explore advanced TypeScript generics patterns that will help you write more flexible and reusable code.',
            coverImage: '/api/placeholder/640/360',
            author: {
              id: 1,
              name: 'Sarah Chen',
              avatar: '/api/placeholder/40/40',
              username: 'sarahchen'
            },
            publishedAt: '2023-05-02T14:45:00Z',
            readTime: 12,
            tags: ['typescript', 'javascript', 'web development'],
            commentsCount: 18,
            likesCount: 145,
            bookmarked: true,
            featured: false,
            pinned: true
          },
          {
            id: 3,
            title: 'Optimizing React Performance with useMemo and useCallback',
            excerpt: 'A deep dive into React\'s memoization hooks and how to use them effectively to boost your application\'s performance.',
            coverImage: '/api/placeholder/640/360',
            author: {
              id: 1,
              name: 'Sarah Chen',
              avatar: '/api/placeholder/40/40',
              username: 'sarahchen'
            },
            publishedAt: '2023-04-20T09:15:00Z',
            readTime: 10,
            tags: ['react', 'performance', 'hooks'],
            commentsCount: 32,
            likesCount: 210,
            bookmarked: false,
            featured: false,
            pinned: false
          },
          {
            id: 4,
            title: 'Building a Custom React Hook for API Calls',
            excerpt: 'Learn how to create a reusable custom hook for handling API requests in your React applications.',
            coverImage: '/api/placeholder/640/360',
            author: {
              id: 1,
              name: 'Sarah Chen',
              avatar: '/api/placeholder/40/40',
              username: 'sarahchen'
            },
            publishedAt: '2023-04-05T16:20:00Z',
            readTime: 6,
            tags: ['react', 'hooks', 'api'],
            commentsCount: 15,
            likesCount: 98,
            bookmarked: false,
            featured: false,
            pinned: false
          },
        ];
        
        // Set articles and pinned articles
        setArticles(mockArticles);
        setPinnedArticles(mockArticles.filter(article => article.pinned));
      }, 500);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    }
  };
  
  // Fetch playgrounds
  const fetchPlaygrounds = async () => {
    try {
      // Mock data
      setTimeout(() => {
        const mockPlaygrounds = [
          {
            id: 1,
            title: 'React Todo App Example',
            description: 'A simple todo app built with React and hooks.',
            language: 'javascript',
            createdAt: '2023-05-10T14:30:00Z',
            updatedAt: '2023-05-12T09:45:00Z',
            views: 1432,
            stars: 78,
            forks: 23
          },
          {
            id: 2,
            title: 'TypeScript Data Structures',
            description: 'Implementation of common data structures in TypeScript.',
            language: 'typescript',
            createdAt: '2023-04-22T11:20:00Z',
            updatedAt: '2023-04-25T15:30:00Z',
            views: 876,
            stars: 42,
            forks: 12
          },
          {
            id: 3,
            title: 'CSS Grid Layout Examples',
            description: 'Various layout patterns using CSS Grid.',
            language: 'html',
            createdAt: '2023-04-05T09:15:00Z',
            updatedAt: '2023-04-05T09:15:00Z',
            views: 543,
            stars: 26,
            forks: 8
          }
        ];
        
        setPlaygrounds(mockPlaygrounds);
      }, 600);
    } catch (error) {
      console.error('Failed to fetch playgrounds:', error);
    }
  };
  
  // Fetch bookmarks
  const fetchBookmarks = async () => {
    try {
      // Mock data
      setTimeout(() => {
        const mockBookmarks = [
          {
            id: 5,
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
            id: 6,
            title: 'Building a GraphQL API with Node.js and Apollo Server',
            excerpt: 'A comprehensive guide to setting up a GraphQL API using Node.js, Express, and Apollo Server.',
            coverImage: '/api/placeholder/640/360',
            author: {
              id: 3,
              name: 'Michael Johnson',
              avatar: '/api/placeholder/40/40',
              username: 'michaelj'
            },
            publishedAt: '2023-05-08T09:15:00Z',
            readTime: 15,
            tags: ['graphql', 'node.js', 'api'],
            commentsCount: 32,
            likesCount: 210,
            bookmarked: true,
            featured: false
          }
        ];
        
        setBookmarks(mockBookmarks);
      }, 700);
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error);
    }
  };
  
  // Fetch followers
  const fetchFollowers = async () => {
    try {
      // Mock data
      setTimeout(() => {
        const mockFollowers = [
          {
            id: 2,
            name: 'Alex Rivera',
            username: 'alexrivera',
            avatar: '/api/placeholder/64/64',
            bio: 'Full Stack Developer | JavaScript Enthusiast'
          },
          {
            id: 3,
            name: 'Michael Johnson',
            username: 'michaelj',
            avatar: '/api/placeholder/64/64',
            bio: 'Frontend Engineer at TechCorp'
          },
          {
            id: 4,
            name: 'Emma Patel',
            username: 'emmapatel',
            avatar: '/api/placeholder/64/64',
            bio: 'UX Developer | CSS Wizard'
          }
        ];
        
        setFollowers(mockFollowers);
      }, 800);
    } catch (error) {
      console.error('Failed to fetch followers:', error);
    }
  };
  
  // Fetch following
  const fetchFollowing = async () => {
    try {
      // Mock data
      setTimeout(() => {
        const mockFollowing = [
          {
            id: 5,
            name: 'David Kim',
            username: 'davidkim',
            avatar: '/api/placeholder/64/64',
            bio: 'JavaScript Developer | Open Source Contributor'
          },
          {
            id: 6,
            name: 'Olivia Martinez',
            username: 'oliviam',
            avatar: '/api/placeholder/64/64',
            bio: 'Senior React Developer | Technical Writer'
          }
        ];
        
        setFollowing(mockFollowing);
      }, 900);
    } catch (error) {
      console.error('Failed to fetch following:', error);
    }
  };
  
  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    if (!currentUser) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }
    
    try {
      // In a real app, this would be an API call
      setProfile(prev => ({
        ...prev,
        isFollowing: !prev.isFollowing
      }));
      
      // Update follower count
      setStats(prev => ({
        ...prev,
        followers: prev.followers + (profile.isFollowing ? -1 : 1)
      }));
    } catch (error) {
      console.error('Failed to follow/unfollow:', error);
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMMM yyyy');
  };
  
  // Format number with K/M suffix
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };
  
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="h-48 w-48 bg-neutral-200 rounded-full mx-auto"></div>
            </div>
            <div className="md:w-2/3 space-y-4">
              <div className="h-8 bg-neutral-200 rounded w-1/3"></div>
              <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
              <div className="h-20 bg-neutral-200 rounded w-full"></div>
              <div className="flex gap-2">
                <div className="h-10 bg-neutral-200 rounded w-24"></div>
                <div className="h-10 bg-neutral-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md">
          <p className="font-medium">Error loading profile: {error}</p>
          <p className="mt-2">Please try again later.</p>
        </div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="h-24 w-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="h-12 w-12 text-neutral-400" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">User Not Found</h2>
          <p className="text-neutral-600 mb-6">The user you're looking for doesn't seem to exist.</p>
          <Link to="/" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white">
      {/* Profile header */}
      <div className="w-full bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar section */}
            <div className="md:w-1/3 flex flex-col items-center">
              <div className="relative mb-4">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-48 w-48 rounded-full object-cover border-4 border-white shadow-md"
                />
                {isOwnProfile && (
                  <button className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md text-neutral-600 hover:text-neutral-900 transition-colors">
                    <Edit className="h-5 w-5" />
                  </button>
                )}
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 text-center mb-1">
                {profile.name}
              </h1>
              <div className="text-neutral-600 text-center mb-4">@{profile.username}</div>
              
              <div className="flex space-x-3 mb-6">
                {isOwnProfile ? (
                  <Link
                    to="/settings/profile"
                    className="px-4 py-2 bg-white border border-neutral-300 rounded-lg shadow-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    <Settings className="h-4 w-4 inline mr-2" />
                    Edit Profile
                  </Link>
                ) : (
                  <button
                    className={`px-4 py-2 rounded-lg shadow-sm ${
                      profile.isFollowing 
                        ? 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50' 
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    } transition-colors`}
                    onClick={handleFollowToggle}
                  >
                    {profile.isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
              
              {/* Stats */}
              <div className="bg-white rounded-lg border border-neutral-200 shadow-soft p-4 w-full">
                <h3 className="text-sm font-semibold text-neutral-900 mb-3 uppercase tracking-wider">
                  Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neutral-900">
                      {formatNumber(stats.articles)}
                    </div>
                    <div className="text-xs text-neutral-500 flex items-center justify-center">
                      <FileText className="h-3 w-3 mr-1" />
                      Articles
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neutral-900">
                      {formatNumber(stats.playgrounds)}
                    </div>
                    <div className="text-xs text-neutral-500 flex items-center justify-center">
                      <Code className="h-3 w-3 mr-1" />
                      Playgrounds
                    </div>
                  </div>
                  <div className="text-center">
                    <Link to={`/profile/${profile.username}/followers`} className="block hover:opacity-80 transition-opacity">
                      <div className="text-2xl font-bold text-neutral-900">
                        {formatNumber(stats.followers)}
                      </div>
                      <div className="text-xs text-neutral-500 flex items-center justify-center">
                        <Users className="h-3 w-3 mr-1" />
                        Followers
                      </div>
                    </Link>
                  </div>
                  <div className="text-center">
                    <Link to={`/profile/${profile.username}/following`} className="block hover:opacity-80 transition-opacity">
                      <div className="text-2xl font-bold text-neutral-900">
                        {formatNumber(stats.following)}
                      </div>
                      <div className="text-xs text-neutral-500 flex items-center justify-center">
                        <Users className="h-3 w-3 mr-1" />
                        Following
                      </div>
                    </Link>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neutral-900">
                      {formatNumber(stats.totalViews)}
                    </div>
                    <div className="text-xs text-neutral-500 flex items-center justify-center">
                      <Eye className="h-3 w-3 mr-1" />
                      Total Views
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neutral-900">
                      {formatNumber(stats.totalLikes)}
                    </div>
                    <div className="text-xs text-neutral-500 flex items-center justify-center">
                      <Heart className="h-3 w-3 mr-1" />
                      Total Likes
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bio & info */}
              <div className="mt-6 w-full">
                <div className="text-neutral-700 mb-4">
                  {profile.bio}
                </div>
                
                <div className="space-y-2 text-sm text-neutral-600">
                  {profile.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-neutral-400" />
                      {profile.location}
                    </div>
                  )}
                  
                  {profile.company && (
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-neutral-400" />
                      {profile.company}
                    </div>
                  )}
                  
                  {profile.website && (
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-neutral-400" />
                      <a 
                        href={profile.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 hover:underline"
                      >
                        {profile.website.replace(/(^\w+:|^)\/\//, '')}
                      </a>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-neutral-400" />
                    Joined {formatDate(profile.joinedAt)}
                  </div>
                  
                  {/* Social links */}
                  <div className="flex items-center pt-2 space-x-3">
                    {profile.twitter && (
                      <a 
                        href={`https://twitter.com/${profile.twitter}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-neutral-600 hover:text-primary-600 transition-colors"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                    )}
                    
                    {profile.github && (
                      <a 
                        href={`https://github.com/${profile.github}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-neutral-600 hover:text-neutral-900 transition-colors"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Content section */}
            <div className="md:w-2/3">
              {/* Tabs */}
              <div className="mb-6 border-b border-neutral-200">
                <nav className="flex space-x-8">
                  <button
                    className={`py-4 px-1 flex items-center text-sm font-medium border-b-2 ${
                      activeTab === 'posts'
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
                    }`}
                    onClick={() => setActiveTab('posts')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Articles
                    <span className="ml-2 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-900">
                      {stats.articles}
                    </span>
                  </button>
                  
                  <button
                    className={`py-4 px-1 flex items-center text-sm font-medium border-b-2 ${
                      activeTab === 'playgrounds'
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
                    }`}
                    onClick={() => setActiveTab('playgrounds')}
                  >
                    <Code className="h-4 w-4 mr-2" />
                    Playgrounds
                    <span className="ml-2 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-900">
                      {stats.playgrounds}
                    </span>
                  </button>
                  
                  {isOwnProfile && (
                    <button
                      className={`py-4 px-1 flex items-center text-sm font-medium border-b-2 ${
                        activeTab === 'bookmarks'
                          ? 'border-primary-600 text-primary-600'
                          : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
                      }`}
                      onClick={() => setActiveTab('bookmarks')}
                    >
                      <Bookmark className="h-4 w-4 mr-2" />
                      Bookmarks
                    </button>
                  )}
                  
                  <button
                    className={`py-4 px-1 flex items-center text-sm font-medium border-b-2 ${
                      activeTab === 'followers'
                        ? 'border-primary-600 text-primary-600'
                        : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
                    }`}
                    onClick={() => setActiveTab('followers')}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Followers
                  </button>
                </nav>
              </div>
              
              {/* Content based on active tab */}
              {activeTab === 'posts' && (
                <div>
                  {/* Action buttons for own profile */}
                  {isOwnProfile && (
                    <div className="flex justify-end mb-6">
                      <Link 
                        to="/editor" 
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-1.5" />
                        New Article
                      </Link>
                    </div>
                  )}
                  
                  {/* Pinned articles */}
                  {pinnedArticles.length > 0 && (
                    <div className="mb-8">
                      <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
                        <Bookmark className="h-4 w-4 mr-1.5 text-primary-600" />
                        Pinned Articles
                      </h2>
                      <div className="grid grid-cols-1 gap-6">
                        {pinnedArticles.map(article => (
                          <ArticleCard key={article.id} article={article} />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* All articles */}
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
                      <FileText className="h-4 w-4 mr-1.5 text-primary-600" />
                      All Articles
                    </h2>
                    
                    {articles.length > 0 ? (
                      <div className="grid grid-cols-1 gap-6">
                        {articles.map(article => (
                          <ArticleCard key={article.id} article={article} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-neutral-50 rounded-lg">
                        <BookOpen className="h-12 w-12 mx-auto text-neutral-300 mb-3" />
                        <h3 className="text-lg font-medium text-neutral-800 mb-2">No Articles Yet</h3>
                        <p className="text-neutral-600 mb-6">
                          {isOwnProfile ? "You haven't published any articles yet." : `${profile.name} hasn't published any articles yet.`}
                        </p>
                        {isOwnProfile && (
                          <Link to="/editor" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
                            Write Your First Article
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Playgrounds tab */}
              {activeTab === 'playgrounds' && (
                <div>
                  {/* Action buttons for own profile */}
                  {isOwnProfile && (
                    <div className="flex justify-end mb-6">
                      <Link 
                        to="/playground/new" 
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-1.5" />
                        New Playground
                      </Link>
                    </div>
                  )}
                  
                  {/* Playgrounds list */}
                  {playgrounds.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {playgrounds.map(playground => (
                        <Link 
                          key={playground.id} 
                          to={`/playground/${playground.id}`}
                          className="block bg-white rounded-lg border border-neutral-200 shadow-soft hover:shadow-soft-md transition-all hover:-translate-y-1 duration-300"
                        >
                          <div className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-lg font-semibold text-neutral-900 mb-1 hover:text-primary-600 transition-colors">
                                  {playground.title}
                                </h3>
                                <p className="text-neutral-600 text-sm mb-2">{playground.description}</p>
                              </div>
                              <div className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                                playground.language === 'javascript' ? 'bg-yellow-100 text-yellow-800' :
                                playground.language === 'typescript' ? 'bg-blue-100 text-blue-800' :
                                playground.language === 'html' ? 'bg-red-100 text-red-800' :
                                'bg-neutral-100 text-neutral-800'
                              }`}>
                                {playground.language}
                              </div>
                            </div>
                            <div className="flex items-center text-xs text-neutral-500 mt-2">
                              <div className="flex items-center mr-4">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatDate(playground.updatedAt)}
                              </div>
                              <div className="flex items-center mr-4">
                                <Eye className="h-3 w-3 mr-1" />
                                {formatNumber(playground.views)} views
                              </div>
                              <div className="flex items-center mr-4">
                                <Star className="h-3 w-3 mr-1" />
                                {formatNumber(playground.stars)}
                              </div>
                              <div className="flex items-center">
                                <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M7 5C7 3.89543 7.89543 3 9 3C10.1046 3 11 3.89543 11 5C11 6.10457 10.1046 7 9 7C7.89543 7 7 6.10457 7 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M14 19C14 17.8954 14.8954 17 16 17C17.1046 17 18 17.8954 18 19C18 20.1046 17.1046 21 16 21C14.8954 21 14 20.1046 14 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M7 19C7 17.8954 7.89543 17 9 17C10.1046 17 11 17.8954 11 19C11 20.1046 10.1046 21 9 21C7.89543 21 7 20.1046 7 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M9 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M9 17L16 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                {formatNumber(playground.forks)}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-neutral-50 rounded-lg">
                      <Code className="h-12 w-12 mx-auto text-neutral-300 mb-3" />
                      <h3 className="text-lg font-medium text-neutral-800 mb-2">No Playgrounds Yet</h3>
                      <p className="text-neutral-600 mb-6">
                        {isOwnProfile ? "You haven't created any code playgrounds yet." : `${profile.name} hasn't created any code playgrounds yet.`}
                      </p>
                      {isOwnProfile && (
                        <Link to="/playground/new" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
                          Create Your First Playground
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {/* Bookmarks tab */}
              {activeTab === 'bookmarks' && isOwnProfile && (
                <div>
                  {bookmarks.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                      {bookmarks.map(article => (
                        <ArticleCard key={article.id} article={article} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-neutral-50 rounded-lg">
                      <Bookmark className="h-12 w-12 mx-auto text-neutral-300 mb-3" />
                      <h3 className="text-lg font-medium text-neutral-800 mb-2">No Bookmarks Yet</h3>
                      <p className="text-neutral-600 mb-6">
                        You haven't bookmarked any articles yet.
                      </p>
                      <Link to="/explore" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
                        Explore Articles
                      </Link>
                    </div>
                  )}
                </div>
              )}
              
              {/* Followers tab */}
              {activeTab === 'followers' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-neutral-900">
                      Followers ({formatNumber(stats.followers)})
                    </h2>
                  </div>
                  
                  {followers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {followers.map(follower => (
                        <Link 
                          key={follower.id} 
                          to={`/profile/${follower.username}`}
                          className="flex items-start p-4 bg-white rounded-lg border border-neutral-200 shadow-soft hover:shadow-soft-md transition-all hover:-translate-y-1 duration-300"
                        >
                          <img
                            src={follower.avatar}
                            alt={follower.name}
                            className="h-12 w-12 rounded-full mr-4"
                          />
                          <div>
                            <h3 className="font-medium text-neutral-900 hover:text-primary-600 transition-colors">
                              {follower.name}
                            </h3>
                            <div className="text-sm text-neutral-500 mb-1">@{follower.username}</div>
                            <p className="text-sm text-neutral-600 line-clamp-2">{follower.bio}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-neutral-50 rounded-lg">
                      <Users className="h-12 w-12 mx-auto text-neutral-300 mb-3" />
                      <h3 className="text-lg font-medium text-neutral-800 mb-2">No Followers Yet</h3>
                      <p className="text-neutral-600">
                        {isOwnProfile ? "You don't have any followers yet." : `${profile.name} doesn't have any followers yet.`}
                      </p>
                    </div>
                  )}
                  
                  {/* Also show following */}
                  <div className="mt-12">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                      Following ({formatNumber(stats.following)})
                    </h2>
                    
                    {following.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {following.map(follow => (
                          <Link 
                            key={follow.id} 
                            to={`/profile/${follow.username}`}
                            className="flex items-start p-4 bg-white rounded-lg border border-neutral-200 shadow-soft hover:shadow-soft-md transition-all hover:-translate-y-1 duration-300"
                          >
                            <img
                              src={follow.avatar}
                              alt={follow.name}
                              className="h-12 w-12 rounded-full mr-4"
                            />
                            <div>
                              <h3 className="font-medium text-neutral-900 hover:text-primary-600 transition-colors">
                                {follow.name}
                              </h3>
                              <div className="text-sm text-neutral-500 mb-1">@{follow.username}</div>
                              <p className="text-sm text-neutral-600 line-clamp-2">{follow.bio}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-neutral-50 rounded-lg">
                        <Users className="h-12 w-12 mx-auto text-neutral-300 mb-3" />
                        <h3 className="text-lg font-medium text-neutral-800 mb-2">Not Following Anyone</h3>
                        <p className="text-neutral-600">
                          {isOwnProfile ? "You're not following anyone yet." : `${profile.name} isn't following anyone yet.`}
                        </p>
                        {isOwnProfile && (
                          <Link to="/explore" className="mt-4 inline-block px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
                            Discover People
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;