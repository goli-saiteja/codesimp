import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  BarChart2, TrendingUp, Eye, Heart, MessageSquare, 
  Users, Clock, Calendar, ChevronDown, Download,
  RefreshCw, Filter, HelpCircle, Settings, Zap,
  Share2, FileText, Code, Check, ExternalLink, Info,
  ArrowRight, ArrowUp, ArrowDown, Bookmark
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, PieChart, Pie, Cell } from 'recharts';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, 
  isSameDay, parseISO, startOfDay, endOfDay } from 'date-fns';

const AnalyticsDashboardPage = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  
  // State for date range
  const [dateRange, setDateRange] = useState('last7Days');
  const [startDate, setStartDate] = useState(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState(new Date());
  const [customDateRange, setCustomDateRange] = useState(false);
  
  // State for analytics data
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewsData, setViewsData] = useState([]);
  const [likesData, setLikesData] = useState([]);
  const [commentsData, setCommentsData] = useState([]);
  const [topArticles, setTopArticles] = useState([]);
  const [topTags, setTopTags] = useState([]);
  const [referrers, setReferrers] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [growthData, setGrowthData] = useState({});
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('overview');
  
  // Fetch analytics data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, this would be API calls
        // Simulate fetching data with a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock data based on date range
        generateMockData();
        
        setIsLoading(false);
      } catch (error) {
        setError('Failed to load analytics data. Please try again later.');
        setIsLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, [startDate, endDate]);
  
  // Generate mock data for demo
  const generateMockData = () => {
    // Generate date range
    const dates = eachDayOfInterval({ start: startDate, end: endDate });
    
    // Generate views data
    const views = dates.map(date => {
      // Higher views for more recent days with some randomness
      const daysDiff = Math.abs(Math.floor((new Date() - date) / (1000 * 60 * 60 * 24)));
      const baseViews = Math.max(50, 200 - (daysDiff * 10));
      const randomFactor = Math.random() * 0.5 + 0.75; // 0.75 to 1.25
      
      return {
        date: format(date, 'yyyy-MM-dd'),
        views: Math.floor(baseViews * randomFactor),
      };
    });
    
    setViewsData(views);
    
    // Generate likes data
    const likes = dates.map(date => {
      // About 5-10% of views become likes
      const matchingViewData = views.find(v => v.date === format(date, 'yyyy-MM-dd'));
      const likeRate = Math.random() * 0.05 + 0.05; // 5% to 10%
      
      return {
        date: format(date, 'yyyy-MM-dd'),
        likes: Math.floor((matchingViewData?.views || 100) * likeRate),
      };
    });
    
    setLikesData(likes);
    
    // Generate comments data
    const comments = dates.map(date => {
      // About 1-3% of views become comments
      const matchingViewData = views.find(v => v.date === format(date, 'yyyy-MM-dd'));
      const commentRate = Math.random() * 0.02 + 0.01; // 1% to 3%
      
      return {
        date: format(date, 'yyyy-MM-dd'),
        comments: Math.floor((matchingViewData?.views || 100) * commentRate),
      };
    });
    
    setCommentsData(comments);
    
    // Generate top articles
    const articles = [
      {
        id: 1,
        title: 'Building Scalable React Applications with Redux Toolkit',
        views: 1248,
        likes: 132,
        comments: 24,
        publishedAt: '2023-05-15T10:30:00Z',
        trend: 'up'
      },
      {
        id: 2,
        title: 'Advanced TypeScript Patterns for Frontend Developers',
        views: 876,
        likes: 98,
        comments: 16,
        publishedAt: '2023-05-12T14:45:00Z',
        trend: 'up'
      },
      {
        id: 3,
        title: 'Microservices Architecture with Node.js and Docker',
        views: 654,
        likes: 72,
        comments: 11,
        publishedAt: '2023-05-10T09:15:00Z',
        trend: 'down'
      },
      {
        id: 4,
        title: 'CSS Grid vs Flexbox: When to Use Each Layout System',
        views: 523,
        likes: 45,
        comments: 8,
        publishedAt: '2023-05-08T16:20:00Z',
        trend: 'up'
      },
      {
        id: 5,
        title: 'Building a Real-time Chat Application with Socket.io',
        views: 487,
        likes: 67,
        comments: 14,
        publishedAt: '2023-05-06T11:30:00Z',
        trend: 'down'
      }
    ];
    
    setTopArticles(articles);
    
    // Generate top tags
    const tags = [
      { name: 'React', count: 12, views: 3876 },
      { name: 'JavaScript', count: 9, views: 2987 },
      { name: 'TypeScript', count: 7, views: 2456 },
      { name: 'Node.js', count: 5, views: 1879 },
      { name: 'CSS', count: 4, views: 1245 }
    ];
    
    setTopTags(tags);
    
    // Generate referrer data
    const referrerData = [
      { name: 'Google', value: 35 },
      { name: 'Twitter', value: 25 },
      { name: 'GitHub', value: 15 },
      { name: 'LinkedIn', value: 12 },
      { name: 'Direct', value: 8 },
      { name: 'Other', value: 5 }
    ];
    
    setReferrers(referrerData);
    
    // Generate device data
    const devices = [
      { name: 'Desktop', value: 65 },
      { name: 'Mobile', value: 30 },
      { name: 'Tablet', value: 5 }
    ];
    
    setDeviceData(devices);
    
    // Calculate growth metrics
    const totalViews = views.reduce((sum, item) => sum + item.views, 0);
    const totalLikes = likes.reduce((sum, item) => sum + item.likes, 0);
    const totalComments = comments.reduce((sum, item) => sum + item.comments, 0);
    
    // Calculate previous period for comparison
    const daysDiff = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
    const prevStartDate = subDays(startDate, daysDiff);
    const prevEndDate = subDays(startDate, 1);
    
    // Generate mock previous period data
    const prevViews = Math.floor(totalViews * (Math.random() * 0.4 + 0.8)); // 80% to 120% of current
    const prevLikes = Math.floor(totalLikes * (Math.random() * 0.4 + 0.8));
    const prevComments = Math.floor(totalComments * (Math.random() * 0.4 + 0.8));
    
    // Calculate growth percentages
    const viewsGrowth = prevViews ? ((totalViews - prevViews) / prevViews) * 100 : 100;
    const likesGrowth = prevLikes ? ((totalLikes - prevLikes) / prevLikes) * 100 : 100;
    const commentsGrowth = prevComments ? ((totalComments - prevComments) / prevComments) * 100 : 100;
    
    setGrowthData({
      views: {
        current: totalViews,
        previous: prevViews,
        growth: viewsGrowth,
      },
      likes: {
        current: totalLikes,
        previous: prevLikes,
        growth: likesGrowth,
      },
      comments: {
        current: totalComments,
        previous: prevComments,
        growth: commentsGrowth,
      },
      followers: {
        current: 1248,
        previous: 1156,
        growth: 7.96,
      }
    });
  };
  
  // Handle date range change
  const handleDateRangeChange = (range) => {
    setCustomDateRange(false);
    setDateRange(range);
    
    const today = new Date();
    
    switch (range) {
      case 'today':
        setStartDate(startOfDay(today));
        setEndDate(endOfDay(today));
        break;
      case 'yesterday':
        const yesterday = subDays(today, 1);
        setStartDate(startOfDay(yesterday));
        setEndDate(endOfDay(yesterday));
        break;
      case 'last7Days':
        setStartDate(subDays(today, 6));
        setEndDate(today);
        break;
      case 'last30Days':
        setStartDate(subDays(today, 29));
        setEndDate(today);
        break;
      case 'thisMonth':
        setStartDate(startOfMonth(today));
        setEndDate(today);
        break;
      case 'lastMonth':
        const lastMonth = subDays(startOfMonth(today), 1);
        setStartDate(startOfMonth(lastMonth));
        setEndDate(endOfMonth(lastMonth));
        break;
      default:
        setStartDate(subDays(today, 6));
        setEndDate(today);
    }
  };
  
  // Format date for display
  const formatDateForDisplay = (date) => {
    return format(date, 'MMM d, yyyy');
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
  
  // Generate colors for charts
  const COLORS = ['#4149eb', '#22c973', '#f83b3b', '#faa700', '#61809f', '#8816a0'];
  
  // Format date for chart tooltip
  const formatTooltipDate = (dateStr) => {
    const date = new Date(dateStr);
    return format(date, 'MMM d, yyyy');
  };
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-neutral-200 rounded-md shadow-sm">
          <p className="text-sm font-medium text-neutral-900 mb-1">{formatTooltipDate(label)}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    
    return null;
  };
  
  // Generate chart data with all metrics
  const getChartData = () => {
    // Combine views, likes, comments into single array for chart
    return viewsData.map(viewItem => {
      const likeItem = likesData.find(l => l.date === viewItem.date) || { likes: 0 };
      const commentItem = commentsData.find(c => c.date === viewItem.date) || { comments: 0 };
      
      return {
        date: viewItem.date,
        views: viewItem.views,
        likes: likeItem.likes,
        comments: commentItem.comments
      };
    });
  };
  
  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Analytics Dashboard</h1>
              <p className="mt-1 text-sm text-neutral-500">
                Track your content performance and audience insights
              </p>
            </div>
            
            {/* Date range picker */}
            <div className="mt-4 sm:mt-0 flex items-center space-x-2">
              <div className="relative">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                  onClick={() => setCustomDateRange(!customDateRange)}
                >
                  <Calendar className="h-4 w-4 mr-2 text-neutral-500" />
                  {dateRange === 'custom' 
                    ? `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(endDate)}`
                    : dateRange === 'today' 
                      ? 'Today'
                      : dateRange === 'yesterday'
                        ? 'Yesterday'
                        : dateRange === 'last7Days'
                          ? 'Last 7 days'
                          : dateRange === 'last30Days'
                            ? 'Last 30 days'
                            : dateRange === 'thisMonth'
                              ? 'This month'
                              : 'Last month'
                  }
                  <ChevronDown className="h-4 w-4 ml-2" />
                </button>
                
                {customDateRange && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 p-4 border border-neutral-200">
                    <div className="space-y-2">
                      {[
                        { id: 'today', label: 'Today' },
                        { id: 'yesterday', label: 'Yesterday' },
                        { id: 'last7Days', label: 'Last 7 days' },
                        { id: 'last30Days', label: 'Last 30 days' },
                        { id: 'thisMonth', label: 'This month' },
                        { id: 'lastMonth', label: 'Last month' },
                      ].map((option) => (
                        <div key={option.id} className="flex items-center">
                          <input
                            id={option.id}
                            name="date-range"
                            type="radio"
                            checked={dateRange === option.id}
                            onChange={() => handleDateRangeChange(option.id)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300"
                          />
                          <label htmlFor={option.id} className="ml-3 block text-sm text-neutral-700">
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-neutral-200">
                      <div className="flex space-x-2">
                        <div>
                          <label htmlFor="start-date" className="block text-xs font-medium text-neutral-700">
                            Start Date
                          </label>
                          <input
                            type="date"
                            id="start-date"
                            name="start-date"
                            className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            value={format(startDate, 'yyyy-MM-dd')}
                            onChange={(e) => {
                              setDateRange('custom');
                              setStartDate(new Date(e.target.value));
                            }}
                            max={format(endDate, 'yyyy-MM-dd')}
                          />
                        </div>
                        <div>
                          <label htmlFor="end-date" className="block text-xs font-medium text-neutral-700">
                            End Date
                          </label>
                          <input
                            type="date"
                            id="end-date"
                            name="end-date"
                            className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            value={format(endDate, 'yyyy-MM-dd')}
                            onChange={(e) => {
                              setDateRange('custom');
                              setEndDate(new Date(e.target.value));
                            }}
                            min={format(startDate, 'yyyy-MM-dd')}
                            max={format(new Date(), 'yyyy-MM-dd')}
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          className="px-3 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700"
                          onClick={() => setCustomDateRange(false)}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                type="button"
                className="p-2 rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-white"
                onClick={() => {
                  // Reload data
                  setIsLoading(true);
                  setTimeout(() => {
                    generateMockData();
                    setIsLoading(false);
                  }, 800);
                }}
                title="Refresh data"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
              
              <button
                type="button"
                className="p-2 rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-white"
                title="Export data"
              >
                <Download className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="mt-6 border-b border-neutral-200">
            <nav className="flex space-x-8">
              <button
                className={`py-4 px-1 flex items-center text-sm font-medium border-b-2 ${
                  activeTab === 'overview'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                <BarChart2 className="h-4 w-4 mr-2" />
                Overview
              </button>
              
              <button
                className={`py-4 px-1 flex items-center text-sm font-medium border-b-2 ${
                  activeTab === 'content'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
                }`}
                onClick={() => setActiveTab('content')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Content
              </button>
              
              <button
                className={`py-4 px-1 flex items-center text-sm font-medium border-b-2 ${
                  activeTab === 'audience'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
                }`}
                onClick={() => setActiveTab('audience')}
              >
                <Users className="h-4 w-4 mr-2" />
                Audience
              </button>
              
              <button
                className={`py-4 px-1 flex items-center text-sm font-medium border-b-2 ${
                  activeTab === 'engagement'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
                }`}
                onClick={() => setActiveTab('engagement')}
              >
                <Heart className="h-4 w-4 mr-2" />
                Engagement
              </button>
            </nav>
          </div>
        </div>
        
        {isLoading ? (
          // Loading state
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-soft border border-neutral-200 p-6 animate-pulse">
                <div className="h-4 bg-neutral-200 rounded w-1/4 mb-4"></div>
                <div className="h-8 bg-neutral-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
              </div>
            ))}
            <div className="md:col-span-2 lg:col-span-4 bg-white rounded-lg shadow-soft border border-neutral-200 p-6 animate-pulse">
              <div className="h-4 bg-neutral-200 rounded w-1/4 mb-8"></div>
              <div className="h-64 bg-neutral-200 rounded"></div>
            </div>
          </div>
        ) : error ? (
          // Error state
          <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md">
            <p className="font-medium flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </p>
          </div>
        ) : (
          // Content based on active tab
          <>
            {activeTab === 'overview' && (
              <>
                {/* Stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {/* Views card */}
                  <div className="bg-white rounded-lg shadow-soft border border-neutral-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm font-medium text-neutral-500">
                        <Eye className="h-4 w-4 mr-1.5" />
                        Views
                      </div>
                      <div className={`flex items-center text-xs font-medium px-2 py-0.5 rounded ${
                        growthData.views?.growth >= 0
                          ? 'bg-success-100 text-success-800'
                          : 'bg-error-100 text-error-800'
                      }`}>
                        {growthData.views?.growth >= 0 ? (
                          <ArrowUp className="h-3 w-3 mr-0.5" />
                        ) : (
                          <ArrowDown className="h-3 w-3 mr-0.5" />
                        )}
                        {Math.abs(growthData.views?.growth || 0).toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-neutral-900 mb-1">
                      {formatNumber(growthData.views?.current || 0)}
                    </div>
                    <div className="text-sm text-neutral-500">
                      vs. {formatNumber(growthData.views?.previous || 0)} previous period
                    </div>
                  </div>
                  
                  {/* Likes card */}
                  <div className="bg-white rounded-lg shadow-soft border border-neutral-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm font-medium text-neutral-500">
                        <Heart className="h-4 w-4 mr-1.5" />
                        Likes
                      </div>
                      <div className={`flex items-center text-xs font-medium px-2 py-0.5 rounded ${
                        growthData.likes?.growth >= 0
                          ? 'bg-success-100 text-success-800'
                          : 'bg-error-100 text-error-800'
                      }`}>
                        {growthData.likes?.growth >= 0 ? (
                          <ArrowUp className="h-3 w-3 mr-0.5" />
                        ) : (
                          <ArrowDown className="h-3 w-3 mr-0.5" />
                        )}
                        {Math.abs(growthData.likes?.growth || 0).toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-neutral-900 mb-1">
                      {formatNumber(growthData.likes?.current || 0)}
                    </div>
                    <div className="text-sm text-neutral-500">
                      vs. {formatNumber(growthData.likes?.previous || 0)} previous period
                    </div>
                  </div>
                  
                  {/* Comments card */}
                  <div className="bg-white rounded-lg shadow-soft border border-neutral-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm font-medium text-neutral-500">
                        <MessageSquare className="h-4 w-4 mr-1.5" />
                        Comments
                      </div>
                      <div className={`flex items-center text-xs font-medium px-2 py-0.5 rounded ${
                        growthData.comments?.growth >= 0
                          ? 'bg-success-100 text-success-800'
                          : 'bg-error-100 text-error-800'
                      }`}>
                        {growthData.comments?.growth >= 0 ? (
                          <ArrowUp className="h-3 w-3 mr-0.5" />
                        ) : (
                          <ArrowDown className="h-3 w-3 mr-0.5" />
                        )}
                        {Math.abs(growthData.comments?.growth || 0).toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-neutral-900 mb-1">
                      {formatNumber(growthData.comments?.current || 0)}
                    </div>
                    <div className="text-sm text-neutral-500">
                      vs. {formatNumber(growthData.comments?.previous || 0)} previous period
                    </div>
                  </div>
                  
                  {/* Followers card */}
                  <div className="bg-white rounded-lg shadow-soft border border-neutral-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm font-medium text-neutral-500">
                        <Users className="h-4 w-4 mr-1.5" />
                        Followers
                      </div>
                      <div className={`flex items-center text-xs font-medium px-2 py-0.5 rounded ${
                        growthData.followers?.growth >= 0
                          ? 'bg-success-100 text-success-800'
                          : 'bg-error-100 text-error-800'
                      }`}>
                        {growthData.followers?.growth >= 0 ? (
                          <ArrowUp className="h-3 w-3 mr-0.5" />
                        ) : (
                          <ArrowDown className="h-3 w-3 mr-0.5" />
                        )}
                        {Math.abs(growthData.followers?.growth || 0).toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-neutral-900 mb-1">
                      {formatNumber(growthData.followers?.current || 0)}
                    </div>
                    <div className="text-sm text-neutral-500">
                      vs. {formatNumber(growthData.followers?.previous || 0)} previous period
                    </div>
                  </div>
                </div>
                
                {/* Main chart */}
                <div className="bg-white rounded-lg shadow-soft border border-neutral-200 p-6 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-neutral-900">Performance Overview</h3>
                    <div className="flex items-center">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <div className="h-3 w-3 bg-primary-500 rounded-full mr-1"></div>
                          <span className="text-xs text-neutral-600">Views</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-3 w-3 bg-success-500 rounded-full mr-1"></div>
                          <span className="text-xs text-neutral-600">Likes</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-3 w-3 bg-warning-500 rounded-full mr-1"></div>
                          <span className="text-xs text-neutral-600">Comments</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={getChartData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => format(new Date(date), 'MMM d')}
                        />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="views" 
                          name="Views"
                          stroke="#4149eb" 
                          activeDot={{ r: 8 }} 
                          strokeWidth={2}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="likes" 
                          name="Likes"
                          stroke="#22c973" 
                          strokeWidth={2}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="comments" 
                          name="Comments"
                          stroke="#faa700" 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Two column section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Top articles */}
                  <div className="bg-white rounded-lg shadow-soft border border-neutral-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-neutral-900">Top Articles</h3>
                      <Link to="/dashboard/content" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center">
                        View all
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                    
                    <div className="space-y-4">
                      {topArticles.map((article) => (
                        <div key={article.id} className="flex items-start">
                          <div className="min-w-0 flex-1">
                            <Link to={`/article/${article.id}`} className="text-sm font-medium text-neutral-900 hover:text-primary-600 line-clamp-2">
                              {article.title}
                            </Link>
                            <div className="flex items-center mt-1 space-x-3 text-xs text-neutral-500">
                              <div className="flex items-center">
                                <Eye className="h-3.5 w-3.5 mr-1" />
                                {formatNumber(article.views)}
                              </div>
                              <div className="flex items-center">
                                <Heart className="h-3.5 w-3.5 mr-1" />
                                {formatNumber(article.likes)}
                              </div>
                              <div className="flex items-center">
                                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                                {formatNumber(article.comments)}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-3.5 w-3.5 mr-1" />
                                {format(new Date(article.publishedAt), 'MMM d, yyyy')}
                              </div>
                            </div>
                          </div>
                          <div className={`ml-3 flex-shrink-0 flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            article.trend === 'up'
                              ? 'bg-success-100 text-success-800'
                              : 'bg-error-100 text-error-800'
                          }`}>
                            {article.trend === 'up' ? (
                              <ArrowUp className="h-3 w-3 mr-0.5" />
                            ) : (
                              <ArrowDown className="h-3 w-3 mr-0.5" />
                            )}
                            {article.trend === 'up' ? '+' : '-'}
                            {Math.floor(Math.random() * 20 + 5)}%
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-neutral-200">
                      <Link to="/editor" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center">
                        <PenTool className="h-4 w-4 mr-1.5" />
                        Write a new article
                      </Link>
                    </div>
                  </div>
                  
                  {/* Tag performance & Referrers */}
                  <div className="space-y-8">
                    {/* Tag performance */}
                    <div className="bg-white rounded-lg shadow-soft border border-neutral-200 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-neutral-900">Tag Performance</h3>
                        <Link to="/dashboard/tags" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center">
                          View all
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      </div>
                      
                      <div className="space-y-3">
                        {topTags.map((tag, index) => (
                          <div key={tag.name} className="flex items-center">
                            <div className="w-24 flex-shrink-0">
                              <Link to={`/tag/${tag.name.toLowerCase()}`} className="text-sm font-medium text-neutral-900 hover:text-primary-600">
                                #{tag.name}
                              </Link>
                            </div>
                            <div className="flex-grow mx-4">
                              <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full rounded-full" 
                                  style={{ 
                                    width: `${(tag.views / topTags[0].views) * 100}%`,
                                    backgroundColor: COLORS[index % COLORS.length] 
                                  }}
                                ></div>
                              </div>
                            </div>
                            <div className="text-sm text-neutral-700 flex-shrink-0">
                              {formatNumber(tag.views)} views
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Referrers */}
                    <div className="bg-white rounded-lg shadow-soft border border-neutral-200 p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-neutral-900">Traffic Sources</h3>
                        <div className="flex items-center text-sm text-neutral-500">
                          <Info className="h-4 w-4 mr-1" />
                          <span>Top referrers</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={referrers}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {referrers.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <div className="flex flex-col justify-center">
                          <ul className="space-y-2">
                            {referrers.map((referrer, index) => (
                              <li key={referrer.name} className="flex items-center text-sm">
                                <div 
                                  className="h-3 w-3 rounded-full mr-2" 
                                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                ></div>
                                <span className="font-medium text-neutral-700">{referrer.name}:</span>
                                <span className="ml-1 text-neutral-500">{referrer.value}%</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Insights */}
                <div className="bg-white rounded-lg shadow-soft border border-neutral-200 p-6 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-neutral-900">Content Insights</h3>
                    <div className="flex items-center text-sm text-neutral-500">
                      <Info className="h-4 w-4 mr-1" />
                      <span>Based on your recent performance</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-primary-50 rounded-lg p-4 border border-primary-100">
                      <div className="flex items-center mb-2">
                        <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mr-3">
                          <TrendingUp className="h-5 w-5" />
                        </div>
                        <h4 className="text-sm font-semibold text-primary-900">
                          Growing Interest
                        </h4>
                      </div>
                      <p className="text-sm text-primary-800">
                        Your React articles are gaining traction. Consider creating more content on this topic for higher engagement.
                      </p>
                    </div>
                    
                    <div className="bg-success-50 rounded-lg p-4 border border-success-100">
                      <div className="flex items-center mb-2">
                        <div className="h-8 w-8 bg-success-100 rounded-full flex items-center justify-center text-success-600 mr-3">
                          <Clock className="h-5 w-5" />
                        </div>
                        <h4 className="text-sm font-semibold text-success-900">
                          Optimal Length
                        </h4>
                      </div>
                      <p className="text-sm text-success-800">
                        Articles with 8-12 minute read times receive 30% more engagement than shorter or longer pieces.
                      </p>
                    </div>
                    
                    <div className="bg-warning-50 rounded-lg p-4 border border-warning-100">
                      <div className="flex items-center mb-2">
                        <div className="h-8 w-8 bg-warning-100 rounded-full flex items-center justify-center text-warning-600 mr-3">
                          <Zap className="h-5 w-5" />
                        </div>
                        <h4 className="text-sm font-semibold text-warning-900">
                          Engagement Opportunity
                        </h4>
                      </div>
                      <p className="text-sm text-warning-800">
                        Responding to comments within 24 hours increases follower retention by 40%. You have 5 unresponded comments.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {activeTab === 'content' && (
              <div className="space-y-8">
                <div className="bg-white rounded-lg shadow-soft border border-neutral-200 p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Content Performance</h3>
                  <p className="text-neutral-600 mb-6">Detailed analytics about your articles, code playgrounds, and other content.</p>
                  
                  <div className="border rounded-lg divide-y divide-neutral-200">
                    <div className="px-6 py-4 bg-neutral-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-8">
                            <input type="checkbox" className="form-checkbox" />
                          </div>
                          <div className="text-sm font-medium text-neutral-500">Title</div>
                        </div>
                        <div className="flex items-center space-x-8">
                          <div className="text-sm font-medium text-neutral-500">Views</div>
                          <div className="text-sm font-medium text-neutral-500">Likes</div>
                          <div className="text-sm font-medium text-neutral-500">Comments</div>
                          <div className="text-sm font-medium text-neutral-500">Published</div>
                          <div className="w-8"></div>
                        </div>
                      </div>
                    </div>
                    
                    {topArticles.map((article) => (
                      <div key={article.id} className="px-6 py-4 hover:bg-neutral-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className="flex-shrink-0 w-8">
                              <input type="checkbox" className="form-checkbox" />
                            </div>
                            <div className="min-w-0">
                              <Link to={`/article/${article.id}`} className="text-sm font-medium text-neutral-900 hover:text-primary-600 truncate block">
                                {article.title}
                              </Link>
                              <div className="text-xs text-neutral-500 flex items-center mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                {Math.floor(Math.random() * 10 + 5)} min read
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-8">
                            <div className="text-sm text-neutral-700 w-16 text-right">
                              {formatNumber(article.views)}
                            </div>
                            <div className="text-sm text-neutral-700 w-16 text-right">
                              {formatNumber(article.likes)}
                            </div>
                            <div className="text-sm text-neutral-700 w-16 text-right">
                              {formatNumber(article.comments)}
                            </div>
                            <div className="text-sm text-neutral-500 w-24 text-right">
                              {format(new Date(article.publishedAt), 'MMM d, yyyy')}
                            </div>
                            <div className="w-8 flex justify-end">
                              <button className="text-neutral-400 hover:text-neutral-600">
                                <MoreHorizontal className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'audience' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Devices */}
                  <div className="bg-white rounded-lg shadow-soft border border-neutral-200 p-6">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-6">Device Breakdown</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={deviceData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {deviceData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="flex flex-col justify-center">
                        <ul className="space-y-2">
                          {deviceData.map((device, index) => (
                            <li key={device.name} className="flex items-center text-sm">
                              <div 
                                className="h-3 w-3 rounded-full mr-2" 
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              ></div>
                              <span className="font-medium text-neutral-700">{device.name}:</span>
                              <span className="ml-1 text-neutral-500">{device.value}%</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Geographical distribution */}
                  <div className="bg-white rounded-lg shadow-soft border border-neutral-200 p-6">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-6">Geographical Distribution</h3>
                    
                    <div className="space-y-3">
                      {[
                        { country: 'United States', percentage: 42 },
                        { country: 'India', percentage: 18 },
                        { country: 'United Kingdom', percentage: 12 },
                        { country: 'Germany', percentage: 8 },
                        { country: 'Canada', percentage: 6 },
                        { country: 'Others', percentage: 14 }
                      ].map((item, index) => (
                        <div key={item.country} className="flex items-center">
                          <div className="w-32 flex-shrink-0">
                            <span className="text-sm font-medium text-neutral-700">{item.country}</span>
                          </div>
                          <div className="flex-grow mx-4">
                            <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full" 
                                style={{ 
                                  width: `${item.percentage}%`,
                                  backgroundColor: COLORS[index % COLORS.length] 
                                }}
                              ></div>
                            </div>
                          </div>
                          <div className="text-sm text-neutral-700 flex-shrink-0 w-12 text-right">
                            {item.percentage}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Followers growth */}
                <div className="bg-white rounded-lg shadow-soft border border-neutral-200 p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-6">Follower Growth</h3>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={[
                          { date: '2023-01-01', followers: 985 },
                          { date: '2023-02-01', followers: 1025 },
                          { date: '2023-03-01', followers: 1078 },
                          { date: '2023-04-01', followers: 1156 },
                          { date: '2023-05-01', followers: 1248 }
                        ]}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => format(new Date(date), 'MMM yyyy')}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [formatNumber(value), 'Followers']}
                          labelFormatter={(label) => format(new Date(label), 'MMMM yyyy')}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="followers" 
                          stroke="#4149eb" 
                          fill="#4149eb" 
                          fillOpacity={0.2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'engagement' && (
              <div className="space-y-8">
                {/* Engagement metrics */}
                <div className="bg-white rounded-lg shadow-soft border border-neutral-200 p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-6">Engagement Metrics</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200 flex flex-col items-center">
                      <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-3">
                        <Heart className="h-6 w-6" />
                      </div>
                      <div className="text-2xl font-bold text-neutral-900 mb-1">
                        {(growthData.likes?.current / growthData.views?.current * 100).toFixed(2)}%
                      </div>
                      <div className="text-sm text-neutral-600 text-center">
                        Like-to-View Ratio
                      </div>
                    </div>
                    
                    <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200 flex flex-col items-center">
                      <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-3">
                        <MessageSquare className="h-6 w-6" />
                      </div>
                      <div className="text-2xl font-bold text-neutral-900 mb-1">
                        {(growthData.comments?.current / growthData.views?.current * 100).toFixed(2)}%
                      </div>
                      <div className="text-sm text-neutral-600 text-center">
                        Comment-to-View Ratio
                      </div>
                    </div>
                    
                    <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200 flex flex-col items-center">
                      <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-3">
                        <Bookmark className="h-6 w-6" />
                      </div>
                      <div className="text-2xl font-bold text-neutral-900 mb-1">
                        {(Math.random() * 5 + 2).toFixed(2)}%
                      </div>
                      <div className="text-sm text-neutral-600 text-center">
                        Save-to-View Ratio
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Comment trends */}
                <div className="bg-white rounded-lg shadow-soft border border-neutral-200 p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-6">Comment Trends</h3>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={commentsData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => format(new Date(date), 'MMM d')}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [value, 'Comments']}
                          labelFormatter={(label) => format(new Date(label), 'MMMM d, yyyy')}
                        />
                        <Bar 
                          dataKey="comments" 
                          name="Comments" 
                          fill="#faa700" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Reader retention */}
                <div className="bg-white rounded-lg shadow-soft border border-neutral-200 p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Reader Retention</h3>
                  <p className="text-neutral-600 mb-6">How long readers stay engaged with your content.</p>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={[
                          { position: 0, retention: 100 },
                          { position: 10, retention: 95 },
                          { position: 20, retention: 88 },
                          { position: 30, retention: 82 },
                          { position: 40, retention: 76 },
                          { position: 50, retention: 72 },
                          { position: 60, retention: 65 },
                          { position: 70, retention: 58 },
                          { position: 80, retention: 48 },
                          { position: 90, retention: 36 },
                          { position: 100, retention: 28 }
                        ]}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="position" 
                          label={{ value: 'Content Position (%)', position: 'insideBottom', offset: -5 }}
                        />
                        <YAxis 
                          label={{ value: 'Reader Retention (%)', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Retention']}
                          labelFormatter={(label) => `${label}% through content`}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="retention" 
                          stroke="#4149eb" 
                          fill="#4149eb" 
                          fillOpacity={0.2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboardPage;