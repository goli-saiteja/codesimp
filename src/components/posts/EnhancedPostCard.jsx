// src/components/posts/EnhancedPostCard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ThumbsUp, MessageSquare, Bookmark, Share2, MoreHorizontal, 
  Code, Clock, Eye, Heart, Play, Copy, Check, Cpu, AlertTriangle,
  Calendar, FileText, User, ExternalLink, Tag as TagIcon, Award
} from 'lucide-react';
import { addBookmark, removeBookmark } from '../../store/slices/postsSlice';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark, a11yLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import useCodeMetrics from '../../hooks/useCodeMetrics';

// Interactive Post Card with code preview and performance metrics
const EnhancedPostCard = ({ 
  post, 
  variant = 'default', // 'default', 'featured', 'compact', 'list'
  showCodePreview = true,
  animated = true 
}) => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector(state => state.ui);
  const { savedPosts } = useSelector(state => state.posts);
  const { isAuthenticated } = useSelector(state => state.auth);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showCodeMetrics, setShowCodeMetrics] = useState(false);
  const [copied, setCopied] = useState(false);
  const [codePreviewVisible, setCodePreviewVisible] = useState(false);
  const optionsRef = useRef(null);
  
  // Get code metrics
  const { calculateCodeMetrics } = useCodeMetrics();
  const codeMetrics = post.codeSnippet ? calculateCodeMetrics(post.codeSnippet, post.language) : null;
  
  // Check if post is already bookmarked
  useEffect(() => {
    setIsBookmarked(savedPosts.includes(post.id));
  }, [savedPosts, post.id]);
  
  // Handle outside clicks for options menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Toggle code preview with slight delay for animation
  const toggleCodePreview = () => {
    if (codePreviewVisible) {
      setCodePreviewVisible(false);
    } else {
      setCodePreviewVisible(true);
    }
  };
  
  // Handle bookmark toggle
  const toggleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      return;
    }
    
    if (isBookmarked) {
      dispatch(removeBookmark(post.id));
    } else {
      dispatch(addBookmark(post.id));
    }
    
    setIsBookmarked(!isBookmarked);
  };
  
  // Copy code to clipboard
  const copyCode = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    navigator.clipboard.writeText(post.codeSnippet);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  // Share post
  const sharePost = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: `${window.location.origin}/post/${post.id}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
      // Show toast notification
      alert('Link copied to clipboard!');
    }
  };
  
  // Format published date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  // Card classes based on variant
  const cardClasses = {
    default: 'border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow',
    featured: 'border-2 border-primary/20 dark:border-primary/30 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-primary/5 dark:from-gray-900 dark:to-primary/10',
    compact: 'border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow',
    list: 'border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors',
  };
  
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };
  
  return (
    <motion.article
      ref={ref}
      className={cardClasses[variant]}
      variants={animated ? cardVariants : {}}
      initial={animated ? 'hidden' : false}
      animate={inView && animated ? 'visible' : false}
    >
      <Link to={`/post/${post.id}`} className="block h-full">
        {/* Featured badge */}
        {post.featured && variant !== 'featured' && (
          <div className="absolute top-3 right-3 z-10">
            <div className="flex items-center bg-primary text-white text-xs px-2 py-1 rounded-full">
              <Award size={12} className="mr-1" />
              <span>Featured</span>
            </div>
          </div>
        )}
        
        {/* Cover image for default and featured variants */}
        {(variant === 'default' || variant === 'featured') && post.coverImage && (
          <div className="relative w-full aspect-[1.91/1] bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <img 
              src={post.coverImage} 
              alt={post.title}
              className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
            />
            
            {/* Language badge */}
            {post.language && (
              <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                <Code size={12} className="inline-block mr-1" />
                {post.language}
              </div>
            )}
          </div>
        )}
        
        <div className={`p-4 ${variant === 'featured' ? 'pb-5' : ''}`}>
          {/* Tags row */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {post.tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center text-xs font-medium text-primary dark:text-primary-light bg-primary/10 dark:bg-primary-dark/20 px-2 py-0.5 rounded"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Navigate to tag page
                    window.location.href = `/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`;
                  }}
                >
                  <TagIcon size={10} className="mr-1" />
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="inline-flex items-center text-xs font-medium text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
          )}
          
          {/* Title */}
          <h2 className={`font-semibold text-gray-900 dark:text-white leading-tight ${
            variant === 'featured' ? 'text-xl md:text-2xl mb-3' : 
            variant === 'compact' ? 'text-base mb-1' : 'text-lg mb-2'
          }`}>
            {post.title}
          </h2>
          
          {/* Excerpt - not shown in compact variant */}
          {variant !== 'compact' && (
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
              {post.excerpt}
            </p>
          )}
          
          {/* Content preview section */}
          {variant === 'featured' && post.codeSnippet && showCodePreview && (
            <div className="mt-3 mb-4">
              <button
                className="flex items-center text-sm font-medium text-primary dark:text-primary-light hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleCodePreview();
                }}
              >
                <Code size={16} className="mr-1.5" />
                {codePreviewVisible ? 'Hide code preview' : 'Show code preview'}
              </button>
              
              <AnimatePresence>
                {codePreviewVisible && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 relative"
                  >
                    <div className="relative rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                      <div className="absolute right-2 top-2 z-10 flex items-center space-x-1">
                        <button
                          className="p-1 rounded bg-black/50 hover:bg-black/70 text-white transition-colors"
                          onClick={copyCode}
                          title="Copy code"
                        >
                          {copied ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                        
                        <button
                          className="p-1 rounded bg-black/50 hover:bg-black/70 text-white transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowCodeMetrics(!showCodeMetrics);
                          }}
                          title="Code metrics"
                        >
                          <Cpu size={14} />
                        </button>
                      </div>
                      
                      <SyntaxHighlighter
                        language={post.language?.toLowerCase() || 'javascript'}
                        style={darkMode ? a11yDark : a11yLight}
                        customStyle={{ margin: 0, borderRadius: 0, maxHeight: 200 }}
                        wrapLines
                        lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}
                      >
                        {post.codeSnippet}
                      </SyntaxHighlighter>
                      
                      {/* Code metrics overlay */}
                      <AnimatePresence>
                        {showCodeMetrics && codeMetrics && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-gray-900/90 backdrop-blur-sm text-white flex flex-col items-center justify-center p-4"
                          >
                            <h4 className="text-sm font-semibold mb-3">Code Metrics</h4>
                            <div className="grid grid-cols-2 gap-3 text-xs w-full max-w-xs">
                              <div className="bg-gray-800/80 rounded-lg p-2 flex flex-col items-center">
                                <span className="text-gray-400 mb-1">Complexity</span>
                                <div className="flex items-center">
                                  <span className={`text-lg font-bold ${
                                    codeMetrics.complexity < 10 ? 'text-green-400' : 
                                    codeMetrics.complexity < 20 ? 'text-yellow-400' : 'text-red-400'
                                  }`}>
                                    {codeMetrics.complexity}
                                  </span>
                                  {codeMetrics.complexity < 10 && (
                                    <span className="ml-1 text-xs text-green-400">Good</span>
                                  )}
                                  {codeMetrics.complexity >= 10 && codeMetrics.complexity < 20 && (
                                    <span className="ml-1 text-xs text-yellow-400">Medium</span>
                                  )}
                                  {codeMetrics.complexity >= 20 && (
                                    <span className="ml-1 text-xs text-red-400">High</span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="bg-gray-800/80 rounded-lg p-2 flex flex-col items-center">
                                <span className="text-gray-400 mb-1">Lines</span>
                                <span className="text-lg font-bold text-blue-400">
                                  {codeMetrics.lines}
                                </span>
                              </div>
                              
                              <div className="bg-gray-800/80 rounded-lg p-2 flex flex-col items-center">
                                <span className="text-gray-400 mb-1">Maintainability</span>
                                <div className="flex items-center">
                                  <span className={`text-lg font-bold ${
                                    codeMetrics.maintainability > 70 ? 'text-green-400' : 
                                    codeMetrics.maintainability > 50 ? 'text-yellow-400' : 'text-red-400'
                                  }`}>
                                    {codeMetrics.maintainability}
                                  </span>
                                  <span className="text-gray-400 text-xs">/100</span>
                                </div>
                              </div>
                              
                              <div className="bg-gray-800/80 rounded-lg p-2 flex flex-col items-center">
                                <span className="text-gray-400 mb-1">Issues</span>
                                <div className="flex items-center">
                                  {codeMetrics.issues === 0 ? (
                                    <span className="text-lg font-bold text-green-400">0</span>
                                  ) : (
                                    <>
                                      <AlertTriangle size={14} className="text-yellow-400 mr-1" />
                                      <span className="text-lg font-bold text-yellow-400">
                                        {codeMetrics.issues}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          
          {/* Author and meta information */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center">
              {/* Author avatar - only in default and featured variants */}
              {(variant === 'default' || variant === 'featured') && (
                <Link
                  to={`/profile/${post.author.id}`}
                  className="flex-shrink-0 mr-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                    {post.author.avatar ? (
                      <img 
                        src={post.author.avatar} 
                        alt={post.author.name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                        <User size={16} />
                      </div>
                    )}
                  </div>
                </Link>
              )}
              
              <div>
                <Link
                  to={`/profile/${post.author.id}`}
                  className="text-sm font-medium text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary-light"
                  onClick={(e) => e.stopPropagation()}
                >
                  {post.author.name}
                </Link>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Calendar size={12} className="mr-1" />
                  <time dateTime={post.publishedAt}>
                    {formatDate(post.publishedAt)}
                  </time>
                  <span className="mx-1">·</span>
                  <Clock size={12} className="mr-1" />
                  <span>{post.readTime} min read</span>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-1">
              {variant !== 'compact' && (
                <>
                  <button
                    className={`p-1.5 rounded-full ${
                      isBookmarked 
                        ? 'text-primary dark:text-primary-light' 
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                    }`}
                    onClick={toggleBookmark}
                    title={isBookmarked ? 'Remove bookmark' : 'Bookmark this post'}
                  >
                    <Bookmark size={16} className={isBookmarked ? 'fill-current' : ''} />
                  </button>
                  
                  <button
                    className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={sharePost}
                    title="Share this post"
                  >
                    <Share2 size={16} />
                  </button>
                </>
              )}
              
              <div className="relative" ref={optionsRef}>
                <button
                  className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowOptions(!showOptions);
                  }}
                  title="More options"
                >
                  <MoreHorizontal size={16} />
                </button>
                
                {/* Options menu */}
                {showOptions && (
                  <div className="absolute right-0 z-10 mt-1 w-48 origin-top-right rounded-md bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none">
                    <div className="py-1">
                      <button
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Report post logic
                          setShowOptions(false);
                        }}
                      >
                        <AlertTriangle size={16} className="mr-2" />
                        Report this post
                      </button>
                      <button
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Hide post logic
                          setShowOptions(false);
                        }}
                      >
                        <Eye size={16} className="mr-2" />
                        Not interested
                      </button>
                      <button
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.open(`/post/${post.id}`, '_blank');
                        }}
                      >
                        <ExternalLink size={16} className="mr-2" />
                        Open in new tab
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Engagement stats - only in default and featured variants */}
          {(variant === 'default' || variant === 'featured') && (
            <div className="flex items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mr-4">
                <Heart size={16} className="mr-1" />
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mr-4">
                <MessageSquare size={16} className="mr-1" />
                <span>{post.comments}</span>
              </div>
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                <Eye size={16} className="mr-1" />
                <span>{post.views}</span>
              </div>
              
              {/* Run code button for code posts */}
              {post.codeSnippet && (
                <div className="ml-auto">
                  <Link
                    to={`/playground?code=${encodeURIComponent(post.codeSnippet)}&language=${post.language || 'javascript'}`}
                    className="flex items-center text-xs font-semibold text-primary dark:text-primary-light hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Play size={12} className="mr-1" />
                    Run code
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
};

export default EnhancedPostCard;