import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import RichTextEditor from '../components/editor/RichTextEditor';
import {
  Save, Send, ArrowLeft, Tag, Clock, AlertCircle, HelpCircle,
  Calendar, ChevronDown, X, CheckCircle, ExternalLink, Upload,
  UploadCloud, Check, Plus, Trash2, Settings, EyeOff
} from 'lucide-react';

const EditorPage = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // State for the article
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState('');
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [publishStatus, setPublishStatus] = useState('draft');
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [articleLinkType, setArticleLinkType] = useState('pretty'); // 'pretty' or 'simple'
  const [featuredArticle, setFeaturedArticle] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Auto-focus the title input when the page loads
  useEffect(() => {
    const titleInput = document.getElementById('article-title');
    if (titleInput) {
      titleInput.focus();
    }
  }, []);
  
  // Load article data if editing an existing article
  useEffect(() => {
    if (articleId) {
      // In a real app, you would fetch the article data from an API
      // This is just mock data for demonstration
      setTimeout(() => {
        setTitle('Building a Real-time Chat Application with Socket.io');
        setContent('<p>In this tutorial, we\'ll build a real-time chat application using Socket.io and React...</p><p>Socket.io is a powerful library that enables real-time, bidirectional communication between web clients and servers...</p>');
        setExcerpt('Learn how to create a real-time chat application using Socket.io, React, and Express for seamless communication.');
        setCoverImagePreview('/api/placeholder/1200/630');
        setTags(['socket.io', 'react', 'node.js', 'real-time']);
        setPublishStatus('draft');
        setFeaturedArticle(false);
      }, 500);
    }
  }, [articleId]);
  
  // Handle auto-save
  useEffect(() => {
    if (!autoSaveEnabled || !title || !content) return;
    
    const autoSaveTimer = setTimeout(() => {
      handleSave();
    }, 30000); // Auto-save every 30 seconds
    
    return () => clearTimeout(autoSaveTimer);
  }, [title, content, autoSaveEnabled]);
  
  // Handle content change
  const handleContentChange = (newContent) => {
    setContent(newContent);
  };
  
  // Handle cover image upload
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setCoverImage(file);
    setCoverImagePreview(URL.createObjectURL(file));
  };
  
  // Add a tag
  const addTag = () => {
    if (!currentTag.trim() || tags.includes(currentTag.trim().toLowerCase())) {
      return;
    }
    
    setTags([...tags, currentTag.trim().toLowerCase()]);
    setCurrentTag('');
  };
  
  // Remove a tag
  const removeTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  // Handle tag input keydown
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && currentTag === '') {
      e.preventDefault();
      const newTags = [...tags];
      newTags.pop();
      setTags(newTags);
    }
  };
  
  // Save the article
  const handleSave = async () => {
    if (!title) {
      setErrorMessage('Please enter a title');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    
    setIsSaving(true);
    
    try {
      // In a real app, you would make an API call to save the article
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLastSaved(new Date());
      setSuccessMessage('Article saved successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage('Failed to save article');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Publish the article
  const handlePublish = async () => {
    if (!title) {
      setErrorMessage('Please enter a title');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    
    if (!excerpt) {
      setErrorMessage('Please enter an excerpt');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    
    if (!coverImagePreview) {
      setErrorMessage('Please upload a cover image');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    
    if (tags.length === 0) {
      setErrorMessage('Please add at least one tag');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    
    setIsPublishing(true);
    
    try {
      // In a real app, you would make an API call to publish the article
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPublishStatus('published');
      setSuccessMessage('Article published successfully');
      setTimeout(() => {
        setSuccessMessage('');
        // Redirect to the published article
        navigate('/article/123/building-a-real-time-chat-application-with-socketio');
      }, 1500);
    } catch (error) {
      setErrorMessage('Failed to publish article');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsPublishing(false);
    }
  };
  
  // Generate article URL preview
  const getArticleUrlPreview = () => {
    if (!title) return 'example.com/article/...';
    
    const baseUrl = 'example.com/article/';
    
    if (articleLinkType === 'pretty') {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      
      return `${baseUrl}${slug}`;
    } else {
      return `${baseUrl}123456`;
    }
  };
  
  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Top bar */}
      <div className="flex items-center justify-between py-4 border-b border-neutral-200 mb-6">
        <button
          className="flex items-center text-neutral-600 hover:text-neutral-900"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span>Back</span>
        </button>
        
        <div className="flex items-center">
          {/* Auto-save status */}
          <div className="text-sm text-neutral-500 mr-4">
            {lastSaved ? (
              <span className="flex items-center">
                <CheckCircle className="h-4 w-4 text-success-500 mr-1" />
                Last saved {new Date(lastSaved).toLocaleTimeString()}
              </span>
            ) : autoSaveEnabled ? (
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Auto-save enabled
              </span>
            ) : (
              <span className="flex items-center">
                <AlertCircle className="h-4 w-4 text-warning-500 mr-1" />
                Auto-save disabled
              </span>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <button
              className="btn-outline btn-sm"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1.5" />
                  Save
                </>
              )}
            </button>
            
            <button
              className="btn-primary btn-sm"
              onClick={handlePublish}
              disabled={isPublishing}
            >
              {isPublishing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publishing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-1.5" />
                  Publish
                </>
              )}
            </button>
            
            <button
              className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-md"
              onClick={() => setShowSettings(!showSettings)}
              title="Article Settings"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Success and error messages */}
      {successMessage && (
        <div className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-md mb-6 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md mb-6 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {errorMessage}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main editor area */}
        <div className="lg:col-span-2">
          {/* Title input */}
          <div className="mb-6">
            <input
              id="article-title"
              type="text"
              className="w-full border-0 border-b border-neutral-200 p-0 text-3xl font-bold text-neutral-900 focus:ring-0 focus:border-primary-500"
              placeholder="Enter your article title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          {/* Rich text editor */}
          <div className="mb-6">
            <RichTextEditor
              initialContent={content}
              onChange={handleContentChange}
              placeholder="Write your article here..."
              minHeight="500px"
            />
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Cover image */}
          <div className="card p-4 mb-6">
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">Cover Image</h3>
            
            {coverImagePreview ? (
              <div className="relative rounded-lg overflow-hidden mb-3">
                <img
                  src={coverImagePreview}
                  alt="Cover preview"
                  className="w-full h-40 object-cover"
                />
                <button
                  className="absolute top-2 right-2 p-1 bg-neutral-900/70 text-white rounded-full hover:bg-neutral-900"
                  onClick={() => {
                    setCoverImage(null);
                    setCoverImagePreview('');
                  }}
                  title="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-4 text-center mb-3">
                <UploadCloud className="h-8 w-8 mx-auto text-neutral-400 mb-2" />
                <p className="text-sm text-neutral-500 mb-2">
                  Drag and drop an image, or click to browse
                </p>
                <p className="text-xs text-neutral-400">
                  Recommended size: 1200x630 pixels
                </p>
              </div>
            )}
            
            <label className="btn-secondary w-full flex items-center justify-center cursor-pointer">
              <Upload className="h-4 w-4 mr-1.5" />
              {coverImagePreview ? 'Replace Image' : 'Upload Image'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverImageChange}
              />
            </label>
          </div>
          
          {/* Excerpt */}
          <div className="card p-4 mb-6">
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">Excerpt</h3>
            <p className="text-xs text-neutral-500 mb-3">
              A brief summary of your article. This will be displayed on the article card and in search results.
            </p>
            <textarea
              className="form-input resize-none"
              rows="3"
              placeholder="Enter a brief excerpt of your article..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            ></textarea>
            <div className="text-xs text-neutral-500 mt-1 flex justify-between">
              <span>{excerpt.length} characters</span>
              <span>{160 - excerpt.length} characters remaining</span>
            </div>
          </div>
          
          {/* Tags */}
          <div className="card p-4 mb-6">
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">Tags</h3>
            <p className="text-xs text-neutral-500 mb-3">
              Add tags to help readers discover your article. Press Enter to add a tag.
            </p>
            
            <div className="mb-3">
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                  <div 
                    key={index} 
                    className="flex items-center bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-full text-sm"
                  >
                    <span>#{tag}</span>
                    <button
                      className="ml-1.5 text-neutral-500 hover:text-neutral-700"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center border border-neutral-300 rounded-md overflow-hidden">
                <div className="pl-3 text-neutral-400">
                  <Tag className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  className="flex-grow border-0 focus:ring-0 focus:outline-none py-2 px-2"
                  placeholder="Add a tag..."
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                />
                <button
                  className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
                  onClick={addTag}
                  disabled={!currentTag.trim()}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="text-xs text-neutral-500">
              <span className="font-medium">Popular tags:</span>{' '}
              <button 
                className="text-primary-600 hover:text-primary-700"
                onClick={() => setCurrentTag('javascript')}
              >
                javascript
              </button>
              {', '}
              <button 
                className="text-primary-600 hover:text-primary-700"
                onClick={() => setCurrentTag('react')}
              >
                react
              </button>
              {', '}
              <button 
                className="text-primary-600 hover:text-primary-700"
                onClick={() => setCurrentTag('tutorial')}
              >
                tutorial
              </button>
            </div>
          </div>
          
          {/* Help section */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-neutral-900 mb-2 flex items-center">
              <HelpCircle className="h-4 w-4 mr-1.5 text-primary-600" />
              Writing Tips
            </h3>
            <ul className="text-xs text-neutral-600 space-y-2">
              <li className="flex items-start">
                <Check className="h-3.5 w-3.5 text-success-500 mr-1.5 mt-0.5 flex-shrink-0" />
                Include a clear, descriptive title that captures the essence of your article
              </li>
              <li className="flex items-start">
                <Check className="h-3.5 w-3.5 text-success-500 mr-1.5 mt-0.5 flex-shrink-0" />
                Break up long paragraphs and use headings to improve readability
              </li>
              <li className="flex items-start">
                <Check className="h-3.5 w-3.5 text-success-500 mr-1.5 mt-0.5 flex-shrink-0" />
                Include code examples with explanations when relevant
              </li>
              <li className="flex items-start">
                <Check className="h-3.5 w-3.5 text-success-500 mr-1.5 mt-0.5 flex-shrink-0" />
                End with a conclusion that summarizes the main points
              </li>
            </ul>
            <a 
              href="/writing-guide" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-primary-600 hover:text-primary-700 mt-3 flex items-center"
            >
              View full writing guide
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </div>
      </div>
      
      {/* Article Settings Modal */}
      {showSettings && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/50" 
            onClick={() => setShowSettings(false)}
          ></div>
          <div className="fixed inset-y-0 right-0 z-50 w-80 bg-white shadow-lg overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
              <h3 className="text-lg font-semibold text-neutral-900">Article Settings</h3>
              <button
                className="text-neutral-500 hover:text-neutral-700"
                onClick={() => setShowSettings(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4">
              {/* Auto-save setting */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-neutral-900">Auto-save</label>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input 
                      type="checkbox" 
                      name="auto-save" 
                      id="auto-save"
                      className="sr-only"
                      checked={autoSaveEnabled}
                      onChange={() => setAutoSaveEnabled(!autoSaveEnabled)}
                    />
                    <label 
                      htmlFor="auto-save"
                      className={`block overflow-hidden h-5 rounded-full cursor-pointer transition-colors duration-200 ${
                        autoSaveEnabled ? 'bg-primary-600' : 'bg-neutral-300'
                      }`}
                    >
                      <span 
                        className={`dot block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 ${
                          autoSaveEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      ></span>
                    </label>
                  </div>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Save your article automatically every 30 seconds
                </p>
              </div>
              
              {/* URL type setting */}
              <div className="mb-6">
                <label className="text-sm font-medium text-neutral-900 block mb-2">Article URL Type</label>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <input
                      type="radio"
                      name="url-type"
                      id="url-type-pretty"
                      className="form-radio mt-0.5"
                      checked={articleLinkType === 'pretty'}
                      onChange={() => setArticleLinkType('pretty')}
                    />
                    <label htmlFor="url-type-pretty" className="ml-2">
                      <span className="text-sm font-medium text-neutral-900 block">Pretty URL</span>
                      <span className="text-xs text-neutral-500 block">{getArticleUrlPreview()}</span>
                    </label>
                  </div>
                  
                  <div className="flex items-start">
                    <input
                      type="radio"
                      name="url-type"
                      id="url-type-simple"
                      className="form-radio mt-0.5"
                      checked={articleLinkType === 'simple'}
                      onChange={() => setArticleLinkType('simple')}
                    />
                    <label htmlFor="url-type-simple" className="ml-2">
                      <span className="text-sm font-medium text-neutral-900 block">Simple URL</span>
                      <span className="text-xs text-neutral-500 block">example.com/article/123456</span>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Featured article setting */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-neutral-900">Featured Article</label>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input 
                      type="checkbox" 
                      name="featured" 
                      id="featured"
                      className="sr-only"
                      checked={featuredArticle}
                      onChange={() => setFeaturedArticle(!featuredArticle)}
                    />
                    <label 
                      htmlFor="featured"
                      className={`block overflow-hidden h-5 rounded-full cursor-pointer transition-colors duration-200 ${
                        featuredArticle ? 'bg-primary-600' : 'bg-neutral-300'
                      }`}
                    >
                      <span 
                        className={`dot block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 ${
                          featuredArticle ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      ></span>
                    </label>
                  </div>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Mark this article as featured on your profile and homepage
                </p>
              </div>
              
              {/* SEO settings */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-neutral-900 mb-2">SEO Settings</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-neutral-600 block mb-1">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      className="form-input text-sm"
                      placeholder="Enter meta title..."
                      defaultValue={title}
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                      Recommended length: 50-60 characters
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-neutral-600 block mb-1">
                      Meta Description
                    </label>
                    <textarea
                      className="form-input text-sm resize-none"
                      rows="2"
                      placeholder="Enter meta description..."
                      defaultValue={excerpt}
                    ></textarea>
                    <p className="text-xs text-neutral-500 mt-1">
                      Recommended length: 150-160 characters
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Danger zone */}
              <div className="border border-error-200 rounded-md p-3 bg-error-50">
                <h4 className="text-sm font-medium text-error-700 mb-2">Danger Zone</h4>
                <p className="text-xs text-error-600 mb-3">
                  These actions cannot be undone. Please be certain.
                </p>
                <button
                  className="flex items-center justify-center w-full px-3 py-2 rounded-md text-sm font-medium text-error-700 bg-white border border-error-300 hover:bg-error-50"
                  onClick={() => {
                    // Show a confirmation dialog before deleting
                    if (window.confirm('Are you sure you want to delete this article?')) {
                      navigate('/dashboard');
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  Delete Article
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EditorPage;