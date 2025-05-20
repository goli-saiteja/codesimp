// src/components/ai/AICodeReviewer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  AlertTriangle, CheckCircle, AlertCircle, Info, Code, Magic, 
  Terminal, RefreshCw, ChevronDown, ChevronUp, Copy, Check, 
  Tool, Search, BookOpen, Zap, Shield, XCircle, CornerUpRight, 
  List, BarChart2, Cpu, Lightning, FileText, Maximize2, Minimize2,
  MessageSquare, ThumbsUp, ThumbsDown, Filter, Sliders, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight, materialOceanic } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Simulated AI code review service
const simulateCodeReview = (code, language, options = {}) => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Generate analysis based on code patterns
      const codeLength = code.length;
      const lineCount = code.split('\n').length;
      const hasComments = code.includes('//') || code.includes('/*');
      
      // Detect common issues in code
      const issues = [];
      
      // Pattern matching for common issues
      if (language === 'javascript' || language === 'typescript') {
        // Console logs left in code
        if (code.match(/console\.log/g)) {
          issues.push({
            type: 'warning',
            title: 'Console statements found',
            description: 'Console statements should be removed from production code.',
            line: code.split('\n').findIndex(line => line.includes('console.log')),
            severity: 'medium',
            category: 'best-practices',
          });
        }
        
        // Potential memory leaks in React
        if (code.includes('useEffect') && !code.includes('return')) {
          issues.push({
            type: 'warning',
            title: 'Potential memory leak',
            description: 'useEffect hook may need cleanup function to prevent memory leaks.',
            line: code.split('\n').findIndex(line => line.includes('useEffect')),
            severity: 'high',
            category: 'performance',
          });
        }
        
        // Hardcoded values
        if (code.match(/api\.example\.com|http:\/\/localhost/g)) {
          issues.push({
            type: 'info',
            title: 'Hardcoded endpoint',
            description: 'Consider using environment variables for API endpoints.',
            line: code.split('\n').findIndex(line => line.includes('api.example.com') || line.includes('http://localhost')),
            severity: 'low',
            category: 'security',
          });
        }
        
        // == instead of ===
        if (code.match(/[^=!]==/g)) {
          issues.push({
            type: 'warning',
            title: 'Loose equality',
            description: 'Use === instead of == for strict equality comparison.',
            line: code.split('\n').findIndex(line => line.match(/[^=!]==/g)),
            severity: 'medium',
            category: 'best-practices',
          });
        }
        
        // Security issues - eval
        if (code.includes('eval(')) {
          issues.push({
            type: 'error',
            title: 'Unsafe eval() usage',
            description: 'Avoid using eval() as it executes arbitrary code and creates security vulnerabilities.',
            line: code.split('\n').findIndex(line => line.includes('eval(')),
            severity: 'critical',
            category: 'security',
          });
        }
      } else if (language === 'python') {
        // Print statements in Python
        if (code.match(/print\(/g)) {
          issues.push({
            type: 'info',
            title: 'Print statements found',
            description: 'Consider using logging instead of print statements.',
            line: code.split('\n').findIndex(line => line.includes('print(')),
            severity: 'low',
            category: 'best-practices',
          });
        }
        
        // Bare except clauses
        if (code.match(/except:/g)) {
          issues.push({
            type: 'warning',
            title: 'Bare except clause',
            description: 'Avoid bare "except:" clauses. Specify exceptions to catch.',
            line: code.split('\n').findIndex(line => line.match(/except:/g)),
            severity: 'medium',
            category: 'error-handling',
          });
        }
        
        // Using == instead of is with None
        if (code.match(/== None/g)) {
          issues.push({
            type: 'warning',
            title: 'Compare with "is None"',
            description: 'Use "is None" instead of "== None" for identity check.',
            line: code.split('\n').findIndex(line => line.includes('== None')),
            severity: 'low',
            category: 'best-practices',
          });
        }
      }
      
      // Generic issues
      if (!hasComments) {
        issues.push({
          type: 'info',
          title: 'Missing comments',
          description: 'Consider adding comments to improve code readability.',
          line: null,
          severity: 'low',
          category: 'documentation',
        });
      }
      
      // Generate random count for complexity issues
      const complexityCount = Math.floor(Math.random() * 3);
      for (let i = 0; i < complexityCount; i++) {
        const randomLine = Math.floor(Math.random() * lineCount);
        issues.push({
          type: 'info',
          title: 'Complex code section',
          description: 'Consider refactoring this section to reduce complexity.',
          line: randomLine,
          severity: 'medium',
          category: 'complexity',
        });
      }
      
      // Add simulated security issues based on options
      if (options.securityScan) {
        if (Math.random() > 0.7) {
          issues.push({
            type: 'error',
            title: 'Potential security vulnerability',
            description: 'Code may be vulnerable to injection attacks.',
            line: Math.floor(Math.random() * lineCount),
            severity: 'high',
            category: 'security',
          });
        }
      }
      
      // Filter issues based on severity if specified
      let filteredIssues = issues;
      if (options.minSeverity) {
        const severityLevels = {
          'low': 1,
          'medium': 2,
          'high': 3,
          'critical': 4,
        };
        
        filteredIssues = issues.filter(issue => 
          severityLevels[issue.severity] >= severityLevels[options.minSeverity]
        );
      }
      
      // Calculate scores
      const qualityScore = Math.max(0, Math.min(100, 100 - (filteredIssues.length * 5) - Math.floor(Math.random() * 20)));
      const securityScore = Math.max(0, Math.min(100, 100 - (filteredIssues.filter(i => i.category === 'security').length * 20) - Math.floor(Math.random() * 15)));
      const performanceScore = Math.max(0, Math.min(100, 100 - (filteredIssues.filter(i => i.category === 'performance').length * 15) - Math.floor(Math.random() * 25)));
      
      // Generate random suggestions
      const suggestions = [];
      
      if (language === 'javascript' || language === 'typescript') {
        suggestions.push({
          title: 'Use modern JavaScript features',
          description: 'Consider using optional chaining (?.) and nullish coalescing (??) operators for cleaner code.',
          example: `// Instead of:\nconst value = user && user.profile && user.profile.name;\n\n// Use:\nconst value = user?.profile?.name;`,
          category: 'modernization',
        });
        
        if (code.includes('function')) {
          suggestions.push({
            title: 'Consider using arrow functions',
            description: 'Arrow functions provide a more concise syntax and lexically bind the "this" value.',
            example: `// Instead of:\nfunction add(a, b) {\n  return a + b;\n}\n\n// Use:\nconst add = (a, b) => a + b;`,
            category: 'modernization',
          });
        }
        
        if (code.includes('for (')) {
          suggestions.push({
            title: 'Use array methods instead of loops',
            description: 'Array methods like map, filter, and reduce can make your code more readable and functional.',
            example: `// Instead of:\nconst doubled = [];\nfor (let i = 0; i < numbers.length; i++) {\n  doubled.push(numbers[i] * 2);\n}\n\n// Use:\nconst doubled = numbers.map(num => num * 2);`,
            category: 'modernization',
          });
        }
      } else if (language === 'python') {
        suggestions.push({
          title: 'Use list comprehensions',
          description: 'List comprehensions are more Pythonic and often more readable than for loops for simple transformations.',
          example: `# Instead of:\ndoubled = []\nfor num in numbers:\n    doubled.append(num * 2)\n\n# Use:\ndoubled = [num * 2 for num in numbers]`,
          category: 'pythonic',
        });
        
        if (code.includes('open(')) {
          suggestions.push({
            title: 'Use context managers for resources',
            description: 'Context managers (with statement) ensure resources are properly closed.',
            example: `# Instead of:\nf = open('file.txt', 'r')\ntry:\n    data = f.read()\nfinally:\n    f.close()\n\n# Use:\nwith open('file.txt', 'r') as f:\n    data = f.read()`,
            category: 'best-practices',
          });
        }
      }
      
      // Add performance suggestions
      suggestions.push({
        title: 'Optimize resource usage',
        description: 'Consider caching computed values to avoid redundant calculations.',
        example: `// Example of memoization:\nconst memoize = (fn) => {\n  const cache = {};\n  return (...args) => {\n    const key = JSON.stringify(args);\n    if (cache[key]) return cache[key];\n    const result = fn(...args);\n    cache[key] = result;\n    return result;\n  };\n};`,
        category: 'performance',
      });
      
      // Summarize review
      let summary = '';
      const issueTypes = {
        error: filteredIssues.filter(i => i.type === 'error').length,
        warning: filteredIssues.filter(i => i.type === 'warning').length,
        info: filteredIssues.filter(i => i.type === 'info').length,
      };
      
      if (filteredIssues.length === 0) {
        summary = 'No significant issues found. Great job!';
      } else if (issueTypes.error > 0) {
        summary = `Found ${filteredIssues.length} issues (${issueTypes.error} critical). Please address critical issues before proceeding.`;
      } else if (issueTypes.warning > 0) {
        summary = `Found ${filteredIssues.length} issues (${issueTypes.warning} warnings). Consider addressing these warnings to improve code quality.`;
      } else {
        summary = `Found ${filteredIssues.length} suggestions to enhance your code.`;
      }
      
      resolve({
        summary,
        issues: filteredIssues,
        suggestions,
        scores: {
          quality: qualityScore,
          security: securityScore,
          performance: performanceScore,
          maintainability: Math.floor((qualityScore + performanceScore) / 2)
        },
        metrics: {
          lineCount,
          codeSize: codeLength,
          cyclomatic_complexity: Math.floor(Math.random() * 10) + 1,
          cognitive_complexity: Math.floor(Math.random() * 15) + 1,
        },
        scan_settings: options,
        timestamp: new Date().toISOString(),
      });
    }, 1500);
  });
};

