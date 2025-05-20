// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertCircle, 
  Home, 
  Search, 
  HelpCircle, 
  ArrowLeft, 
  ChevronRight 
} from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-180px)] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-6">
            <AlertCircle size={48} className="text-red-600 dark:text-red-400" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          404 - Page Not Found
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          We couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/"
            className="inline-flex items-center justify-center px-5 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Home size={18} className="mr-2" />
            Back to Home
          </Link>
          
          <Link 
            to="/search"
            className="inline-flex items-center justify-center px-5 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            <Search size={18} className="mr-2" />
            Search Content
          </Link>
          
          <Link 
            to="/help"
            className="inline-flex items-center justify-center px-5 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            <HelpCircle size={18} className="mr-2" />
            Help Center
          </Link>
        </div>
      </div>
      
      {/* Suggested content */}
      <div className="mt-16 max-w-3xl w-full">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          You might be interested in:
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link 
            to="/explore"
            className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Explore Topics</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Discover coding tutorials, articles, and resources across various programming languages and technologies.
            </p>
            <span className="inline-flex items-center text-primary dark:text-primary-light text-sm font-medium">
              Browse topics
              <ChevronRight size={16} className="ml-1" />
            </span>
          </Link>
          
          <Link 
            to="/playground"
            className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Code Playground</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Try out code snippets, experiment with different languages, and share your creations with the community.
            </p>
            <span className="inline-flex items-center text-primary dark:text-primary-light text-sm font-medium">
              Open playground
              <ChevronRight size={16} className="ml-1" />
            </span>
          </Link>
        </div>
        
        <div className="text-center">
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm"
          >
            <ArrowLeft size={16} className="mr-1" />
            Go back to previous page
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;