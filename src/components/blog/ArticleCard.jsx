import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, MessageSquare, Heart, Bookmark, 
  Share2, MoreHorizontal, BookmarkCheck
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ArticleCard = ({ article }) => {
  const [bookmarked, setBookmarked] = useState(article.bookmarked);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(article.likesCount);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Format the date
  const formattedDate = formatDistanceToNow(new Date(article.publishedAt), { 
    addSuffix: true 
  });
  
  // Toggle bookmark state
  const toggleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarked(!bookmarked);
    // In a real app, you would make an API call here
  };
  
  // Toggle like state
  const toggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    // In a real app, you would make an API call here
  };
  
  // Toggle the dropdown menu
  const toggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };
  
  // Close the menu when clicking outside
  const closeMenu = () => {
    setMenuOpen(false);
  };
  
  // Generate the article URL from the title
  const articleUrl = `/article/${article.id}/${article.title
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-')}`;
  
  return (
    <article className="group h-full">
      <div className="card card-hover h-full flex flex-col transform transition-all duration-300 hover:-translate-y-1">
        {/* Cover image */}
        <Link to={articleUrl} className="block relative overflow-hidden rounded-t-xl aspect-video">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {article.featured && (
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
              Featured
            </div>
          )}
        </Link>
        
        {/* Content */}
        <div className="flex flex-col flex-grow p-5">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {article.tags.slice(0, 3).map(tag => (
              <Link 
                key={tag} 
                to={`/tag/${tag}`}
                className="text-xs font-medium px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-full transition-colors"
              >
                #{tag}
              </Link>
            ))}
            {article.tags.length > 3 && (
              <span className="text-xs font-medium px-2 py-0.5 bg-neutral-100 text-neutral-500 rounded-full">
                +{article.tags.length - 3}
              </span>
            )}
          </div>
          
          {/* Title */}
          <h2 className="text-xl font-bold text-neutral-900 mb-2 hover:text-primary-700 transition-colors line-clamp-2">
            <Link to={articleUrl}>
              {article.title}
            </Link>
          </h2>
          
          {/* Excerpt */}
          <p className="text-neutral-600 mb-4 text-sm line-clamp-3 flex-grow">
            {article.excerpt}
          </p>
          
          {/* Author and meta info */}
          <div className="mt-auto pt-4 border-t border-neutral-200">
            <div className="flex justify-between items-center">
              {/* Author info */}
              <Link 
                to={`/profile/${article.author.username}`}
                className="flex items-center group/author"
              >
                <img 
                  src={article.author.avatar} 
                  alt={article.author.name} 
                  className="w-8 h-8 rounded-full mr-2 border-2 border-transparent group-hover/author:border-primary-200 transition-colors"
                />
                <div>
                  <h3 className="text-sm font-medium text-neutral-900 group-hover/author:text-primary-600 transition-colors">
                    {article.author.name}
                  </h3>
                  <div className="flex items-center text-xs text-neutral-500">
                    <time dateTime={article.publishedAt}>{formattedDate}</time>
                    <span className="mx-1">•</span>
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {article.readTime} min read
                    </span>
                  </div>
                </div>
              </Link>
              
              {/* Actions */}
              <div className="flex items-center space-x-0.5">
                {/* Comment button */}
                <Link
                  to={`${articleUrl}#comments`}
                  className="p-1.5 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors"
                  title="Comments"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="sr-only">Comments</span>
                </Link>
                
                {/* Like button */}
                <button
                  className={`p-1.5 rounded-full transition-colors flex items-center ${
                    liked 
                      ? 'text-error-600 hover:text-error-700 hover:bg-error-50' 
                      : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100'
                  }`}
                  onClick={toggleLike}
                  title={liked ? 'Unlike' : 'Like'}
                >
                  <Heart className={`h-4 w-4 ${liked ? 'fill-error-600' : ''}`} />
                  <span className="sr-only">{liked ? 'Unlike' : 'Like'}</span>
                </button>
                
                {/* Bookmark button */}
                <button
                  className={`p-1.5 rounded-full transition-colors ${
                    bookmarked 
                      ? 'text-primary-600 hover:text-primary-700 hover:bg-primary-50' 
                      : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100'
                  }`}
                  onClick={toggleBookmark}
                  title={bookmarked ? 'Remove Bookmark' : 'Bookmark'}
                >
                  {bookmarked ? (
                    <BookmarkCheck className="h-4 w-4 fill-primary-600" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {bookmarked ? 'Remove Bookmark' : 'Bookmark'}
                  </span>
                </button>
                
                {/* More options */}
                <div className="relative">
                  <button
                    className="p-1.5 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors"
                    onClick={toggleMenu}
                    title="More options"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </button>
                  
                  {/* Dropdown menu */}
                  {menuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={closeMenu}
                      />
                      <div className="absolute right-0 z-20 mt-1 w-48 rounded-md bg-white py-1 shadow-soft-lg ring-1 ring-black ring-opacity-5">
                        <button
                          className="flex w-full items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Share functionality would go here
                            closeMenu();
                          }}
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share article
                        </button>
                        <button
                          className="flex w-full items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Report functionality would go here
                            closeMenu();
                          }}
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            className="h-4 w-4 mr-2"
                          >
                            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          Report content
                        </button>
                        <button
                          className="flex w-full items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Hide functionality would go here
                            closeMenu();
                          }}
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            className="h-4 w-4 mr-2"
                          >
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                          </svg>
                          Hide content
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Stats - mobile (hidden on desktop) */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-100 md:hidden">
              <div className="flex items-center space-x-4 text-xs text-neutral-500">
                <span className="flex items-center">
                  <MessageSquare className="h-3.5 w-3.5 mr-1" />
                  {article.commentsCount}
                </span>
                <span className="flex items-center">
                  <Heart className="h-3.5 w-3.5 mr-1" />
                  {likesCount}
                </span>
              </div>
              <div className="text-xs text-neutral-500">
                {article.views ? `${article.views} views` : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;