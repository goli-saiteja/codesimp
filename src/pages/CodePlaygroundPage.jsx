// src/pages/CodePlaygroundPage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Terminal, Code, Save, Download, Share2, Plus, Folder, Star, 
  ChevronDown, ChevronUp, Settings, RefreshCw, Github, Copy, Check,
  CloudUpload, List, Grid, PlayCircle, Edit, Trash, Users, Eye, 
  EyeOff, BookOpen, Lock, Unlock, ArrowRight, Info, Zap, Cloud, 
  AlertCircle, XCircle
} from 'lucide-react';
import CodeExecutionEngine from '../components/playground/CodeExecutionEngine';
import AICodeReviewer from '../components/ai/AICodeReviewer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  saveCodeSnippet, 
  deleteCodeSnippet, 
  updateCodeSnippetVisibility, 
  fetchUserSnippets 
} from '../store/slices/playgroundSlice';

// Supported languages and their configurations
const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', icon: <Code size={16} />, color: '#f7df1e', extension: 'js' },
  { id: 'typescript', name: 'TypeScript', icon: <Code size={16} />, color: '#3178c6', extension: 'ts' },
  { id: 'python', name: 'Python', icon: <Terminal size={16} />, color: '#3776ab', extension: 'py' },
  { id: 'java', name: 'Java', icon: <Coffee size={16} />, color: '#b07219', extension: 'java' },
  { id: 'go', name: 'Go', icon: <Code size={16} />, color: '#00add8', extension: 'go' },
  { id: 'rust', name: 'Rust', icon: <Code size={16} />, color: '#dea584', extension: 'rs' },
  { id: 'cpp', name: 'C++', icon: <Code size={16} />, color: '#f34b7d', extension: 'cpp' },
  { id: 'ruby', name: 'Ruby', icon: <Code size={16} />, color: '#701516', extension: 'rb' },
  { id: 'php', name: 'PHP', icon: <Code size={16} />, color: '#4F5D95', extension: 'php' },
  { id: 'csharp', name: 'C#', icon: <Code size={16} />, color: '#178600', extension: 'cs' },
  { id: 'html', name: 'HTML', icon: <Code size={16} />, color: '#e34c26', extension: 'html' },
  { id: 'css', name: 'CSS', icon: <Code size={16} />, color: '#563d7c', extension: 'css' },
];

