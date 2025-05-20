// src/pages/GitHubIntegrationPage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  GitHub, 
  Code, 
  GitBranch, 
  Star, 
  GitPullRequest, 
  Book, 
  FileCode, 
  Settings, 
  RefreshCw, 
  PlusCircle, 
  ExternalLink, 
  Lock, 
  Unlock, 
  AlertTriangle,
  CheckCircle,
  Filter,
  Search,
  Calendar,
  Eye
} from 'lucide-react';

// Mock data for repositories
const MOCK_REPOSITORIES = [
  {
    id: 1,
    name: 'react-code-editor',
    description: 'A customizable code editor built with React and CodeMirror',
    language: 'JavaScript',
    languageColor: '#f1e05a',
    stars: 142,
    forks: 28,
    updatedAt: '2025-05-01T14:23:10Z',
    isPrivate: false,
    isImported: true,
    url: 'https://github.com/username/react-code-editor'
  },
  {
    id: 2,
    name: 'python-data-analysis',
    description: 'Data analysis utilities and examples using pandas and matplotlib',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 87,
    forks: 12,
    updatedAt: '2025-04-28T09:45:22Z',
    isPrivate: false,
    isImported: false,
    url: 'https://github.com/username/python-data-analysis'
  },
  {
    id: 3,
    name: 'go-microservices',
    description: 'A collection of microservices written in Go with Docker and Kubernetes support',
    language: 'Go',
    languageColor: '#00ADD8',
    stars: 215,
    forks: 42,
    updatedAt: '2025-05-10T16:30:45Z',
    isPrivate: false,
    isImported: true,
    url: 'https://github.com/username/go-microservices'
  },
  {
    id: 4,
    name: 'rust-algorithms',
    description: 'Common algorithms and data structures implemented in Rust',
    language: 'Rust',
    languageColor: '#DEA584',
    stars: 64,
    forks: 8,
    updatedAt: '2025-05-08T11:20:30Z',
    isPrivate: false,
    isImported: false,
    url: 'https://github.com/username/rust-algorithms'
  },
  {
    id: 5,
    name: 'private-project',
    description: 'A private project with proprietary code',
    language: 'TypeScript',
    languageColor: '#3178c6',
    stars: 0,
    forks: 0,
    updatedAt: '2025-05-12T08:15:40Z',
    isPrivate: true,
    isImported: false,
    url: 'https://github.com/username/private-project'
  }
];

// Mock data for recent activity
const MOCK_ACTIVITY = [
  {
    id: 1,
    type: 'commit',
    repo: 'react-code-editor',
    message: 'Add syntax highlighting for Rust and Go',
    timestamp: '2025-05-12T10:24:15Z'
  },
  {
    id: 2,
    type: 'pull_request',
    repo: 'go-microservices',
    message: 'Implement JWT authentication for API gateway',
    timestamp: '2025-05-10T16:30:45Z',
    status: 'merged'
  },
  {
    id: 3,
    type: 'issue',
    repo: 'python-data-analysis',
    message: 'Fix pandas DataFrame visualization issue',
    timestamp: '2025-05-09T13:45:20Z',
    status: 'closed'
  },
  {
    id: 4,
    type: 'star',
    repo: 'community/awesome-react',
    timestamp: '2025-05-08T09:12:30Z'
  },
  {
    id: 5,
    type: 'fork',
    repo: 'tensorflow/tensorflow',
    timestamp: '2025-05-07T14:22:10Z'
  }
];

