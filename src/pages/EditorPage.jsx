// src/pages/EditorPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, Send, AlertTriangle, Clock, RefreshCw, 
  ListOrdered, Layout, Info, HelpCircle
} from 'lucide-react';
import CodeBlogEditor from '../components/code/CodeBlogEditor';
import { 
  loadPostForEditing,
  savePost,
  clearEditorState,
  updateTitle,
  updateContent
} from '../store/slices/editorSlice';
import { addToast } from '../store/slices/uiSlice';

const EditorPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { postId } = useParams();
  const { 
    isAuthenticated, 
    user 
  } = useSelector(state => state.auth);
  const { 
    content, title, tags, isDraft, isPublished, codeSnippets, 
    lastSaved, loading, error, unsavedChanges, saveStatus
  } = useSelector(state => state.editor);
  
  const [showHelp, setShowHelp] = useState(false);
  const [exitingWithChanges, setExitingWithChanges] = useState(false);
  
  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login', { state: { redirectTo: `/new-story` } });
    }
  }, [isAuthenticated, navigate]);
  
  // Load post data if editing an existing post
  useEffect(() => {
    if (postId && isAuthenticated) {
      dispatch(loadPostForEditing(postId));
    } else if (!postId) {
      // Clear editor state for new post
      dispatch(clearEditorState());
    }
    
    // Cleanup function
    return () => {
      // Ask for confirmation if there are unsaved changes
      if (unsavedChanges) {
        const confirmLeave = window.confirm(
          'You have unsaved changes. Are you sure you want to leave?'
        );
        if (!confirmLeave) {
          return;
        }
      }
    };
  }, [dispatch, postId, isAuthenticated]);
  
  // Handle page exit with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [unsavedChanges]);
  
  // Handle save post
  const handleSave = async (postData) => {
    try {
      await dispatch(savePost(postData)).unwrap();
      
      dispatch(addToast({
        type: 'success',
        message: postData.isDraft ? 'Draft saved successfully!' : 'Post published successfully!',
        duration: 3000,
      }));
      
      if (!postData.isDraft) {
        // Navigate to post view if published
        navigate(`/post/${postId || postData.id}`);
      } else if (!postId) {
        // Navigate to edit page if it's a new post being saved as draft
        navigate(`/edit/${postData.id}`);
      }
    } catch (error) {
      dispatch(addToast({
        type: 'error',
        message: `Failed to save post: ${error.message}`,
        duration: 5000,
      }));
    }
  };
  
  // Handle publish post
  const handlePublish = async (postData) => {
    try {
      const publishData = { ...postData, isDraft: false };
      await dispatch(savePost(publishData)).unwrap();
      
      dispatch(addToast({
        type: 'success',
        message: 'Post published successfully!',
        duration: 3000,
      }));
      
      navigate(`/post/${postId || publishData.id}`);
    } catch (error) {
      dispatch(addToast({
        type: 'error',
        message: `Failed to publish post: ${error.message}`,
        duration: 5000,
      }));
    }
  };
  
  // Handle exit without saving
  const handleExit = () => {
    if (unsavedChanges) {
      setExitingWithChanges(true);
    } else {
      navigate(-1);
    }
  };
  
  // Format last saved time
  const formatLastSaved = (timestamp) => {
    if (!timestamp) return 'Not saved yet';
    
    const now = new Date();
    const savedDate = new Date(timestamp);
    const diffMs = now - savedDate;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    
    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    
    return savedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw size={40} className="mx-auto mb-4 animate-spin text-primary" />
          <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">
            Loading editor...
          </h2>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <AlertTriangle size={40} className="mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            Failed to load editor
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {error}
          </p>
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Go Back
            </button>
            <button
              onClick={() => dispatch(loadPostForEditing(postId))}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Helper props for the editor
  const editorProps = {
    initialContent: content,
    onSave: handleSave,
    onPublish: handlePublish,
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header bar */}
      <div className="sticky top-16 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm py-2 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleExit}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              title="Back"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-lg font-medium text-gray-900 dark:text-white">
                {postId ? 'Edit Post' : 'New Post'}
              </h1>
              {lastSaved && (
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <Clock size={12} className="mr-1" />
                  {saveStatus === 'saving' ? (
                    <span className="flex items-center">
                      <RefreshCw size={12} className="mr-1 animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    <span>Last saved: {formatLastSaved(lastSaved)}</span>
                  )}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className={`p-2 rounded-md ${
                showHelp 
                  ? 'bg-gray-100 dark:bg-gray-800 text-primary'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title="Help"
            >
              <HelpCircle size={20} />
            </button>
            
            <button
              className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => handleSave({ title, content, tags, codeSnippets, isDraft: true })}
              disabled={saveStatus === 'saving'}
            >
              {saveStatus === 'saving' ? (
                <>
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  <span>Save Draft</span>
                </>
              )}
            </button>
            
            <button
              className="flex items-center px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md"
              onClick={() => handlePublish({ title, content, tags, codeSnippets })}
              disabled={saveStatus === 'saving'}
            >
              <Send size={16} className="mr-2" />
              <span>Publish</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Help panel */}
      {showHelp && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4">
          <div className="max-w-5xl mx-auto px-4">
            <h3 className="text-sm font-semibold mb-2">Editor Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-semibold mb-1 flex items-center">
                  <Layout size={14} className="mr-1.5 text-primary" />
                  Content Structure
                </h4>
                <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-300">
                  <li>- Use headings to organize your content (H1, H2, H3)</li>
                  <li>- Add code snippets with the code block button</li>
                  <li>- Include images to illustrate concepts</li>
                  <li>- Use bullet points and numbered lists for clarity</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-semibold mb-1 flex items-center">
                  <ListOrdered size={14} className="mr-1.5 text-primary" />
                  Best Practices
                </h4>
                <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-300">
                  <li>- Start with an engaging title and introduction</li>
                  <li>- Use code examples to demonstrate concepts</li>
                  <li>- Add up to 5 relevant tags to help readers find your post</li>
                  <li>- Use the preview function to check how your post looks</li>
                </ul>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <button
                className="text-xs text-primary hover:text-primary-dark font-medium"
                onClick={() => setShowHelp(false)}
              >
                Close Help
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main editor content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <CodeBlogEditor {...editorProps} />
      </div>
      
      {/* Exit confirmation dialog */}
      {exitingWithChanges && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-80 transition-opacity"
              onClick={() => setExitingWithChanges(false)}
            ></div>
            
            <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-900 text-left shadow-xl transition-all sm:my-8 sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Unsaved Changes
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        You have unsaved changes that will be lost if you leave this page. Are you sure you want to exit?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setExitingWithChanges(false);
                    navigate(-1);
                  }}
                >
                  Exit Without Saving
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-900 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setExitingWithChanges(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    handleSave({ title, content, tags, codeSnippets, isDraft: true });
                    setExitingWithChanges(false);
                  }}
                >
                  Save & Exit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorPage;