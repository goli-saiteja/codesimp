import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, Clock, Bookmark, Award, ChevronRight, 
  Filter, Tag, Calendar, Coffee, User, BookOpen, MessageSquare
} from 'lucide-react';
import ArticleCard from '../components/blog/ArticleCard';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('featured');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredTag, setFeaturedTag] = useState('all');
  
  // Simulated fetch of articles data
  useEffect(() => {
    // This would be an API call in a real app
    const fetchArticles = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
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
          featured: true
        },
        {
          id: 2,
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
          id: 3,
          title: 'Microservices Architecture with Node.js and Docker',
          excerpt: 'A comprehensive guide to building and deploying microservices using Node.js, Express, and Docker containers.',
          coverImage: '/api/placeholder/640/360',
          author: {
            id: 3,
            name: 'Michael Johnson',
            avatar: '/api/placeholder/40/40',
            username: 'michaelj'
          },
          publishedAt: '2023-05-10T09:15:00Z',
          readTime: 15,
          tags: ['node.js', 'microservices', 'docker'],
          commentsCount: 32,
          likesCount: 210,
          bookmarked: false,
          featured: false
        },
        {
          id: 4,
          title: 'CSS Grid vs Flexbox: When to Use Each Layout System',
          excerpt: 'Understand the strengths and weaknesses of CSS Grid and Flexbox to choose the right layout system for your projects.',
          coverImage: '/api/placeholder/640/360',
          author: {
            id: 4,
            name: 'Emma Patel',
            avatar: '/api/placeholder/40/40',
            username: 'emmapatel'
          },
          publishedAt: '2023-05-08T16:20:00Z',
          readTime: 6,
          tags: ['css', 'frontend', 'web design'],
          commentsCount: 15,
          likesCount: 98,
          bookmarked: false,
          featured: false
        },
        {
          id: 5,
          title: 'Building a Real-time Chat Application with Socket.io',
          excerpt: 'Learn how to create a real-time chat application using Socket.io, React, and Express for seamless communication.',
          coverImage: '/api/placeholder/640/360',
          author: {
            id: 5,
            name: 'David Kim',
            avatar: '/api/placeholder/40/40',
            username: 'davidkim'
          },
          publishedAt: '2023-05-06T11:30:00Z',
          readTime: 10,
          tags: ['socket.io', 'react', 'node.js'],
          commentsCount: 27,
          likesCount: 173,
          bookmarked: true,
          featured: true
        },
        {
          id: 6,
          title: 'Introduction to GraphQL for REST API Developers',
          excerpt: 'Transitioning from REST to GraphQL? This guide covers everything you need to know about this powerful query language.',
          coverImage: '/api/placeholder/640/360',
          author: {
            id: 6,
            name: 'Olivia Martinez',
            avatar: '/api/placeholder/40/40',
            username: 'oliviam'
          },
          publishedAt: '2023-05-04T13:45:00Z',
          readTime: 9,
          tags: ['graphql', 'api', 'backend'],
          commentsCount: 21,
          likesCount: 132,
          bookmarked: false,
          featured: false
        },
      ];
      
      setArticles(mockArticles);
      setLoading(false);
    };
    
    fetchArticles();
  }, []);
  
  // Filter articles based on active tab
  const filteredArticles = articles.filter(article => {
    if (activeTab === 'featured') return article.featured;
    if (activeTab === 'latest') return true; // All articles sorted by date
    if (activeTab === 'popular') return article.likesCount > 100;
    if (activeTab === 'bookmarked') return article.bookmarked;
    return true;
  });
  
  // Further filter by tag if on featured tab
  const displayedArticles = featuredTag === 'all' 
    ? filteredArticles 
    : filteredArticles.filter(article => article.tags.includes(featuredTag));
  
  // Popular tags
  const popularTags = [
    { id: 'all', name: 'All' },
    { id: 'react', name: 'React' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'typescript', name: 'TypeScript' },
    { id: 'node.js', name: 'Node.js' },
    { id: 'frontend', name: 'Frontend' },
  ];
  
  return (
    <div>
      {/* Hero section */}
      <section className="bg-gradient-to-br from-primary-50 to-white rounded-2xl p-8 mb-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Share Your <span className="text-primary-600">Coding Knowledge</span> With The World
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 mb-8">
            A community of developers sharing insights, tutorials, and best practices
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/editor" 
              className="btn-primary btn-lg"
            >
              Start Writing
            </Link>
            <Link 
              to="/explore" 
              className="btn-outline btn-lg"
            >
              Explore Articles
            </Link>
          </div>
        </div>
      </section>
      
      {/* Main content section */}
      <section>
        {/* Tabs */}
        <div className="flex items-center mb-8 overflow-x-auto pb-2">
          <div className="flex space-x-1 bg-neutral-100 p-1 rounded-lg">
            <button
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === 'featured'
                  ? 'bg-white text-neutral-900 shadow-soft'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              onClick={() => setActiveTab('featured')}
            >
              <Award className="h-4 w-4 mr-1.5" />
              Featured
            </button>
            <button
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === 'latest'
                  ? 'bg-white text-neutral-900 shadow-soft'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              onClick={() => setActiveTab('latest')}
            >
              <Clock className="h-4 w-4 mr-1.5" />
              Latest
            </button>
            <button
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === 'popular'
                  ? 'bg-white text-neutral-900 shadow-soft'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              onClick={() => setActiveTab('popular')}
            >
              <TrendingUp className="h-4 w-4 mr-1.5" />
              Popular
            </button>
            <button
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                activeTab === 'bookmarked'
                  ? 'bg-white text-neutral-900 shadow-soft'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              onClick={() => setActiveTab('bookmarked')}
            >
              <Bookmark className="h-4 w-4 mr-1.5" />
              Bookmarked
            </button>
          </div>
          
          <div className="ml-auto flex items-center">
            <button className="flex items-center px-3 py-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 border border-neutral-300 rounded-md bg-white">
              <Filter className="h-4 w-4 mr-1.5" />
              Filter
            </button>
          </div>
        </div>
        
        {/* Featured tags (only show for featured tab) */}
        {activeTab === 'featured' && (
          <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2">
            {popularTags.map(tag => (
              <button
                key={tag.id}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
                  featuredTag === tag.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
                onClick={() => setFeaturedTag(tag.id)}
              >
                {tag.id !== 'all' && <span className="mr-1">#</span>}
                {tag.name}
              </button>
            ))}
          </div>
        )}
        
        {/* Loading state */}
        {loading ? (
          <div className="space-y-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-neutral-200 rounded-xl mb-4"></div>
                <div className="h-8 bg-neutral-200 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-neutral-200 rounded mb-2 w-1/2"></div>
                <div className="flex items-center mt-4">
                  <div className="h-10 w-10 rounded-full bg-neutral-200 mr-3"></div>
                  <div>
                    <div className="h-4 bg-neutral-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-neutral-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Articles grid */}
            {displayedArticles.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
                <h3 className="text-xl font-semibold text-neutral-800 mb-2">No articles found</h3>
                <p className="text-neutral-500 mb-6">
                  {activeTab === 'bookmarked' 
                    ? "You haven't bookmarked any articles yet"
                    : "There are no articles that match your criteria"}
                </p>
                <Link to="/explore" className="btn-primary">
                  Explore Articles
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedArticles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
            
            {/* Show more button */}
            {displayedArticles.length > 0 && (
              <div className="text-center mt-12">
                <button className="btn-outline">
                  Show More Articles
                </button>
              </div>
            )}
          </>
        )}
      </section>
      
      {/* Categories section */}
      <section className="mt-16 pt-8 border-t border-neutral-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">Popular Categories</h2>
          <Link to="/explore" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/category/javascript" className="block p-6 bg-gradient-to-br from-yellow-50 to-amber-50 border border-amber-100 rounded-xl hover:shadow-soft-md transition-shadow">
            <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 mb-4">
              <Code className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">JavaScript</h3>
            <p className="text-sm text-neutral-600 mb-3">Modern JavaScript concepts, tips, and best practices</p>
            <span className="text-xs font-medium text-neutral-500">842 articles</span>
          </Link>
          
          <Link to="/category/react" className="block p-6 bg-gradient-to-br from-sky-50 to-blue-50 border border-blue-100 rounded-xl hover:shadow-soft-md transition-shadow">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
              <Code className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">React</h3>
            <p className="text-sm text-neutral-600 mb-3">Component design, hooks, state management, and more</p>
            <span className="text-xs font-medium text-neutral-500">765 articles</span>
          </Link>
          
          <Link to="/category/node" className="block p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-emerald-100 rounded-xl hover:shadow-soft-md transition-shadow">
            <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mb-4">
              <Server className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">Node.js</h3>
            <p className="text-sm text-neutral-600 mb-3">Server-side JavaScript, APIs, and backend development</p>
            <span className="text-xs font-medium text-neutral-500">531 articles</span>
          </Link>
          
          <Link to="/category/typescript" className="block p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl hover:shadow-soft-md transition-shadow">
            <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
              <Code className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">TypeScript</h3>
            <p className="text-sm text-neutral-600 mb-3">Type systems, interfaces, and advanced patterns</p>
            <span className="text-xs font-medium text-neutral-500">478 articles</span>
          </Link>
        </div>
      </section>
      
      {/* Call to action */}
      <section className="mt-16 bg-gradient-to-r from-primary-100 to-primary-50 rounded-2xl p-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
          Ready to Share Your Knowledge?
        </h2>
        <p className="text-lg text-neutral-700 mb-6 max-w-2xl mx-auto">
          Join our community of developers and share your coding expertise with readers from around the world.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            to="/editor" 
            className="btn-primary"
          >
            Start Writing
          </Link>
          <Link 
            to="/about" 
            className="btn-secondary"
          >
            Learn More
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;