const GitHubIntegrationPage = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [connected, setConnected] = useState(false);
  const [repositories, setRepositories] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'imported', 'not-imported'
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Check if connected to GitHub
      setConnected(isAuthenticated);
      
      if (isAuthenticated) {
        setRepositories(MOCK_REPOSITORIES);
        setActivity(MOCK_ACTIVITY);
      }
      
      setLoading(false);
    };
    
    loadData();
  }, [isAuthenticated]);
  
  const refreshRepositories = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate refreshing data with random changes
    const updatedRepos = [...repositories];
    const randomRepo = Math.floor(Math.random() * updatedRepos.length);
    updatedRepos[randomRepo] = {
      ...updatedRepos[randomRepo],
      stars: updatedRepos[randomRepo].stars + Math.floor(Math.random() * 5),
      updatedAt: new Date().toISOString()
    };
    
    setRepositories(updatedRepos);
    setRefreshing(false);
  };
  
  const toggleImportStatus = (repoId) => {
    const updatedRepos = repositories.map(repo => {
      if (repo.id === repoId) {
        return { ...repo, isImported: !repo.isImported };
      }
      return repo;
    });
    
    setRepositories(updatedRepos);
  };
  
  const connectGitHub = async () => {
    setLoading(true);
    // Simulate GitHub OAuth flow
    await new Promise(resolve => setTimeout(resolve, 1500));
    setConnected(true);
    setRepositories(MOCK_REPOSITORIES);
    setActivity(MOCK_ACTIVITY);
    setLoading(false);
  };
  
  // Filter repositories based on current filter and search query
  const filteredRepositories = repositories.filter(repo => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'imported' && repo.isImported) || 
                         (filter === 'not-imported' && !repo.isImported);
    
    const matchesSearch = searchQuery === '' || 
                         repo.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-10 w-10 bg-black text-white rounded-full flex items-center justify-center mr-3">
                <GitHub size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">GitHub Integration</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Connect your GitHub account to import repositories and showcase your projects
                </p>
              </div>
            </div>
            
            {connected ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={refreshRepositories}
                  disabled={refreshing}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <RefreshCw size={16} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
                
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Settings size={16} className="mr-2" />
                  Settings
                </button>
              </div>
            ) : (
              <button
                onClick={connectGitHub}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
              >
                <GitHub size={16} className="mr-2" />
                {loading ? 'Connecting...' : 'Connect to GitHub'}
              </button>
            )}
          </div>
        </div>
        
        {/* Integration settings panel */}
        {showSettings && connected && (
          <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Integration Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600"
                    checked={true}
                    onChange={() => {}}
                  />
                  <span>Auto-sync repositories</span>
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-6">
                  Automatically import new repositories from GitHub
                </p>
              </div>
              
              <div>
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600"
                    checked={false}
                    onChange={() => {}}
                  />
                  <span>Include private repositories</span>
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-6">
                  Import and display your private repositories
                </p>
              </div>
              
              <div>
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600"
                    checked={true}
                    onChange={() => {}}
                  />
                  <span>Show GitHub activity on profile</span>
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-6">
                  Display your GitHub activity in your CodeSource profile
                </p>
              </div>
              
              <div>
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600"
                    checked={true}
                    onChange={() => {}}
                  />
                  <span>Link blog posts to repositories</span>
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-6">
                  Allow linking your blog posts to specific GitHub repositories
                </p>
              </div>
            </div>
            
            <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between">
              <button
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
              >
                Disconnect GitHub Account
              </button>
              
              <button
                className="inline-flex items-center px-3 py-1.5 text-sm bg-primary hover:bg-primary-dark text-white rounded-md"
              >
                Save Settings
              </button>
            </div>
          </div>
        )}
        
        {/* Main content */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <RefreshCw size={36} className="text-primary animate-spin mb-4" />
              <p className="text-gray-600 dark:text-gray-300">Loading GitHub data...</p>
            </div>
          ) : !connected ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
                <GitHub size={48} className="text-gray-600 dark:text-gray-300" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Connect Your GitHub Account</h2>
              <p className="text-gray-600 dark:text-gray-300 text-center max-w-md mb-6">
                Link your GitHub account to import repositories, showcase your projects, and integrate with your coding workflow.
              </p>
              
              <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300 max-w-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle size={16} className="text-green-500" />
                  </div>
                  <p className="ml-2">
                    <span className="font-medium text-gray-900 dark:text-white">Import Repositories:</span> Showcase your GitHub projects on your CodeSource profile
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle size={16} className="text-green-500" />
                  </div>
                  <p className="ml-2">
                    <span className="font-medium text-gray-900 dark:text-white">Sync Code Snippets:</span> Easily include code from your repositories in your blog posts
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle size={16} className="text-green-500" />
                  </div>
                  <p className="ml-2">
                    <span className="font-medium text-gray-900 dark:text-white">Display Activity:</span> Show your GitHub contributions and activity on your profile
                  </p>
                </div>
              </div>
              
              <button
                onClick={connectGitHub}
                className="mt-8 inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
              >
                <GitHub size={20} className="mr-2" />
                Connect to GitHub
              </button>
            </div>
          ) : (
            <div>
              {/* Repository section */}
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-0">
                    Your Repositories
                  </h2>
                  
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search repositories..."
                        className="pl-10 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <div className="relative inline-block text-left">
                        <select
                          className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md pl-3 pr-10 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                          value={filter}
                          onChange={(e) => setFilter(e.target.value)}
                        >
                          <option value="all">All repositories</option>
                          <option value="imported">Imported</option>
                          <option value="not-imported">Not imported</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <Filter size={14} className="text-gray-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {filteredRepositories.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <AlertTriangle size={36} className="text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No repositories found</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {searchQuery ? 'Try a different search term or filter' : 'No repositories match the current filter'}
                    </p>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-primary hover:text-primary-dark text-sm font-medium"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredRepositories.map(repo => (
                      <div 
                        key={repo.id}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                {repo.name}
                              </h3>
                              
                              {repo.isPrivate && (
                                <div className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                                  <Lock size={12} className="mr-1" />
                                  Private
                                </div>
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 mb-2">
                              {repo.description || 'No description provided'}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                              {repo.language && (
                                <div className="flex items-center">
                                  <span 
                                    className="w-3 h-3 rounded-full mr-1"
                                    style={{ backgroundColor: repo.languageColor }}
                                  ></span>
                                  {repo.language}
                                </div>
                              )}
                              
                              <div className="flex items-center">
                                <Star size={14} className="mr-1" />
                                {repo.stars}
                              </div>
                              
                              <div className="flex items-center">
                                <GitBranch size={14} className="mr-1" />
                                {repo.forks}
                              </div>
                              
                              <div className="flex items-center">
                                <Calendar size={14} className="mr-1" />
                                {formatDate(repo.updatedAt)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center mt-4 sm:mt-0 sm:ml-4">
                            <a
                              href={repo.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center mr-3 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <ExternalLink size={14} className="mr-1" />
                              View
                            </a>
                            
                            <button
                              onClick={() => toggleImportStatus(repo.id)}
                              className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                                repo.isImported
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-300 dark:border-green-800'
                                  : 'bg-primary text-white hover:bg-primary-dark'
                              }`}
                            >
                              {repo.isImported ? (
                                <>
                                  <CheckCircle size={14} className="mr-1" />
                                  Imported
                                </>
                              ) : (
                                <>
                                  <PlusCircle size={14} className="mr-1" />
                                  Import
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Recent activity section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent GitHub Activity
                </h2>
                
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {activity.map(item => (
                      <li key={item.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <div className="flex items-start">
                          <div className="mr-3 mt-0.5">
                            {item.type === 'commit' && <Code size={18} className="text-blue-500" />}
                            {item.type === 'pull_request' && <GitPullRequest size={18} className="text-purple-500" />}
                            {item.type === 'issue' && <AlertTriangle size={18} className="text-orange-500" />}
                            {item.type === 'star' && <Star size={18} className="text-yellow-500" />}
                            {item.type === 'fork' && <GitBranch size={18} className="text-green-500" />}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {item.repo}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDate(item.timestamp)}
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {item.type === 'commit' && `Committed: ${item.message}`}
                              {item.type === 'pull_request' && (
                                <span>
                                  Pull request: {item.message}
                                  {item.status === 'merged' && (
                                    <span className="inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                      Merged
                                    </span>
                                  )}
                                </span>
                              )}
                              {item.type === 'issue' && (
                                <span>
                                  Issue: {item.message}
                                  {item.status === 'closed' && (
                                    <span className="inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                      Closed
                                    </span>
                                  )}
                                </span>
                              )}
                              {item.type === 'star' && `Starred repository: ${item.repo}`}
                              {item.type === 'fork' && `Forked repository: ${item.repo}`}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 p-4 text-center">
                    <a
                      href="https://github.com/username"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary hover:text-primary-dark text-sm font-medium"
                    >
                      View all activity on GitHub
                      <ExternalLink size={14} className="ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Feature cards */}
      {connected && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 w-12 h-12 flex items-center justify-center mb-4">
              <Code size={24} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Code Embedding
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Easily embed code from your GitHub repositories directly into your blog posts with proper syntax highlighting.
            </p>
            <Link
              to="/new-story"
              className="inline-flex items-center text-primary hover:text-primary-dark text-sm font-medium"
            >
              Create a post
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3 w-12 h-12 flex items-center justify-center mb-4">
              <Book size={24} className="text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Repository Showcasing
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Display your GitHub repositories on your profile to showcase your work and attract more followers.
            </p>
            <Link
              to="/profile/settings"
              className="inline-flex items-center text-primary hover:text-primary-dark text-sm font-medium"
            >
              Customize profile
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-3 w-12 h-12 flex items-center justify-center mb-4">
              <FileCode size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Code Playground Integration
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Import code from your GitHub repositories directly into the CodeSource Playground to demonstrate and test.
            </p>
            <Link
              to="/playground"
              className="inline-flex items-center text-primary hover:text-primary-dark text-sm font-medium"
            >
              Open playground
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for ChevronRight icon
const ChevronRight = ({ size = 24, className = '' }) => (
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
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

export default GitHubIntegrationPage;