// Mock data for community snippets
const COMMUNITY_SNIPPETS = [
  {
    id: 'c1',
    title: 'React Custom Hook for API Calls',
    description: 'A reusable custom hook for managing async API requests in React',
    language: 'javascript',
    author: {
      id: 'u1',
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/41.jpg'
    },
    stars: 128,
    forks: 42,
    views: 1245,
    createdAt: '2025-04-15T09:32:00Z',
    isPublic: true,
  },
  {
    id: 'c2',
    title: 'Python Data Visualization Helpers',
    description: 'Helper functions for creating common data visualizations with matplotlib and seaborn',
    language: 'python',
    author: {
      id: 'u2',
      name: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    stars: 97,
    forks: 24,
    views: 876,
    createdAt: '2025-04-28T14:18:00Z',
    isPublic: true,
  },
  {
    id: 'c3',
    title: 'TypeScript Utility Types',
    description: 'Collection of helpful TypeScript utility types for better type-safety',
    language: 'typescript',
    author: {
      id: 'u3',
      name: 'Emma Wilson',
      avatar: 'https://randomuser.me/api/portraits/women/29.jpg'
    },
    stars: 156,
    forks: 33,
    views: 1567,
    createdAt: '2025-05-02T11:47:00Z',
    isPublic: true,
  },
  {
    id: 'c4',
    title: 'Go Concurrency Patterns',
    description: 'Practical examples of Go concurrency patterns and best practices',
    language: 'go',
    author: {
      id: 'u4',
      name: 'Alex Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
    },
    stars: 218,
    forks: 73,
    views: 2345,
    createdAt: '2025-05-08T08:25:00Z',
    isPublic: true,
  },
];

// Default code snippets for new playground sessions
const DEFAULT_SNIPPETS = {
  javascript: `// JavaScript Playground
console.log("Hello, world!");

// Define a function
function greet(name) {
  return \`Hello, \${name}!\`;
}

// Use the function
const message = greet("JavaScript");
console.log(message);

// Array operations with modern JS
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);
console.log(doubled);

// Async/await example
async function fetchData() {
  try {
    // Simulated API call
    const data = await Promise.resolve({ success: true, message: "Data fetched successfully!" });
    console.log(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchData();`,
  
  python: `# Python Playground
print("Hello, world!")

# Define a function
def greet(name):
    return f"Hello, {name}!"

# Use the function
message = greet("Python")
print(message)

# List operations
numbers = [1, 2, 3, 4, 5]
doubled = [num * 2 for num in numbers]
print(doubled)

# Class example
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def introduce(self):
        return f"Hi, I'm {self.name} and I'm {self.age} years old."

# Create an instance
person = Person("Alice", 30)
print(person.introduce())`,
  
  typescript: `// TypeScript Playground
console.log("Hello, world!");

// Define a type
type Person = {
  name: string;
  age: number;
  skills: string[];
};

// Create an instance
const person: Person = {
  name: "Alice",
  age: 30,
  skills: ["TypeScript", "React", "Node.js"]
};

// Function with types
function introduce(person: Person): string {
  return \`Hi, I'm \${person.name}, \${person.age} years old, and I know \${person.skills.join(", ")}\`;
}

console.log(introduce(person));

// Generic function
function getFirst<T>(array: T[]): T | undefined {
  return array.length > 0 ? array[0] : undefined;
}

const firstSkill = getFirst(person.skills);
console.log("First skill:", firstSkill);`,
  
  go: `// Go Playground
package main

import (
	"fmt"
	"sync"
	"time"
)

func main() {
	fmt.Println("Hello, world!")
	
	// Basic function
	greeting := greet("Go")
	fmt.Println(greeting)
	
	// Goroutines and channels
	ch := make(chan string, 2)
	
	wg := sync.WaitGroup{}
	wg.Add(2)
	
	// Sender goroutine
	go func() {
		defer wg.Done()
		ch <- "Hello"
		ch <- "from goroutine!"
	}()
	
	// Receiver goroutine
	go func() {
		defer wg.Done()
		for i := 0; i < 2; i++ {
			msg := <-ch
			fmt.Println(msg)
		}
	}()
	
	wg.Wait()
}

func greet(name string) string {
	return fmt.Sprintf("Hello, %s!", name)
}`,
};

// The CodePlayground component
const CodePlaygroundPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { snippetId } = useParams();
  const { darkMode } = useSelector(state => state.ui);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { snippets, loading, error } = useSelector(state => state.playground);
  
  const [activeLanguage, setActiveLanguage] = useState('javascript');
  const [code, setCode] = useState(DEFAULT_SNIPPETS.javascript);
  const [showSettings, setShowSettings] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarTab, setSidebarTab] = useState('my-snippets');
  const [viewMode, setViewMode] = useState('grid');
  const [showAIReview, setShowAIReview] = useState(false);
  const [runCount, setRunCount] = useState(0);
  const [isCodeSaving, setIsCodeSaving] = useState(false);
  const [savedStatusMessage, setSavedStatusMessage] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newSnippetTitle, setNewSnippetTitle] = useState('');
  const [newSnippetVisibility, setNewSnippetVisibility] = useState('private');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [output, setOutput] = useState('');
  const [executionStats, setExecutionStats] = useState(null);
  
  // Find active language configuration
  const activeLangConfig = LANGUAGES.find(lang => lang.id === activeLanguage);
  
  // Fetch user snippets on component mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserSnippets());
    }
  }, [isAuthenticated, dispatch]);
  
  // Load snippet if ID is provided in URL
  useEffect(() => {
    if (snippetId) {
      // Find snippet in user's snippets
      const userSnippet = snippets.find(s => s.id === snippetId);
      
      if (userSnippet) {
        setActiveLanguage(userSnippet.language);
        setCode(userSnippet.code);
        setNewSnippetTitle(userSnippet.title);
        setNewSnippetVisibility(userSnippet.isPublic ? 'public' : 'private');
      } else {
        // If not found in user snippets, check community snippets
        const communitySnippet = COMMUNITY_SNIPPETS.find(s => s.id === snippetId);
        
        if (communitySnippet) {
          // For demo purposes, we don't have the actual code content for community snippets
          // In a real app, we would fetch the code content from the API
          setActiveLanguage(communitySnippet.language);
          setCode(DEFAULT_SNIPPETS[communitySnippet.language] || '// Code content would be loaded here');
          setNewSnippetTitle(communitySnippet.title);
          setNewSnippetVisibility('public');
        } else {
          // Snippet not found
          showSnackbar("Snippet not found or you don't have access to it", 'error');
          navigate('/playground');
        }
      }
    } else {
      // New playground session, no snippet ID provided
      // Use default code for active language
      setCode(DEFAULT_SNIPPETS[activeLanguage] || '');
    }
  }, [snippetId, snippets, navigate]);
  
  // Handle language change
  const handleLanguageChange = (languageId) => {
    setActiveLanguage(languageId);
    
    // Load default code for selected language if it's a new snippet
    if (!snippetId) {
      setCode(DEFAULT_SNIPPETS[languageId] || '');
    }
  };
  
  // Handle code execution
  const handleRunCode = () => {
    setExecuting(true);
    setOutput('');
    setExecutionStats(null);
    
    // Increment run count to trigger execution in the CodeExecutionEngine component
    setRunCount(prev => prev + 1);
    
    // Simulate execution delay
    setTimeout(() => {
      setExecuting(false);
      
      // Execution stats would come from the actual code execution in a real implementation
      setExecutionStats({
        executionTime: Math.random() * 100 + 10, // ms
        memoryUsage: Math.random() * 20 + 5, // MB
        cpuUsage: Math.random() * 50 + 10, // %
      });
    }, 1000);
  };
  
  // Show snackbar notification
  const showSnackbar = (message, type = 'info') => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
    
    // Hide after 3 seconds
    setTimeout(() => {
      setSnackbarVisible(false);
    }, 3000);
  };
  
  // Handle save code snippet
  const handleSaveSnippet = () => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
    
    if (newSnippetTitle.trim() === '') {
      showSnackbar('Please enter a title for your snippet', 'error');
      return;
    }
    
    setIsCodeSaving(true);
    
    const snippetData = {
      id: snippetId || `snippet-${Date.now()}`,
      title: newSnippetTitle,
      language: activeLanguage,
      code,
      isPublic: newSnippetVisibility === 'public',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Simulate API call delay
    setTimeout(() => {
      dispatch(saveCodeSnippet(snippetData));
      
      setIsCodeSaving(false);
      setShowSaveDialog(false);
      
      if (!snippetId) {
        // If it's a new snippet, navigate to the snippet page
        navigate(`/playground/${snippetData.id}`);
      }
      
      showSnackbar('Snippet saved successfully!', 'success');
      setSavedStatusMessage('Saved just now');
    }, 1000);
  };
  
  // Handle delete snippet
  const handleDeleteSnippet = () => {
    if (!snippetId) return;
    
    if (window.confirm('Are you sure you want to delete this snippet? This action cannot be undone.')) {
      dispatch(deleteCodeSnippet(snippetId));
      navigate('/playground');
      showSnackbar('Snippet deleted successfully', 'success');
    }
  };
  
  // Handle share snippet
  const handleShareSnippet = () => {
    if (!snippetId) {
      // If snippet is not saved yet, show save dialog first
      setShowSaveDialog(true);
      return;
    }
    
    setShowShareDialog(true);
  };
  
  // Copy share link to clipboard
  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/playground/${snippetId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedToClipboard(true);
    
    setTimeout(() => {
      setCopiedToClipboard(false);
    }, 2000);
  };
  
  // Handle download snippet
  const handleDownloadSnippet = () => {
    const extension = activeLangConfig?.extension || 'txt';
    const filename = `${newSnippetTitle || 'code-snippet'}.${extension}`;
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    showSnackbar(`Downloaded as ${filename}`, 'success');
  };
  
  // Get formatted elapsed time since last save
  const getElapsedTimeSinceLastSave = (timestamp) => {
    if (!timestamp) return 'Not saved yet';
    
    const now = new Date();
    const savedDate = new Date(timestamp);
    const diffMs = now - savedDate;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };
  
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900">
      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <AnimatePresence initial={false}>
          {showSidebar && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full flex flex-col z-10"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <Terminal size={20} className="mr-2 text-primary" />
                    Code Playground
                  </h2>
                  <button
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => setShowSidebar(false)}
                  >
                    <ChevronLeft size={20} />
                  </button>
                </div>
                
                <button
                  className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center"
                  onClick={() => {
                    navigate('/playground');
                    setNewSnippetTitle('');
                    setActiveLanguage('javascript');
                    setCode(DEFAULT_SNIPPETS.javascript);
                  }}
                >
                  <Plus size={16} className="mr-2" />
                  New Snippet
                </button>
              </div>
              
              {/* Sidebar tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  className={`flex-1 py-3 text-sm font-medium border-b-2 ${
                    sidebarTab === 'my-snippets'
                      ? 'border-primary text-primary dark:text-primary-light'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  onClick={() => setSidebarTab('my-snippets')}
                >
                  My Snippets
                </button>
                <button
                  className={`flex-1 py-3 text-sm font-medium border-b-2 ${
                    sidebarTab === 'community'
                      ? 'border-primary text-primary dark:text-primary-light'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  onClick={() => setSidebarTab('community')}
                >
                  Community
                </button>
              </div>
              
              {/* Snippets list */}
              <div className="flex-1 overflow-y-auto">
                {sidebarTab === 'my-snippets' ? (
                  isAuthenticated ? (
                    loading ? (
                      <div className="flex justify-center items-center h-32">
                        <RefreshCw size={24} className="text-primary animate-spin" />
                      </div>
                    ) : snippets.length > 0 ? (
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Your Snippets
                          </h3>
                          <div className="flex space-x-1">
                            <button
                              className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-gray-200 dark:bg-gray-700' : 'text-gray-500 dark:text-gray-400'}`}
                              onClick={() => setViewMode('list')}
                              title="List view"
                            >
                              <List size={16} />
                            </button>
                            <button
                              className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-gray-200 dark:bg-gray-700' : 'text-gray-500 dark:text-gray-400'}`}
                              onClick={() => setViewMode('grid')}
                              title="Grid view"
                            >
                              <Grid size={16} />
                            </button>
                          </div>
                        </div>
                        
                        {viewMode === 'grid' ? (
                          <div className="grid grid-cols-2 gap-3">
                            {snippets.map((snippet) => (
                              <div
                                key={snippet.id}
                                className={`border rounded-lg overflow-hidden transition-shadow hover:shadow-md cursor-pointer ${
                                  snippetId === snippet.id
                                    ? 'border-primary dark:border-primary-light'
                                    : 'border-gray-200 dark:border-gray-700'
                                }`}
                                onClick={() => navigate(`/playground/${snippet.id}`)}
                              >
                                <div className={`p-2 flex items-center ${
                                  snippetId === snippet.id
                                    ? 'bg-primary/10 dark:bg-primary/20'
                                    : 'bg-gray-50 dark:bg-gray-800'
                                }`}>
                                  <div
                                    className="w-2 h-2 rounded-full mr-2"
                                    style={{ 
                                      backgroundColor: LANGUAGES.find(l => l.id === snippet.language)?.color || '#888'
                                    }}
                                  ></div>
                                  <span className="text-xs font-medium truncate">
                                    {snippet.title}
                                  </span>
                                </div>
                                <div className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
                                  <span>{snippet.language}</span>
                                  <span className="flex items-center">
                                    {snippet.isPublic ? (
                                      <Unlock size={12} className="mr-1" />
                                    ) : (
                                      <Lock size={12} className="mr-1" />
                                    )}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {snippets.map((snippet) => (
                              <div
                                key={snippet.id}
                                className={`px-3 py-2 rounded-lg cursor-pointer flex items-center ${
                                  snippetId === snippet.id
                                    ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'
                                }`}
                                onClick={() => navigate(`/playground/${snippet.id}`)}
                              >
                                <div
                                  className="w-2 h-2 rounded-full mr-2"
                                  style={{ 
                                    backgroundColor: LANGUAGES.find(l => l.id === snippet.language)?.color || '#888'
                                  }}
                                ></div>
                                <div className="flex-1 truncate">
                                  {snippet.title}
                                </div>
                                <div className="flex items-center text-gray-500 dark:text-gray-400 space-x-2">
                                  <span className="text-xs">
                                    {snippet.language}
                                  </span>
                                  {snippet.isPublic ? (
                                    <Unlock size={14} />
                                  ) : (
                                    <Lock size={14} />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64 p-4">
                        <Folder size={48} className="text-gray-400 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 text-center mb-2">
                          You don't have any saved snippets yet
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                          Create a new snippet and save it to see it here
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 p-4">
                      <User size={48} className="text-gray-400 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 text-center mb-2">
                        Sign in to save your snippets
                      </p>
                      <Link 
                        to="/auth/login" 
                        className="mt-2 text-primary hover:text-primary-dark font-medium"
                      >
                        Sign In
                      </Link>
                    </div>
                  )
                ) : (
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Community Snippets
                      </h3>
                    </div>
                    
                    <div className="space-y-3">
                      {COMMUNITY_SNIPPETS.map((snippet) => (
                        <div
                          key={snippet.id}
                          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => navigate(`/playground/${snippet.id}`)}
                        >
                          <div className="p-3">
                            <div className="flex items-center mb-2">
                              <div
                                className="w-2 h-2 rounded-full mr-2"
                                style={{ 
                                  backgroundColor: LANGUAGES.find(l => l.id === snippet.language)?.color || '#888'
                                }}
                              ></div>
                              <span className="font-medium text-gray-900 dark:text-white truncate">
                                {snippet.title}
                              </span>
                            </div>
                            
                            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                              {snippet.description}
                            </p>
                            
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <div className="flex items-center mr-3">
                                <Star size={12} className="mr-1" />
                                <span>{snippet.stars}</span>
                              </div>
                              <div className="flex items-center mr-3">
                                <Code size={12} className="mr-1" />
                                <span>{snippet.forks}</span>
                              </div>
                              <div className="flex items-center">
                                <Eye size={12} className="mr-1" />
                                <span>{snippet.views}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="px-3 py-2 bg-gray-50 dark:bg-gray-900/30 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <div className="flex items-center">
                              <img 
                                src={snippet.author.avatar} 
                                alt={snippet.author.name} 
                                className="w-5 h-5 rounded-full mr-2"
                              />
                              <span className="text-xs text-gray-700 dark:text-gray-300">
                                {snippet.author.name}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(snippet.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-2 flex items-center">
            {/* Sidebar toggle */}
            {!showSidebar && (
              <button
                className="mr-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1.5 rounded-md"
                onClick={() => setShowSidebar(true)}
              >
                <Menu size={20} />
              </button>
            )}
            
            {/* Language selector */}
            <div className="mr-2">
              <select
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-1.5 pl-2 pr-8 text-sm focus:ring-primary focus:border-primary"
                value={activeLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Actions */}
            <div className="flex space-x-1">
              <button
                className="p-1.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center"
                onClick={handleRunCode}
                disabled={executing}
                title="Run code"
              >
                <PlayCircle size={20} className={executing ? 'animate-pulse text-primary' : ''} />
              </button>
              
              <button
                className="p-1.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                onClick={() => setShowSaveDialog(true)}
                title="Save snippet"
              >
                <Save size={20} />
              </button>
              
              <button
                className="p-1.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                onClick={handleShareSnippet}
                title="Share snippet"
              >
                <Share2 size={20} />
              </button>
              
              <button
                className="p-1.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                onClick={handleDownloadSnippet}
                title="Download snippet"
              >
                <Download size={20} />
              </button>
              
              <button
                className={`p-1.5 rounded-md ${
                  showAIReview 
                    ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setShowAIReview(!showAIReview)}
                title="AI Code Review"
              >
                <Zap size={20} />
              </button>
            </div>
            
            <div className="ml-auto flex items-center">
              {snippetId && (
                <div className="flex items-center mr-4 text-gray-500 dark:text-gray-400">
                  <Cloud size={16} className="mr-1" />
                  <span className="text-xs">{savedStatusMessage || 'Saved'}</span>
                </div>
              )}
              
              <button
                className="p-1.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                onClick={() => setShowSettings(!showSettings)}
                title="Settings"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>
          
          {/* Settings panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-hidden"
              >
                <div className="p-4">
                  <h3 className="text-sm font-semibold mb-2">Playground Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                          checked={true}
                          onChange={() => {}}
                        />
                        <span>Enable auto-formatting</span>
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                          checked={true}
                          onChange={() => {}}
                        />
                        <span>Enable intellisense</span>
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                          checked={false}
                          onChange={() => {}}
                        />
                        <span>Auto-save code</span>
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                          checked={true}
                          onChange={() => {}}
                        />
                        <span>Show performance metrics</span>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Main content - Code editor and output */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-hidden flex">
              {/* Code editor */}
              <div className={`flex-1 ${showAIReview ? 'lg:w-1/2' : 'w-full'}`}>
                <CodeExecutionEngine 
                  key={runCount}
                  language={activeLanguage}
                  onCodeChange={setCode}
                  code={code}
                />
              </div>
              
              {/* AI Code Review Panel */}
              {showAIReview && (
                <div className="hidden lg:block lg:w-1/2 border-l border-gray-200 dark:border-gray-700">
                  <AICodeReviewer 
                    code={code}
                    language={activeLanguage}
                    onFixSuggestion={(fix) => {
                      // In a real app, you might want to apply the fix directly to the code
                      console.log('Applying fix:', fix);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* AI Code Review Panel (Mobile) */}
      {showAIReview && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <Zap size={20} className="mr-2 text-primary" />
              AI Code Review
            </h3>
            <button
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={() => setShowAIReview(false)}
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="h-full overflow-auto">
            <AICodeReviewer 
              code={code}
              language={activeLanguage}
              onFixSuggestion={(fix) => {
                // In a real app, you might want to apply the fix directly to the code
                console.log('Applying fix:', fix);
              }}
            />
          </div>
        </div>
      )}
      
      {/* Save Dialog */}
      <AnimatePresence>
        {showSaveDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center"
            onClick={() => setShowSaveDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {snippetId ? 'Update Snippet' : 'Save Snippet'}
                </h3>
              </div>
              
              <div className="p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-800"
                    placeholder="My Awesome Snippet"
                    value={newSnippetTitle}
                    onChange={(e) => setNewSnippetTitle(e.target.value)}
                    autoFocus
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Visibility
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                        value="private"
                        checked={newSnippetVisibility === 'private'}
                        onChange={() => setNewSnippetVisibility('private')}
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Private
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                        value="public"
                        checked={newSnippetVisibility === 'public'}
                        onChange={() => setNewSnippetVisibility('public')}
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Public
                      </span>
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-between space-x-2">
                  {snippetId && (
                    <button
                      className="px-4 py-2 border border-red-300 text-red-600 dark:border-red-700 dark:text-red-400 rounded-md text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={handleDeleteSnippet}
                    >
                      Delete
                    </button>
                  )}
                  <div className={`${snippetId ? '' : 'ml-auto'} flex space-x-2`}>
                    <button
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => setShowSaveDialog(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md text-sm font-medium"
                      onClick={handleSaveSnippet}
                      disabled={isCodeSaving || !newSnippetTitle.trim()}
                    >
                      {isCodeSaving ? (
                        <>
                          <RefreshCw size={16} className="inline-block animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        'Save'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Share Dialog */}
      <AnimatePresence>
        {showShareDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center"
            onClick={() => setShowShareDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Share Snippet
                </h3>
              </div>
              
              <div className="p-4">
                {newSnippetVisibility === 'private' && (
                  <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-md flex items-start">
                    <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">This snippet is private</p>
                      <p className="text-xs mt-1">Only you can view this snippet. Change visibility to public to share with others.</p>
                      <button
                        className="mt-2 text-xs font-medium text-primary hover:text-primary-dark"
                        onClick={() => {
                          setNewSnippetVisibility('public');
                          dispatch(updateCodeSnippetVisibility({ id: snippetId, isPublic: true }));
                          showSnackbar('Snippet is now public', 'success');
                        }}
                      >
                        Make Public
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Share Link
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-l-md focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-800"
                      value={`${window.location.origin}/playground/${snippetId}`}
                      readOnly
                    />
                    <button
                      className={`px-3 py-2 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-700 ${
                        copiedToClipboard 
                          ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={copyShareLink}
                    >
                      {copiedToClipboard ? (
                        <Check size={18} />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md text-sm font-medium"
                    onClick={() => setShowShareDialog(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Snackbar notification */}
      <AnimatePresence>
        {snackbarVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
              <span>{snackbarMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper components
const ChevronLeft = ({ size = 24, className = '' }) => (
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
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const Menu = ({ size = 24, className = '' }) => (
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
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const X = ({ size = 24, className = '' }) => (
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
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const User = ({ size = 24, className = '' }) => (
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
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const Coffee = ({ size = 24, className = '' }) => (
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
    <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
    <line x1="6" y1="1" x2="6" y2="4"></line>
    <line x1="10" y1="1" x2="10" y2="4"></line>
    <line x1="14" y1="1" x2="14" y2="4"></line>
  </svg>
);

export default CodePlaygroundPage;