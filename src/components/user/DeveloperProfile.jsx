// src/components/user/DeveloperProfile.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Settings, Calendar, MapPin, Link as LinkIcon, Twitter, 
  GitHub, Briefcase, Award, Coffee, Edit, UserPlus, UserMinus, 
  Code, BookOpen, Hash, Eye, BarChart2, Heart, Hexagon, ZapOff,
  Terminal, Cpu, Database, Server, Globe, Layers, Star
} from 'lucide-react';
import { followUser, unfollowUser } from '../../store/slices/userSlice';
import { useGetUserProfileQuery, useGetUserAnalyticsQuery } from '../../services/apiService';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

// Developer Profile with stats, activity visualization, and tech radar
const DeveloperProfile = ({ userId, compact = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { darkMode } = useSelector(state => state.ui);
  const { isAuthenticated, user: currentUser } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('posts');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showGitHubProjects, setShowGitHubProjects] = useState(false);
  
  // Fetch user profile data
  const { data: user, isLoading: isLoadingUser, error: userError } = useGetUserProfileQuery(userId);
  
  // Fetch user analytics data
  const { data: analytics, isLoading: isLoadingAnalytics } = useGetUserAnalyticsQuery(
    userId, 
    { skip: !userId || compact }
  );
  
  // Check if current user is following the profile user
  useEffect(() => {
    if (isAuthenticated && currentUser && user) {
      setIsFollowing(user.followers?.includes(currentUser.id));
    }
  }, [isAuthenticated, currentUser, user]);
  
  // Handle follow/unfollow
  const handleFollowToggle = () => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
    
    if (isFollowing) {
      dispatch(unfollowUser(userId));
      setIsFollowing(false);
    } else {
      dispatch(followUser(userId));
      setIsFollowing(true);
    }
  };
  
  // Format join date
  const formatJoinDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long'
    }).format(date);
  };
  
  // Generate tech radar data based on user's posts and contributions
  const techRadarData = useMemo(() => {
    if (!user || !user.skills) return [];
    
    // Map user skills to radar format
    return user.skills.map(skill => ({
      subject: skill.name,
      A: skill.level, // User's skill level (1-10)
      B: Math.min(Math.max(skill.level - 2 + Math.random() * 4, 1), 10), // Industry average (simulated)
      fullMark: 10,
    }));
  }, [user]);
  
  // Generate language usage data
  const languageData = useMemo(() => {
    if (!user || !user.languages) return [];
    
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
    
    return user.languages.map((lang, index) => ({
      name: lang.name,
      value: lang.percentage,
      color: COLORS[index % COLORS.length],
    }));
  }, [user]);
  
  // Generate activity data
  const activityData = useMemo(() => {
    if (!analytics || !analytics.activityHistory) return [];
    
    return analytics.activityHistory.map(item => ({
      date: item.date,
      posts: item.posts,
      comments: item.comments,
      contributions: item.contributions,
    }));
  }, [analytics]);
  
  // Calculate total stats
  const totalStats = useMemo(() => {
    if (!user) return { posts: 0, followers: 0, following: 0, views: 0 };
    
    return {
      posts: user.totalPosts || 0,
      followers: user.followers?.length || 0,
      following: user.following?.length || 0,
      views: user.totalViews || 0,
    };
  }, [user]);
  
  // Loading state
  if (isLoadingUser) {
    return (
      <div className="animate-pulse bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-16 w-16"></div>
          <div className="flex-1">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }
  
  // Error state
  if (userError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-lg">
        <h3 className="font-medium">Error loading profile</h3>
        <p className="text-sm mt-1">Please try again later</p>
      </div>
    );
  }
  
  if (!user) return null;
  
  // Compact view for sidebar or cards
  if (compact) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center">
            <Link to={`/profile/${user.id}`} className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <User size={18} />
                  </div>
                )}
              </div>
            </Link>
            <div className="ml-3">
              <Link 
                to={`/profile/${user.id}`}
                className="text-base font-medium text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary-light"
              >
                {user.name}
              </Link>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user.headline || 'Developer'}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3 pt-3 text-sm border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <BookOpen size={14} className="mr-1" />
              <span>{totalStats.posts} posts</span>
            </div>
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <User size={14} className="mr-1" />
              <span>{totalStats.followers} followers</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Full profile view
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Cover image */}
      <div className="relative h-32 md:h-48 bg-gradient-to-r from-primary/80 to-primary-dark/80">
        {user.coverImage && (
          <img 
            src={user.coverImage} 
            alt="" 
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Edit profile button (if it's the current user's profile) */}
        {isAuthenticated && currentUser?.id === user.id && (
          <Link
            to="/settings/profile"
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white py-1 px-3 rounded-full text-sm font-medium flex items-center transition-colors"
          >
            <Edit size={14} className="mr-1.5" />
            Edit Profile
          </Link>
        )}
      </div>
      
      {/* Profile header */}
      <div className="relative px-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-end -mt-16 sm:-mt-12 mb-4 sm:mb-6">
          {/* Avatar */}
          <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-900 bg-white dark:bg-gray-800 z-10">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400">
                <User size={40} />
              </div>
            )}
            
            {/* Badge for verified authors */}
            {user.verifiedAuthor && (
              <div className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full">
                <Award size={14} />
              </div>
            )}
          </div>
          
          {/* Profile info and stats */}
          <div className="mt-4 sm:mt-0 sm:ml-4 sm:flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {user.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">{user.headline || 'Developer'}</p>
              </div>
              
              {/* Follow/Message buttons */}
              <div className="mt-3 sm:mt-0 flex space-x-2">
                {isAuthenticated && currentUser?.id !== user.id && (
                  <button
                    onClick={handleFollowToggle}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center ${
                      isFollowing 
                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600' 
                        : 'bg-primary text-white hover:bg-primary-dark'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus size={14} className="mr-1.5" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus size={14} className="mr-1.5" />
                        Follow
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
            
            {/* Profile stats */}
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold text-gray-900 dark:text-white">{totalStats.posts}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Posts</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold text-gray-900 dark:text-white">{totalStats.followers}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Followers</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold text-gray-900 dark:text-white">{totalStats.following}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Following</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold text-gray-900 dark:text-white">{totalStats.views}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Views</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bio and details */}
        <div className="mt-4">
          <div className={`text-gray-700 dark:text-gray-300 text-sm ${!isExpanded && 'line-clamp-3'}`}>
            {user.bio || 'No bio available.'}
          </div>
          {user.bio && user.bio.length > 180 && (
            <button
              className="text-primary dark:text-primary-light text-sm font-medium mt-1"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
        
        {/* User details */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          {user.location && (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <MapPin size={16} className="mr-2 flex-shrink-0" />
              <span>{user.location}</span>
            </div>
          )}
          
          {user.company && (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Briefcase size={16} className="mr-2 flex-shrink-0" />
              <span>{user.company}</span>
            </div>
          )}
          
          {user.website && (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <LinkIcon size={16} className="mr-2 flex-shrink-0" />
              <a 
                href={user.website.startsWith('http') ? user.website : `https://${user.website}`} 
                target="_blank" 
                rel="noreferrer" 
                className="text-primary dark:text-primary-light hover:underline"
              >
                {user.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          
          {user.joinDate && (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Calendar size={16} className="mr-2 flex-shrink-0" />
              <span>Joined {formatJoinDate(user.joinDate)}</span>
            </div>
          )}
        </div>
        
        {/* Social links */}
        {(user.twitter || user.github) && (
          <div className="mt-4 flex space-x-2">
            {user.twitter && (
              <a
                href={`https://twitter.com/${user.twitter}`}
                target="_blank"
                rel="noreferrer"
                className="text-gray-600 hover:text-blue-400 dark:text-gray-400 dark:hover:text-blue-300"
              >
                <Twitter size={20} />
              </a>
            )}
            {user.github && (
              <a
                href={`https://github.com/${user.github}`}
                target="_blank"
                rel="noreferrer"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <GitHub size={20} />
              </a>
            )}
          </div>
        )}
      </div>
      
      {/* Tabs */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="flex overflow-x-auto">
          <button
            className={`px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'posts'
                ? 'border-primary text-primary dark:border-primary dark:text-primary-light'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
            onClick={() => setActiveTab('posts')}
          >
            <div className="flex items-center">
              <BookOpen size={16} className="mr-2" />
              Posts
            </div>
          </button>
          
          <button
            className={`px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'skills'
                ? 'border-primary text-primary dark:border-primary dark:text-primary-light'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
            onClick={() => setActiveTab('skills')}
          >
            <div className="flex items-center">
              <Code size={16} className="mr-2" />
              Skills
            </div>
          </button>
          
          <button
            className={`px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'activity'
                ? 'border-primary text-primary dark:border-primary dark:text-primary-light'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
            onClick={() => setActiveTab('activity')}
          >
            <div className="flex items-center">
              <BarChart2 size={16} className="mr-2" />
              Activity
            </div>
          </button>
          
          <button
            className={`px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'github'
                ? 'border-primary text-primary dark:border-primary dark:text-primary-light'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
            onClick={() => setActiveTab('github')}
          >
            <div className="flex items-center">
              <GitHub size={16} className="mr-2" />
              GitHub
            </div>
          </button>
        </div>
      </div>
      
      {/* Tab content */}
      <div className="p-6">
        {/* Posts tab */}
        {activeTab === 'posts' && (
          <div>
            {user.recentPosts && user.recentPosts.length > 0 ? (
              <div className="space-y-4">
                {user.recentPosts.map(post => (
                  <div 
                    key={post.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Link to={`/post/${post.id}`}>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar size={14} className="mr-1" />
                        <time dateTime={post.publishedAt}>
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </time>
                        <span className="mx-1">·</span>
                        <Clock size={14} className="mr-1" />
                        <span>{post.readTime} min read</span>
                        <span className="mx-1">·</span>
                        <Eye size={14} className="mr-1" />
                        <span>{post.views} views</span>
                      </div>
                    </Link>
                  </div>
                ))}
                
                <div className="text-center mt-6">
                  <Link
                    to={`/posts/author/${user.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
                  >
                    View all posts
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen size={36} className="mx-auto text-gray-400 mb-2" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No posts yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {currentUser?.id === user.id 
                    ? 'Start writing your first post now!'
                    : `${user.name} hasn't published any posts yet.`
                  }
                </p>
                
                {currentUser?.id === user.id && (
                  <Link
                    to="/new-story"
                    className="inline-flex items-center px-4 py-2 mt-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
                  >
                    <Edit size={16} className="mr-1.5" />
                    Write first post
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Skills tab */}
        {activeTab === 'skills' && (
          <div>
            <div className="flex flex-col md:flex-row md:space-x-6">
              {/* Language usage chart */}
              <div className="md:w-1/2 mb-6 md:mb-0">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Languages & Technologies
                </h3>
                
                {languageData.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={languageData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {languageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => `${value}%`}
                          contentStyle={{ 
                            backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                            borderColor: darkMode ? '#334155' : '#e2e8f0',
                            color: darkMode ? '#f8fafc' : '#0f172a',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
                    <Code size={24} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">No language data available</p>
                  </div>
                )}
              </div>
              
              {/* Technology radar */}
              <div className="md:w-1/2">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Skill Comparison
                </h3>
                
                {techRadarData.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart 
                        cx="50%" 
                        cy="50%" 
                        outerRadius={80} 
                        data={techRadarData}
                      >
                        <PolarGrid stroke={darkMode ? '#334155' : '#e2e8f0'} />
                        <PolarAngleAxis 
                          dataKey="subject"
                          tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 12 }}
                        />
                        <PolarRadiusAxis 
                          angle={90} 
                          domain={[0, 10]} 
                          tick={{ fill: darkMode ? '#94a3b8' : '#64748b' }}
                        />
                        <Radar
                          name={user.name}
                          dataKey="A"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.6}
                        />
                        <Radar
                          name="Industry Average"
                          dataKey="B"
                          stroke="#82ca9d"
                          fill="#82ca9d"
                          fillOpacity={0.6}
                        />
                        <Legend />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                            borderColor: darkMode ? '#334155' : '#e2e8f0',
                            color: darkMode ? '#f8fafc' : '#0f172a',
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
                    <Award size={24} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">No skill data available</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Skill badges section */}
            {user.skills && user.skills.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Technical Skills
                </h3>
                
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, index) => {
                    // Map skill to appropriate icon
                    const getSkillIcon = (skill) => {
                      const name = skill.name.toLowerCase();
                      if (name.includes('react') || name.includes('vue') || name.includes('angular')) return <Code />;
                      if (name.includes('node') || name.includes('express')) return <Server />;
                      if (name.includes('python') || name.includes('java') || name.includes('c++')) return <Terminal />;
                      if (name.includes('aws') || name.includes('cloud') || name.includes('azure')) return <Cloud />;
                      if (name.includes('sql') || name.includes('mongo') || name.includes('database')) return <Database />;
                      if (name.includes('machine') || name.includes('ai') || name.includes('ml')) return <Cpu />;
                      if (name.includes('web') || name.includes('frontend')) return <Globe />;
                      return <Hexagon />;
                    };
                    
                    const SkillIcon = () => getSkillIcon(skill);
                    
                    return (
                      <div 
                        key={index}
                        className="inline-flex items-center px-3 py-1.5 rounded-full bg-primary/10 dark:bg-primary-dark/20 text-primary dark:text-primary-light text-sm"
                      >
                        <span className="mr-1.5">
                          <SkillIcon size={14} />
                        </span>
                        <span>{skill.name}</span>
                        
                        {/* Skill level indicator */}
                        <div className="ml-2 w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary dark:bg-primary-light" 
                            style={{ width: `${skill.level * 10}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Activity tab */}
        {activeTab === 'activity' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Activity Overview
            </h3>
            
            {isLoadingAnalytics ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : activityData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={activityData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
                    <XAxis 
                      dataKey="date" 
                      stroke={darkMode ? '#94a3b8' : '#64748b'}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                      }}
                    />
                    <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
                    <Tooltip 
                      labelFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
                      }}
                      contentStyle={{ 
                        backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                        borderColor: darkMode ? '#334155' : '#e2e8f0',
                        color: darkMode ? '#f8fafc' : '#0f172a',
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="posts"
                      stackId="1"
                      stroke="#8884d8"
                      fill="#8884d8"
                    />
                    <Area
                      type="monotone"
                      dataKey="comments"
                      stackId="1"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                    />
                    <Area
                      type="monotone"
                      dataKey="contributions"
                      stackId="1"
                      stroke="#ffc658"
                      fill="#ffc658"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
                <ZapOff size={24} className="text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">No activity data available</p>
              </div>
            )}
            
            {/* Activity highlights */}
            {analytics && analytics.highlights && (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Streak
                    </h4>
                    <div className="text-primary dark:text-primary-light">
                      <Coffee size={18} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics.highlights.streak} days
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Current posting streak
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Best Post
                    </h4>
                    <div className="text-primary dark:text-primary-light">
                      <Star size={18} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics.highlights.bestPost?.views} views
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                    {analytics.highlights.bestPost?.title || 'No posts yet'}
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Engagement
                    </h4>
                    <div className="text-primary dark:text-primary-light">
                      <Heart size={18} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics.highlights.engagementRate || 0}%
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Average engagement rate
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Topics
                    </h4>
                    <div className="text-primary dark:text-primary-light">
                      <Hash size={18} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics.highlights.topTopics?.length || 0}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Popular topics covered
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* GitHub tab */}
        {activeTab === 'github' && (
          <div>
            {user.github ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    GitHub Projects
                  </h3>
                  
                  <a
                    href={`https://github.com/${user.github}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-primary dark:text-primary-light hover:underline flex items-center"
                  >
                    <span>View Profile</span>
                    <ExternalLink size={14} className="ml-1" />
                  </a>
                </div>
                
                {/* GitHub stats summary */}
                {user.githubStats && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Repositories
                        </h4>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {user.githubStats.repositories || 0}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Stars
                        </h4>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {user.githubStats.stars || 0}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Followers
                        </h4>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {user.githubStats.followers || 0}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Contributions
                        </h4>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {user.githubStats.contributions || 0}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Toggle for GitHub projects */}
                <div className="flex justify-center mb-6">
                  <button
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      showGitHubProjects ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                    onClick={() => setShowGitHubProjects(!showGitHubProjects)}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        showGitHubProjects ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                    <span className="sr-only">Show GitHub projects</span>
                  </button>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {showGitHubProjects ? 'Hide projects' : 'Show projects'}
                  </span>
                </div>
                
                {/* GitHub projects */}
                {showGitHubProjects && user.githubProjects && user.githubProjects.length > 0 ? (
                  <div className="space-y-4">
                    {user.githubProjects.map((project, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-lg font-medium text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary-light"
                            >
                              {project.name}
                            </a>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                              {project.description}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center text-gray-500 dark:text-gray-400">
                              <Star size={14} className="mr-1" />
                              <span>{project.stars}</span>
                            </div>
                            <div className="flex items-center text-gray-500 dark:text-gray-400">
                              <GitPullRequest size={14} className="mr-1" />
                              <span>{project.forks}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Language stats */}
                        {project.languages && (
                          <div className="mt-3 flex items-center">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                              Languages:
                            </div>
                            <div className="flex">
                              {Object.entries(project.languages).map(([lang, percentage], i) => (
                                <div key={i} className="flex items-center mr-2">
                                  <div 
                                    className="w-2 h-2 rounded-full mr-1"
                                    style={{ 
                                      backgroundColor: getLanguageColor(lang)
                                    }}
                                  ></div>
                                  <span className="text-xs">{lang}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    <div className="text-center mt-4">
                      <a
                        href={`https://github.com/${user.github}?tab=repositories`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-sm text-primary dark:text-primary-light hover:underline"
                      >
                        <span>View all repositories</span>
                        <ExternalLink size={14} className="ml-1" />
                      </a>
                    </div>
                  </div>
                ) : showGitHubProjects ? (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
                    <GitHub size={24} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">No GitHub projects available</p>
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
                    <GitHub size={24} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">Toggle to view GitHub projects</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <GitHub size={36} className="mx-auto text-gray-400 mb-2" />
                {currentUser?.id === user.id ? (
                  <>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Connect your GitHub profile
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                      Link your GitHub account to showcase your projects.
                    </p>
                    <Link
                      to="/settings/integrations"
                      className="inline-flex items-center px-4 py-2 mt-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
                    >
                      <GitHub size={16} className="mr-1.5" />
                      Connect GitHub
                    </Link>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      No GitHub profile connected
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                      {user.name} hasn't connected a GitHub account yet.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to get language color
const getLanguageColor = (language) => {
  const colors = {
    JavaScript: '#f1e05a',
    TypeScript: '#2b7489',
    Python: '#3572A5',
    Java: '#b07219',
    Go: '#00ADD8',
    Ruby: '#701516',
    PHP: '#4F5D95',
    C: '#555555',
    'C++': '#f34b7d',
    'C#': '#178600',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Shell: '#89e051',
  };
  
  return colors[language] || '#8257e5';
};

// Cloud icon component
const Cloud = ({ size = 24, className = '' }) => (
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
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
  </svg>
);

export default DeveloperProfile;