// AI-powered code reviewer component
const AICodeReviewer = ({ 
  code = '',
  language = 'javascript',
  title = 'AI Code Review',
  onFixSuggestion = () => {},
  showCodeEditor = true,
  onCodeChange = () => {},
  settings = { securityScan: true, minSeverity: 'low' }
}) => {
  const { darkMode } = useSelector(state => state.ui);
  const [codeToReview, setCodeToReview] = useState(code);
  const [reviewResult, setReviewResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('issues');
  const [collapsedSections, setCollapsedSections] = useState({});
  const [expandedIssue, setExpandedIssue] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [reviewSettings, setReviewSettings] = useState(settings);
  const [showSettings, setShowSettings] = useState(false);
  const [feedback, setFeedback] = useState({});
  const [message, setMessage] = useState('');
  const [fullscreen, setFullscreen] = useState(false);
  const containerRef = useRef(null);
  const reviewerRef = useRef(null);
  
  // Ensure code gets updated if prop changes
  useEffect(() => {
    setCodeToReview(code);
  }, [code]);
  
  // Run initial review
  useEffect(() => {
    if (codeToReview) {
      runCodeReview();
    }
  }, []);
  
  // Run the code review
  const runCodeReview = async () => {
    if (!codeToReview || isLoading) return;
    
    setIsLoading(true);
    try {
      const result = await simulateCodeReview(
        codeToReview, 
        language,
        reviewSettings
      );
      setReviewResult(result);
      setExpandedIssue(null);
    } catch (error) {
      console.error('Error running code review:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle section collapse
  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Expand an issue
  const toggleIssueExpand = (issueId) => {
    setExpandedIssue(expandedIssue === issueId ? null : issueId);
  };
  
  // Copy code suggestion
  const copyCodeExample = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };
  
  // Provide feedback on an issue
  const provideFeedback = (issueId, isHelpful) => {
    setFeedback(prev => ({
      ...prev,
      [issueId]: isHelpful
    }));
  };
  
  // Send a message to AI
  const sendMessage = () => {
    if (!message.trim()) return;
    
    // Here you would typically send the message to an API
    // For this example, we'll just clear the input
    setMessage('');
  };
  
  // Update a review setting
  const updateSetting = (key, value) => {
    setReviewSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Handle fullscreen mode
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setFullscreen(false);
      }
    };
    
    if (fullscreen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [fullscreen]);
  
  // Severity badge
  const SeverityBadge = ({ severity }) => {
    const colors = {
      low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[severity] || colors.low}`}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </span>
    );
  };
  
  // Category badge
  const CategoryBadge = ({ category }) => {
    const categories = {
      'security': { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', icon: <Shield size={12} /> },
      'performance': { color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300', icon: <Zap size={12} /> },
      'best-practices': { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', icon: <CheckCircle size={12} /> },
      'documentation': { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300', icon: <FileText size={12} /> },
      'complexity': { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300', icon: <BarChart2 size={12} /> },
      'error-handling': { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', icon: <AlertCircle size={12} /> },
      'modernization': { color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300', icon: <Cpu size={12} /> },
      'pythonic': { color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300', icon: <Terminal size={12} /> },
    };
    
    const categoryInfo = categories[category] || { 
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300', 
      icon: <Info size={12} /> 
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${categoryInfo.color}`}>
        <span className="mr-1">{categoryInfo.icon}</span>
        {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </span>
    );
  };
  
  // Issue icon based on type
  const getIssueIcon = (type, size = 16) => {
    switch (type) {
      case 'error':
        return <XCircle size={size} className="text-red-500" />;
      case 'warning':
        return <AlertTriangle size={size} className="text-yellow-500" />;
      case 'info':
        return <Info size={size} className="text-blue-500" />;
      default:
        return <AlertCircle size={size} className="text-gray-500" />;
    }
  };
  
  // Quality score color
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-emerald-500';
    if (score >= 50) return 'text-yellow-500';
    if (score >= 30) return 'text-orange-500';
    return 'text-red-500';
  };
  
  // Progress bar background
  const getProgressBackground = (score) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-emerald-500';
    if (score >= 50) return 'bg-yellow-500';
    if (score >= 30) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  return (
    <div 
      ref={containerRef}
      className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${
        fullscreen ? 'fixed inset-0 z-50' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <Magic size={20} className="mr-2 text-primary" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            className={`p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 ${
              showSettings ? 'bg-gray-100 dark:bg-gray-800' : ''
            }`}
            onClick={() => setShowSettings(!showSettings)}
            title="Review Settings"
          >
            <Sliders size={18} />
          </button>
          
          <button
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => runCodeReview()}
            disabled={isLoading}
            title="Run Review Again"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </button>
          
          <button
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => setFullscreen(!fullscreen)}
            title={fullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
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
            className="border-b border-gray-200 dark:border-gray-700"
          >
            <div className="p-4 bg-gray-50 dark:bg-gray-800">
              <h3 className="text-sm font-medium mb-3">Review Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                      checked={reviewSettings.securityScan}
                      onChange={() => updateSetting('securityScan', !reviewSettings.securityScan)}
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Security scan</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                      checked={reviewSettings.bestPractices !== false}
                      onChange={() => updateSetting('bestPractices', reviewSettings.bestPractices === false)}
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Best practices</span>
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                    Minimum severity level
                  </label>
                  <select
                    className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md"
                    value={reviewSettings.minSeverity}
                    onChange={(e) => updateSetting('minSeverity', e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <button
                  className="px-4 py-2 bg-primary text-white text-sm rounded-md hover:bg-primary-dark"
                  onClick={() => {
                    setShowSettings(false);
                    runCodeReview();
                  }}
                >
                  Apply & Scan
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main content */}
      <div className={`grid ${showCodeEditor ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} min-h-[400px]`}>
        {/* Code editor panel */}
        {showCodeEditor && (
          <div className="border-r border-gray-200 dark:border-gray-700">
            <div className="p-4 h-full flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-primary mr-2"></span>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {language.charAt(0).toUpperCase() + language.slice(1)} Code
                  </h3>
                </div>
                
                <div className="flex items-center">
                  <button
                    className="p-1.5 text-xs text-primary border border-primary/30 rounded hover:bg-primary/5"
                    onClick={() => runCodeReview()}
                  >
                    Analyze Code
                  </button>
                </div>
              </div>
              
              <div className="flex-1 rounded-md overflow-hidden">
                <SyntaxHighlighter
                  language={language.toLowerCase()}
                  style={darkMode ? materialOceanic : materialLight}
                  showLineNumbers
                  wrapLines
                  customStyle={{ margin: 0, height: '100%', borderRadius: 4 }}
                >
                  {codeToReview}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        )}
        
        {/* Review panel */}
        <div ref={reviewerRef} className="h-full flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                selectedTab === 'issues'
                  ? 'border-primary text-primary dark:border-primary-light dark:text-primary-light'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              onClick={() => setSelectedTab('issues')}
            >
              <div className="flex items-center">
                <AlertTriangle size={16} className="mr-2" />
                Issues
                {reviewResult?.issues?.length > 0 && (
                  <span className="ml-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-0.5 rounded-full text-xs">
                    {reviewResult.issues.length}
                  </span>
                )}
              </div>
            </button>
            
            <button
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                selectedTab === 'suggestions'
                  ? 'border-primary text-primary dark:border-primary-light dark:text-primary-light'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              onClick={() => setSelectedTab('suggestions')}
            >
              <div className="flex items-center">
                <Zap size={16} className="mr-2" />
                Suggestions
                {reviewResult?.suggestions?.length > 0 && (
                  <span className="ml-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-0.5 rounded-full text-xs">
                    {reviewResult.suggestions.length}
                  </span>
                )}
              </div>
            </button>
            
            <button
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                selectedTab === 'metrics'
                  ? 'border-primary text-primary dark:border-primary-light dark:text-primary-light'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              onClick={() => setSelectedTab('metrics')}
            >
              <div className="flex items-center">
                <BarChart2 size={16} className="mr-2" />
                Metrics
              </div>
            </button>
            
            <button
              className={`px-4 py-3 text-sm font-medium border-b-2 ${
                selectedTab === 'chat'
                  ? 'border-primary text-primary dark:border-primary-light dark:text-primary-light'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
              onClick={() => setSelectedTab('chat')}
            >
              <div className="flex items-center">
                <MessageSquare size={16} className="mr-2" />
                AI Chat
              </div>
            </button>
          </div>
          
          {/* Tab content */}
          <div className="flex-1 overflow-auto p-4">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <RefreshCw size={32} className="animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-gray-500 dark:text-gray-400">Analyzing your code...</p>
                </div>
              </div>
            ) : !reviewResult ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <AlertCircle size={32} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 dark:text-gray-400">No review data available.</p>
                  <button
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark text-sm"
                    onClick={runCodeReview}
                  >
                    Run Code Review
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Summary section at top of each tab */}
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  {selectedTab === 'issues' && (
                    <div className="flex items-start">
                      {reviewResult.issues.length === 0 ? (
                        <CheckCircle size={20} className="text-green-500 mr-3 mt-0.5" />
                      ) : (
                        getIssueIcon(
                          reviewResult.issues.some(i => i.type === 'error') ? 'error' : 
                          reviewResult.issues.some(i => i.type === 'warning') ? 'warning' : 'info',
                          20
                        )
                      )}
                      <div>
                        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                          {reviewResult.summary}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {reviewResult.issues.length === 0 
                            ? 'Your code looks great! No significant issues were found.'
                            : `${reviewResult.issues.filter(i => i.type === 'error').length} critical, ${reviewResult.issues.filter(i => i.type === 'warning').length} warnings, ${reviewResult.issues.filter(i => i.type === 'info').length} info items`
                          }
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {selectedTab === 'suggestions' && (
                    <div className="flex items-start">
                      <Zap size={20} className="text-yellow-500 mr-3 mt-0.5" />
                      <div>
                        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                          {reviewResult.suggestions.length === 0 
                            ? 'No enhancement suggestions available' 
                            : `${reviewResult.suggestions.length} code enhancement suggestions`
                          }
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {reviewResult.suggestions.length === 0 
                            ? 'Your code already follows best practices and modern patterns.'
                            : 'Implementation recommendations to improve code quality, readability and maintainability.'
                          }
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {selectedTab === 'metrics' && (
                    <div className="flex items-start">
                      <BarChart2 size={20} className="text-blue-500 mr-3 mt-0.5" />
                      <div>
                        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                          Code Quality Metrics
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Overall quality score: <span className={getScoreColor(reviewResult.scores.quality)}>{reviewResult.scores.quality}%</span>
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {selectedTab === 'chat' && (
                    <div className="flex items-start">
                      <MessageSquare size={20} className="text-primary mr-3 mt-0.5" />
                      <div>
                        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                          AI Code Assistant
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Ask questions about your code or get help with implementing specific features.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Issues tab */}
                {selectedTab === 'issues' && (
                  <div>
                    {reviewResult.issues.length === 0 ? (
                      <div className="text-center py-8">
                        <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                          No issues found!
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          Your code looks great. Keep up the good work!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {reviewResult.issues.map((issue, index) => (
                          <div 
                            key={index}
                            className={`border ${
                              expandedIssue === index ? 'border-primary' : 'border-gray-200 dark:border-gray-700'
                            } rounded-lg overflow-hidden`}
                          >
                            <div 
                              className={`p-3 flex items-start justify-between cursor-pointer ${
                                expandedIssue === index ? 'bg-primary/5 dark:bg-primary/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                              }`}
                              onClick={() => toggleIssueExpand(index)}
                            >
                              <div className="flex items-start">
                                <div className="mt-0.5 mr-3">
                                  {getIssueIcon(issue.type)}
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                    {issue.title}
                                  </h4>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {issue.line !== null && (
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        Line {issue.line + 1}
                                      </span>
                                    )}
                                    <SeverityBadge severity={issue.severity} />
                                    <CategoryBadge category={issue.category} />
                                  </div>
                                </div>
                              </div>
                              <div>
                                {expandedIssue === index ? (
                                  <ChevronUp size={16} className="text-gray-500" />
                                ) : (
                                  <ChevronDown size={16} className="text-gray-500" />
                                )}
                              </div>
                            </div>
                            
                            {expandedIssue === index && (
                              <div className="p-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                                  {issue.description}
                                </p>
                                
                                {/* Code location */}
                                {issue.line !== null && (
                                  <div className="mb-3">
                                    <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      Affected Code:
                                    </h5>
                                    <div className="bg-gray-100 dark:bg-gray-900 rounded-md overflow-hidden">
                                      <SyntaxHighlighter
                                        language={language.toLowerCase()}
                                        style={darkMode ? materialOceanic : materialLight}
                                        customStyle={{ margin: 0, maxHeight: 100, fontSize: '0.825rem' }}
                                        wrapLines
                                        showLineNumbers
                                        startingLineNumber={Math.max(1, issue.line - 1)}
                                        lineProps={lineNumber => ({
                                          style: {
                                            backgroundColor: 
                                              lineNumber === issue.line + 1 
                                                ? (darkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)') 
                                                : undefined,
                                            display: 'block',
                                          }
                                        })}
                                      >
                                        {codeToReview.split('\n').slice(
                                          Math.max(0, issue.line - 1), 
                                          Math.min(codeToReview.split('\n').length, issue.line + 3)
                                        ).join('\n')}
                                      </SyntaxHighlighter>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Feedback buttons */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <button
                                      className={`p-1.5 rounded-l-md text-xs flex items-center border ${
                                        feedback[index] === true
                                          ? 'bg-green-50 border-green-300 text-green-700 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400'
                                          : 'border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700'
                                      }`}
                                      onClick={() => provideFeedback(index, true)}
                                    >
                                      <ThumbsUp size={12} className="mr-1" />
                                      Helpful
                                    </button>
                                    <button
                                      className={`p-1.5 rounded-r-md text-xs flex items-center border-t border-r border-b ${
                                        feedback[index] === false
                                          ? 'bg-red-50 border-red-300 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-400'
                                          : 'border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700'
                                      }`}
                                      onClick={() => provideFeedback(index, false)}
                                    >
                                      <ThumbsDown size={12} className="mr-1" />
                                      Not helpful
                                    </button>
                                  </div>
                                  
                                  {issue.type !== 'info' && (
                                    <button
                                      className="px-2 py-1.5 text-xs bg-primary text-white rounded flex items-center"
                                      onClick={() => onFixSuggestion(issue)}
                                    >
                                      <Tool size={12} className="mr-1" />
                                      Fix issue
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Suggestions tab */}
                {selectedTab === 'suggestions' && (
                  <div>
                    {reviewResult.suggestions.length === 0 ? (
                      <div className="text-center py-8">
                        <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                          No additional suggestions
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          Your code already follows best practices and modern patterns.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {reviewResult.suggestions.map((suggestion, index) => (
                          <div 
                            key={index}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                          >
                            <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start">
                                  <Zap size={18} className="mr-3 mt-0.5 text-yellow-500" />
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                      {suggestion.title}
                                    </h4>
                                    <CategoryBadge category={suggestion.category} />
                                  </div>
                                </div>
                                
                                <button
                                  className={`p-1.5 rounded-md ${
                                    collapsedSections[`suggestion-${index}`] 
                                      ? 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300' 
                                      : 'text-gray-600 dark:text-gray-300'
                                  }`}
                                  onClick={() => toggleSection(`suggestion-${index}`)}
                                >
                                  {collapsedSections[`suggestion-${index}`] ? (
                                    <ChevronDown size={16} />
                                  ) : (
                                    <ChevronUp size={16} />
                                  )}
                                </button>
                              </div>
                            </div>
                            
                            {!collapsedSections[`suggestion-${index}`] && (
                              <div className="p-3">
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                                  {suggestion.description}
                                </p>
                                
                                {suggestion.example && (
                                  <div className="mb-3">
                                    <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                      Example:
                                    </h5>
                                    <div className="bg-gray-100 dark:bg-gray-900 rounded-md overflow-hidden relative">
                                      <SyntaxHighlighter
                                        language={language.toLowerCase()}
                                        style={darkMode ? materialOceanic : materialLight}
                                        customStyle={{ margin: 0, fontSize: '0.825rem' }}
                                      >
                                        {suggestion.example}
                                      </SyntaxHighlighter>
                                      <button
                                        className="absolute top-2 right-2 p-1 bg-gray-800/70 hover:bg-gray-800/90 text-white rounded"
                                        onClick={() => copyCodeExample(suggestion.example)}
                                        title="Copy code"
                                      >
                                        {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                                      </button>
                                    </div>
                                  </div>
                                )}
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <button
                                      className={`p-1.5 rounded-l-md text-xs flex items-center border ${
                                        feedback[`suggestion-${index}`] === true
                                          ? 'bg-green-50 border-green-300 text-green-700 dark:bg-green-900/30 dark:border-green-700 dark:text-green-400'
                                          : 'border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700'
                                      }`}
                                      onClick={() => provideFeedback(`suggestion-${index}`, true)}
                                    >
                                      <ThumbsUp size={12} className="mr-1" />
                                      Helpful
                                    </button>
                                    <button
                                      className={`p-1.5 rounded-r-md text-xs flex items-center border-t border-r border-b ${
                                        feedback[`suggestion-${index}`] === false
                                          ? 'bg-red-50 border-red-300 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-400'
                                          : 'border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700'
                                      }`}
                                      onClick={() => provideFeedback(`suggestion-${index}`, false)}
                                    >
                                      <ThumbsDown size={12} className="mr-1" />
                                      Not helpful
                                    </button>
                                  </div>
                                  
                                  <button
                                    className="px-2 py-1.5 text-xs bg-primary text-white rounded flex items-center"
                                    onClick={() => onFixSuggestion(suggestion)}
                                  >
                                    <Lightning size={12} className="mr-1" />
                                    Apply suggestion
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Metrics tab */}
                {selectedTab === 'metrics' && (
                  <div>
                    {/* Score cards */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {/* Quality Score */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                          <CheckCircle size={16} className="mr-2 text-primary" />
                          Quality Score
                        </h3>
                        <div className="flex items-baseline">
                          <span className={`text-3xl font-bold ${getScoreColor(reviewResult.scores.quality)}`}>
                            {reviewResult.scores.quality}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 ml-1 text-sm">/100</span>
                        </div>
                        <div className="mt-2 w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getProgressBackground(reviewResult.scores.quality)}`}
                            style={{ width: `${reviewResult.scores.quality}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Security Score */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                          <Shield size={16} className="mr-2 text-primary" />
                          Security Score
                        </h3>
                        <div className="flex items-baseline">
                          <span className={`text-3xl font-bold ${getScoreColor(reviewResult.scores.security)}`}>
                            {reviewResult.scores.security}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 ml-1 text-sm">/100</span>
                        </div>
                        <div className="mt-2 w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getProgressBackground(reviewResult.scores.security)}`}
                            style={{ width: `${reviewResult.scores.security}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Performance Score */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                          <Zap size={16} className="mr-2 text-primary" />
                          Performance Score
                        </h3>
                        <div className="flex items-baseline">
                          <span className={`text-3xl font-bold ${getScoreColor(reviewResult.scores.performance)}`}>
                            {reviewResult.scores.performance}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 ml-1 text-sm">/100</span>
                        </div>
                        <div className="mt-2 w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getProgressBackground(reviewResult.scores.performance)}`}
                            style={{ width: `${reviewResult.scores.performance}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Maintainability Score */}
                      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                          <Tool size={16} className="mr-2 text-primary" />
                          Maintainability
                        </h3>
                        <div className="flex items-baseline">
                          <span className={`text-3xl font-bold ${getScoreColor(reviewResult.scores.maintainability)}`}>
                            {reviewResult.scores.maintainability}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 ml-1 text-sm">/100</span>
                        </div>
                        <div className="mt-2 w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getProgressBackground(reviewResult.scores.maintainability)}`}
                            style={{ width: `${reviewResult.scores.maintainability}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Code metrics details */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                        Code Metrics
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded">
                          <span className="text-sm text-gray-600 dark:text-gray-300">Lines of code</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{reviewResult.metrics.lineCount}</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded">
                          <span className="text-sm text-gray-600 dark:text-gray-300">Code size</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{(reviewResult.metrics.codeSize / 1024).toFixed(2)} KB</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded">
                          <span className="text-sm text-gray-600 dark:text-gray-300">Cyclomatic complexity</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{reviewResult.metrics.cyclomatic_complexity}</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded">
                          <span className="text-sm text-gray-600 dark:text-gray-300">Cognitive complexity</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{reviewResult.metrics.cognitive_complexity}</span>
                        </div>
                      </div>
                      
                      {/* Issue distribution */}
                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          Issue Distribution
                        </h4>
                        
                        <div className="space-y-2">
                          {['error', 'warning', 'info'].map(type => {
                            const count = reviewResult.issues.filter(i => i.type === type).length;
                            const total = reviewResult.issues.length || 1;
                            const percentage = Math.round((count / total) * 100);
                            
                            const colors = {
                              error: 'bg-red-500',
                              warning: 'bg-yellow-500',
                              info: 'bg-blue-500',
                            };
                            
                            return (
                              <div key={type} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="capitalize text-gray-600 dark:text-gray-300 flex items-center">
                                    {getIssueIcon(type, 12)}
                                    <span className="ml-1">{type}s</span>
                                  </span>
                                  <span className="text-gray-900 dark:text-white font-medium">{count}</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full ${colors[type]}`}
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Chat tab */}
                {selectedTab === 'chat' && (
                  <div className="h-full flex flex-col">
                    <div className="flex-1 space-y-4 mb-4">
                      {/* Welcome message */}
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white mr-3">
                          <Code size={16} />
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-[80%]">
                          <p className="text-sm text-gray-800 dark:text-gray-200">
                            Hi there! I'm your AI code assistant. I've analyzed your code and can help you understand the issues, implement suggested improvements, or answer any questions you have about your code.
                          </p>
                        </div>
                      </div>
                      
                      {/* Sample messages */}
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white mr-3">
                          <Code size={16} />
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-[80%]">
                          <p className="text-sm text-gray-800 dark:text-gray-200">
                            Try asking me questions like:
                          </p>
                          <ul className="text-sm text-gray-800 dark:text-gray-200 mt-2 space-y-1 list-disc list-inside">
                            <li>How can I fix the memory leak issue?</li>
                            <li>Explain how to implement error handling in this code</li>
                            <li>Can you show me how to refactor this using modern JavaScript?</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    {/* Chat input */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full p-2 pr-10 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Ask a question about your code..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <button
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
                          onClick={sendMessage}
                        >
                          <Send size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for Lightning icon
const Lightning = ({ size = 24, className = '' }) => (
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
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
  </svg>
);

export default AICodeReviewer;