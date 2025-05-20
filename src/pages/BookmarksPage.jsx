// src/pages/BookmarksPage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Bookmark, Search, Filter, Trash, Grid, List, 
  Clock, SortAsc, SortDesc, Tag, Code, BookOpen
} from 'lucide-react';
import EnhancedPostCard from '../components/posts/EnhancedPostCard';
import { removeBookmark } from '../store/slices/postsSlice';

const BookmarksPage = () => {
  const dispatch = useDispatch();
  const { savedPosts } = useSelector(state => state.posts);
  const { posts, loading } = useSelector(state => state.posts);
  const { isAuthenticated } = useSelector(state => state.auth);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [filterBy, setFilterBy] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Get bookmarked posts from all posts
  useEffect(() => {
    if (posts && savedPosts) {
      const filtered = posts.filter(post => savedPosts.includes(post.id));
      setBookmarkedPosts(filtered);
    }
  }, [posts, savedPosts]);
  
  // Filter and sort bookmarked posts
  const getFilteredPosts = () => {
    let filtered = [...bookmarkedPosts];
    
    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.tags && post.tags.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }
    
    // Apply content type filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(post => {
        if (filterBy === 'code' && post.codeSnippet) return true;
        if (filterBy === 'article' && !post.codeSnippet) return true;
        if (filterBy === 'tutorial' && post.tags && post.tags.includes('Tutorial')) return true;
        return false;
      });
    }
    
    // Apply sorting
    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
    } else if (sortBy === 'alphabetical') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => (b.views + b.likes * 2) - (a.views + a.likes * 2));
    }
    
    return filtered;
  };
  
  const handleRemoveBookmark = (postId) => {
    dispatch(removeBookmark(postId));
  };
  
  // Get filtered and sorted posts
  const filteredPosts = getFilteredPosts();
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center mb-2">
          <Bookmark size={28} className="mr-3 text-primary" />
          Bookmarks
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Your saved articles, code snippets, and tutorials for easy access
        </p>
      </div>
      
      {/* Search and filter bar */}
      <div className="mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 p-2.5"
              placeholder="Search in your bookmarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            {/* View Mode Switcher */}
            <div className="flex border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
              <button
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400'}`}
                onClick={() => setViewMode('grid')}
                title="Grid view"
              >
                <Grid size={18} />
              </button>
              <button
                className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400'}`}
                onClick={() => setViewMode('list')}
                title="List view"
              >
                <List size={18} />
              </button>
            </div>
            
            {/* Filter Button */}
            <button
              className={`p-2 border border-gray-200 dark:border-gray-700 rounded-md ${
                showFilters ? 'bg-primary text-white' : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400'
              }`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
            </button>
          </div>
        </div>
        
        {/* Filter options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sort By */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Sort By
              </label>
              <select
                className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
            
            {/* Filter By */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Content Type
              </label>
              <select
                className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
              >
                <option value="all">All Content</option>
                <option value="article">Articles</option>
                <option value="code">Code Snippets</option>
                <option value="tutorial">Tutorials</option>
              </select>
            </div>
            
            {/* Filter actions */}
            <div className="flex items-end">
              <button
                className="px-4 py-2.5 text-sm text-white bg-primary hover:bg-primary-dark rounded-lg"
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </button>
              <button
                className="ml-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg"
                onClick={() => {
                  setSearchTerm('');
                  setSortBy('recent');
                  setFilterBy('all');
                }}
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Content Area */}
      {loading ? (
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
      ) : filteredPosts.length === 0 ? (
        // Empty state
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <Bookmark size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No bookmarks found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            {searchTerm || filterBy !== 'all' 
              ? "No bookmarks match your current filters. Try adjusting your search criteria." 
              : "You haven't bookmarked any content yet. Browse articles and click the bookmark icon to save them for later."}
          </p>
          <Link to="/explore" className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium">
            Explore Content
          </Link>
        </div>
      ) : (
        // Display bookmarked posts
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <EnhancedPostCard 
                key={post.id} 
                post={post} 
                variant="default"
                showCodePreview={false}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div key={post.id} className="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                {post.coverImage && (
                  <div className="hidden sm:block w-40 h-auto">
                    <img 
                      src={post.coverImage} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1">
                      {post.tags && post.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="inline-flex items-center text-xs font-medium text-primary dark:text-primary-light bg-primary/10 dark:bg-primary-dark/20 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                      {post.tags && post.tags.length > 2 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">+{post.tags.length - 2}</span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <button
                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemoveBookmark(post.id);
                        }}
                        title="Remove bookmark"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                  <Link to={`/post/${post.id}`} className="block">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-primary dark:hover:text-primary-light transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">
                      {post.excerpt}
                    </p>
                  </Link>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      <span>
                        {new Date(post.publishedAt).toLocaleDateString()} · {post.readTime} min read
                      </span>
                    </div>
                    <div className="flex items-center">
                      {post.codeSnippet ? (
                        <Code size={14} className="mr-1 text-primary" />
                      ) : (
                        <BookOpen size={14} className="mr-1 text-primary" />
                      )}
                      <span>{post.codeSnippet ? 'Code Snippet' : 'Article'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
      
      {/* Pagination - if needed */}
      {filteredPosts.length > 0 && filteredPosts.length > 9 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-1">
            <button className="px-3 py-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
              Previous
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`px-3 py-2 rounded-md ${
                  page === 1 
                    ? 'bg-primary text-white' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {page}
              </button>
            ))}
            <button className="px-3 py-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;