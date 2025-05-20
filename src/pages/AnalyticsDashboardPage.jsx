// src/pages/AnalyticsDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  BarChart2, TrendingUp, Users, Eye, ThumbsUp, Clock, 
  MessageSquare, Award, Calendar, Download, Share2, 
  Filter, RefreshCw, ArrowUp, ArrowDown, Code, FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import CodePerformanceVisualizer from '../components/analytics/CodePerformanceVisualizer';

const AnalyticsDashboardPage = () => {
  const { darkMode } = useSelector(state => state.ui);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Mock analytics data - in a real app, this would come from API
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalViews: 24856,
      totalLikes: 1243,
      totalComments: 368,
      followers: 532,
      postsCount: 28,
      avgReadTime: 4.2,
    },
    performanceByPost: [
      { id: '1', title: 'Building Scalable React Applications with Redux Toolkit', views: 8742, likes: 423, comments: 57 },
      { id: '2', title: 'Advanced TypeScript Patterns for React Developers', views: 10291, likes: 567, comments: 83 },
      { id: '3', title: 'Building a Microservices Architecture with Node.js and Docker', views: 15423, likes: 723, comments: 103 },
      { id: '4', title: 'Implementing Authentication with JWT in Express.js Applications', views: 4578, likes: 218, comments: 36 },
      { id: '5', title: 'Machine Learning with Python: Building a Recommendation Engine', views: 7812, likes: 473, comments: 59 },
    ],
    trafficSources: [
      { name: 'Direct', value: 40 },
      { name: 'Search', value: 30 },
      { name: 'Social Media', value: 15 },
      { name: 'Referrals', value: 10 },
      { name: 'Other', value: 5 },
    ],
    viewsByDevice: [
      { name: 'Desktop', value: 65 },
      { name: 'Mobile', value: 30 },
      { name: 'Tablet', value: 5 },
    ],
    viewsByCountry: [
      { name: 'United States', value: 35 },
      { name: 'India', value: 15 },
      { name: 'Germany', value: 10 },
      { name: 'United Kingdom', value: 8 },
      { name: 'Canada', value: 7 },
      { name: 'Other', value: 25 },
    ],
    growthOverTime: [
      { month: 'Jan', views: 1500, likes: 120, followers: 230 },
      { month: 'Feb', views: 2200, likes: 150, followers: 250 },
      { month: 'Mar', views: 3000, likes: 210, followers: 270 },
      { month: 'Apr', views: 4100, likes: 260, followers: 310 },
      { month: 'May', views: 5300, likes: 320, followers: 350 },
      { month: 'Jun', views: 6200, likes: 380, followers: 390 },
      { month: 'Jul', views: 7100, likes: 420, followers: 430 },
      { month: 'Aug', views: 7900, likes: 470, followers: 460 },
      { month: 'Sep', views: 8700, likes: 510, followers: 490 },
      { month: 'Oct', views: 9800, likes: 570, followers: 520 },
      { month: 'Nov', views: 11000, likes: 650, followers: 560 },
      { month: 'Dec', views: 12500, likes: 720, followers: 610 },
    ],
    viewsByTopic: [
      { name: 'React', value: 30 },
      { name: 'JavaScript', value: 25 },
      { name: 'Node.js', value: 15 },
      { name: 'Python', value: 12 },
      { name: 'DevOps', value: 10 },
      { name: 'Other', value: 8 },
    ],
    codePerformance: {
      languages: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go'],
      executionTime: [4.2, 3.8, 7.5, 2.1, 1.7],
      memoryUsage: [12.4, 14.1, 18.3, 22.5, 4.2],
    }
  });
  
  // Refresh analytics data
  const refreshData = () => {
    setIsLoading(true);
    
    // Simulate API call to refresh data
    setTimeout(() => {
      // Add some random variance to data
      const updatedData = { ...analyticsData };
      updatedData.overview.totalViews += Math.floor(Math.random() * 500);
      updatedData.overview.totalLikes += Math.floor(Math.random() * 50);
      updatedData.overview.followers += Math.floor(Math.random() * 10);
      
      setAnalyticsData(updatedData);
      setIsLoading(false);
    }, 1500);
  };
  
  // Filter by time range
  const filterByTimeRange = (range) => {
    setTimeRange(range);
    setIsLoading(true);
    
    // Simulate API call with different time ranges
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };
  
  // Chart colors
  const CHART_COLORS = [
    '#3b82f6', '#10b981', '#8b5cf6', '#f97316', '#facc15', 
    '#ef4444', '#ec4899', '#06b6d4', '#14b8a6', '#6366f1'
  ];
  
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center mb-2">
            <BarChart2 size={28} className="mr-3 text-primary" />
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your content performance and engagement metrics
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          {/* Time range selector */}
          <div className="flex border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
            <button
              className={`px-3 py-1.5 text-sm ${
                timeRange === '7d' 
                  ? 'bg-primary text-white' 
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => filterByTimeRange('7d')}
            >
              7D
            </button>
            <button
              className={`px-3 py-1.5 text-sm ${
                timeRange === '30d' 
                  ? 'bg-primary text-white' 
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => filterByTimeRange('30d')}
            >
              30D
            </button>
            <button
              className={`px-3 py-1.5 text-sm ${
                timeRange === '90d' 
                  ? 'bg-primary text-white' 
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => filterByTimeRange('90d')}
            >
              90D
            </button>
            <button
              className={`px-3 py-1.5 text-sm ${
                timeRange === '1y' 
                  ? 'bg-primary text-white' 
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => filterByTimeRange('1y')}
            >
              1Y
            </button>
          </div>
          
          <button
            className="p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
          </button>
          
          <button
            className={`p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={refreshData}
            disabled={isLoading}
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </button>
          
          <button
            className="p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            title="Export Data"
          >
            <Download size={18} />
          </button>
        </div>
      </div>
      
      {/* Filter panel */}
      {showFilters && (
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h3 className="text-sm font-medium mb-3">Advanced Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                Content Type
              </label>
              <select className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2">
                <option value="all">All Content</option>
                <option value="articles">Articles Only</option>
                <option value="code">Code Snippets Only</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                Topics
              </label>
              <select className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2">
                <option value="all">All Topics</option>
                <option value="react">React</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="nodejs">Node.js</option>
                <option value="devops">DevOps</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                Metric Focus
              </label>
              <select className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2">
                <option value="all">All Metrics</option>
                <option value="views">Views</option>
                <option value="engagement">Engagement</option>
                <option value="growth">Growth</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              className="px-4 py-2 bg-primary text-white text-sm rounded-md hover:bg-primary-dark"
              onClick={() => setShowFilters(false)}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
      
      {/* Tab navigation */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="flex -mb-px">
          <button
            className={`py-3 px-4 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-primary text-primary dark:text-primary-light'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`py-3 px-4 border-b-2 font-medium text-sm ${
              activeTab === 'content'
                ? 'border-primary text-primary dark:text-primary-light'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('content')}
          >
            Content Performance
          </button>
          <button
            className={`py-3 px-4 border-b-2 font-medium text-sm ${
              activeTab === 'audience'
                ? 'border-primary text-primary dark:text-primary-light'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('audience')}
          >
            Audience Insights
          </button>
          <button
            className={`py-3 px-4 border-b-2 font-medium text-sm ${
              activeTab === 'code'
                ? 'border-primary text-primary dark:text-primary-light'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('code')}
          >
            Code Performance
          </button>
        </nav>
      </div>
      
      {/* Dashboard Content */}
      <div className="mb-8">
        {activeTab === 'overview' && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Views</p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{analyticsData.overview.totalViews.toLocaleString()}</h3>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Eye size={24} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-green-600 dark:text-green-400">
                  <ArrowUp size={16} className="mr-1" />
                  <span className="text-sm font-medium">12.4%</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">vs last period</span>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Engagement</p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{(analyticsData.overview.totalLikes + analyticsData.overview.totalComments).toLocaleString()}</h3>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <ThumbsUp size={24} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-green-600 dark:text-green-400">
                  <ArrowUp size={16} className="mr-1" />
                  <span className="text-sm font-medium">8.7%</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">vs last period</span>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Followers</p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{analyticsData.overview.followers.toLocaleString()}</h3>
                  </div>
                  <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400">
                    <Users size={24} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-green-600 dark:text-green-400">
                  <ArrowUp size={16} className="mr-1" />
                  <span className="text-sm font-medium">4.1%</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">vs last period</span>
                </div>
              </div>
            </div>
            
            {/* Growth chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <TrendingUp size={20} className="mr-2 text-primary" />
                  Growth Over Time
                </h3>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light">
                    Views
                  </button>
                  <button className="px-3 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    Likes
                  </button>
                  <button className="px-3 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    Followers
                  </button>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={analyticsData.growthOverTime}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                    <XAxis 
                      dataKey="month" 
                      stroke={darkMode ? '#9ca3af' : '#4b5563'}
                    />
                    <YAxis stroke={darkMode ? '#9ca3af' : '#4b5563'} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                        borderColor: darkMode ? '#374151' : '#e5e7eb',
                        color: darkMode ? '#f9fafb' : '#111827'
                      }} 
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="views" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.2} 
                      name="Views"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="likes" 
                      stroke="#8b5cf6" 
                      fill="#8b5cf6" 
                      fillOpacity={0.2} 
                      name="Likes"
                      hide
                    />
                    <Area 
                      type="monotone" 
                      dataKey="followers" 
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.2} 
                      name="Followers"
                      hide
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Content & Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Top Posts by Views */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Award size={18} className="mr-2 text-primary" />
                  Top Performing Content
                </h3>
                <div className="space-y-4">
                  {analyticsData.performanceByPost.slice(0, 3).map((post, index) => (
                    <div 
                      key={post.id}
                      className="flex items-center pb-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 last:pb-0"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="ml-3 flex-1">
                        <Link 
                          to={`/post/${post.id}`}
                          className="text-sm font-medium text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary-light line-clamp-2"
                        >
                          {post.title}
                        </Link>
                        <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <Eye size={12} className="mr-1" />
                          <span>{post.views.toLocaleString()} views</span>
                          <span className="mx-2">•</span>
                          <ThumbsUp size={12} className="mr-1" />
                          <span>{post.likes} likes</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link 
                  to="/analytics/content"
                  className="mt-4 block text-center text-sm font-medium text-primary dark:text-primary-light hover:underline pt-2"
                >
                  View all content
                </Link>
              </div>
              
              {/* Traffic distribution */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <TrendingUp size={18} className="mr-2 text-primary" />
                  Traffic Sources
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        dataKey="value"
                        isAnimationActive={true}
                        data={analyticsData.trafficSources}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={true}
                      >
                        {analyticsData.trafficSources.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'content' && (
          <>
            {/* Content Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex flex-col items-center text-center">
                  <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2">
                    <FileText size={20} />
                  </div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Posts</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{analyticsData.overview.postsCount}</h3>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex flex-col items-center text-center">
                  <div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-2">
                    <Eye size={20} />
                  </div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Views</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{Math.round(analyticsData.overview.totalViews / analyticsData.overview.postsCount).toLocaleString()}</h3>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex flex-col items-center text-center">
                  <div className="h-10 w-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-400 mb-2">
                    <ThumbsUp size={20} />
                  </div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Likes</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{Math.round(analyticsData.overview.totalLikes / analyticsData.overview.postsCount)}</h3>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex flex-col items-center text-center">
                  <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 mb-2">
                    <Clock size={20} />
                  </div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Read Time</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{analyticsData.overview.avgReadTime} min</h3>
                </div>
              </div>
            </div>
            
            {/* Content Performance Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Post Performance</h3>
                <div className="flex items-center space-x-2">
                  <select className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary p-1.5">
                    <option value="views">Sort by Views</option>
                    <option value="likes">Sort by Likes</option>
                    <option value="comments">Sort by Comments</option>
                    <option value="newest">Sort by Date</option>
                  </select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Post Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Views
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Likes
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Comments
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Engagement %
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {analyticsData.performanceByPost.map((post, index) => (
                      <tr key={post.id} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-primary/10 dark:bg-primary/20 rounded-md flex items-center justify-center text-primary">
                              {post.title.includes('Code') ? <Code size={16} /> : <FileText size={16} />}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                <Link to={`/post/${post.id}`} className="hover:text-primary dark:hover:text-primary-light">
                                  {post.title.length > 40 ? post.title.substring(0, 40) + '...' : post.title}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            post.title.includes('Code') 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          }`}>
                            {post.title.includes('Code') ? 'Code' : 'Article'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {post.views.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {post.likes}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {post.comments}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2 max-w-[100px]">
                              <div 
                                className="bg-primary h-2.5 rounded-full" 
                                style={{ width: `${Math.round((post.likes + post.comments) / post.views * 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {Math.round((post.likes + post.comments) / post.views * 100)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">{analyticsData.overview.postsCount}</span> posts
                </div>
                <div className="flex space-x-1">
                  <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                    Previous
                  </button>
                  <button className="px-3 py-1 bg-primary text-white rounded-md text-sm">
                    1
                  </button>
                  <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                    2
                  </button>
                  <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                    Next
                  </button>
                </div>
              </div>
            </div>
            
            {/* Top performing content by topic */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Content Performance by Topic</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analyticsData.viewsByTopic}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                    <XAxis type="number" stroke={darkMode ? '#9ca3af' : '#4b5563'} />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      stroke={darkMode ? '#9ca3af' : '#4b5563'} 
                      width={80}
                    />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                        borderColor: darkMode ? '#374151' : '#e5e7eb',
                        color: darkMode ? '#f9fafb' : '#111827'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="value" name="Percentage" fill="#3b82f6" barSize={20}>
                      {analyticsData.viewsByTopic.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'audience' && (
          <>
            {/* Audience Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Users size={18} className="mr-2 text-primary" />
                  User Devices
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        dataKey="value"
                        isAnimationActive={true}
                        data={analyticsData.viewsByDevice}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={true}
                      >
                        {analyticsData.viewsByDevice.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Globe size={18} className="mr-2 text-primary" />
                  Geographical Distribution
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        dataKey="value"
                        isAnimationActive={true}
                        data={analyticsData.viewsByCountry}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label={({ name, percent }) => `${name.substring(0, 8)}${name.length > 8 ? '..' : ''}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={true}
                      >
                        {analyticsData.viewsByCountry.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Calendar size={18} className="mr-2 text-primary" />
                  Engagement by Day
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Mon', value: 25 },
                        { name: 'Tue', value: 30 },
                        { name: 'Wed', value: 45 },
                        { name: 'Thu', value: 40 },
                        { name: 'Fri', value: 35 },
                        { name: 'Sat', value: 22 },
                        { name: 'Sun', value: 18 },
                      ]}
                      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                      <XAxis dataKey="name" stroke={darkMode ? '#9ca3af' : '#4b5563'} />
                      <YAxis stroke={darkMode ? '#9ca3af' : '#4b5563'} />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                          borderColor: darkMode ? '#374151' : '#e5e7eb',
                          color: darkMode ? '#f9fafb' : '#111827'
                        }}
                      />
                      <Bar dataKey="value" name="Engagement" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Audience Engagement Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <MessageSquare size={18} className="mr-2 text-primary" />
                  Most Active Followers
                </h3>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((_, index) => (
                    <div key={index} className="flex items-center">
                      <div className="flex-shrink-0">
                        <img 
                          src={`https://randomuser.me/api/portraits/${index % 2 === 0 ? 'men' : 'women'}/${20 + index}.jpg`} 
                          alt="User avatar" 
                          className="h-10 w-10 rounded-full"
                        />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {['Alex Johnson', 'Sarah Davis', 'Mike Chen', 'Emma Wilson', 'Carlos Rodriguez'][index]}
                        </div>
                        <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <MessageSquare size={12} className="mr-1" />
                          <span>{14 - index * 2} comments</span>
                          <span className="mx-2">•</span>
                          <ThumbsUp size={12} className="mr-1" />
                          <span>{28 - index * 3} likes</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Clock size={18} className="mr-2 text-primary" />
                  Audience Activity Times
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { hour: '00:00', users: 15 },
                        { hour: '02:00', users: 10 },
                        { hour: '04:00', users: 8 },
                        { hour: '06:00', users: 20 },
                        { hour: '08:00', users: 45 },
                        { hour: '10:00', users: 78 },
                        { hour: '12:00', users: 85 },
                        { hour: '14:00', users: 90 },
                        { hour: '16:00', users: 82 },
                        { hour: '18:00', users: 75 },
                        { hour: '20:00', users: 55 },
                        { hour: '22:00', users: 30 },
                      ]}
                      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                      <XAxis dataKey="hour" stroke={darkMode ? '#9ca3af' : '#4b5563'} />
                      <YAxis stroke={darkMode ? '#9ca3af' : '#4b5563'} />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                          borderColor: darkMode ? '#374151' : '#e5e7eb',
                          color: darkMode ? '#f9fafb' : '#111827'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="users" 
                        stroke="#8b5cf6" 
                        activeDot={{ r: 8 }}
                        name="Active Users" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'code' && (
          <>
            {/* Code Performance Visualizer */}
            <CodePerformanceVisualizer />
            
            {/* Code Metrics Table */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Code Snippets Performance
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Language
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        # of Snippets
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Avg. Execution Time
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Avg. Memory Usage
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Popularity Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {analyticsData.codePerformance.languages.map((language, index) => (
                      <tr key={language} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-primary/10 dark:bg-primary/20 rounded-md flex items-center justify-center text-primary">
                              <Code size={16} />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {language}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {Math.floor(Math.random() * 10) + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {analyticsData.codePerformance.executionTime[index]} ms
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {analyticsData.codePerformance.memoryUsage[index]} MB
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2 max-w-[100px]">
                              <div 
                                className="bg-primary h-2.5 rounded-full" 
                                style={{ width: `${Math.floor(100 - (index * 15))}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {Math.floor(100 - (index * 15))}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Helper component for Globe icon
const Globe = ({ size = 24, className = '' }) => (
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
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

export default AnalyticsDashboardPage;