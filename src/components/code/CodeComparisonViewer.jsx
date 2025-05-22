import React, { useState, useEffect } from 'react';
import CodeEditor from '../editor/CodeEditor';
import { 
  ArrowRight, Code, ChevronDown, ChevronUp, Copy, Download, 
  Maximize2, Minimize2, RefreshCw, Check, ExternalLink, PlayCircle,
  PauseCircle, Grid, Layout, ArrowLeftRight, List, Columns
} from 'lucide-react';

const CodeComparisonViewer = ({
  title = 'Code Comparison',
  description = 'Compare different implementations',
  codeSnippets = [
    {
      id: 'before',
      name: 'Before',
      language: 'javascript',
      code: '// Before optimization\nfunction calculateSum(arr) {\n  let sum = 0;\n  for (let i = 0; i < arr.length; i++) {\n    sum += arr[i];\n  }\n  return sum;\n}'
    },
    {
      id: 'after',
      name: 'After',
      language: 'javascript',
      code: '// After optimization\nfunction calculateSum(arr) {\n  return arr.reduce((sum, num) => sum + num, 0);\n}'
    }
  ],
  theme = 'light',
  highlightChanges = true,
  showRunButtons = false,
  runCode = null,
  showStats = false,
  stats = null
}) => {
  // State for expanded/collapsed sections
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [codeCopied, setCodeCopied] = useState(null);
  const [layout, setLayout] = useState('split');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [runningIndex, setRunningIndex] = useState(null);
  const [runResults, setRunResults] = useState({});
  
  // Copy code to clipboard
  const copyCode = (code, index) => {
    navigator.clipboard.writeText(code);
    setCodeCopied(index);
    setTimeout(() => setCodeCopied(null), 2000);
  };
  
  // Download code
  const downloadCode = (code, name, language) => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.toLowerCase().replace(/\s+/g, '-')}.${getExtension(language)}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Get file extension for language
  const getExtension = (language) => {
    const extensions = {
      javascript: 'js',
      typescript: 'ts',
      jsx: 'jsx',
      tsx: 'tsx',
      html: 'html',
      css: 'css',
      python: 'py',
      java: 'java',
      go: 'go',
      rust: 'rs',
      php: 'php',
      ruby: 'rb',
      c: 'c',
      cpp: 'cpp',
      csharp: 'cs',
      swift: 'swift',
      kotlin: 'kt'
    };
    
    return extensions[language] || 'txt';
  };
  
  // Run code
  const handleRunCode = async (code, language, index) => {
    if (!runCode) return;
    
    setRunningIndex(index);
    setRunResults(prev => ({
      ...prev,
      [index]: { loading: true, result: null, error: null }
    }));
    
    try {
      const result = await runCode(code, language);
      setRunResults(prev => ({
        ...prev,
        [index]: { loading: false, result, error: null }
      }));
    } catch (error) {
      setRunResults(prev => ({
        ...prev,
        [index]: { loading: false, result: null, error: error.message }
      }));
    }
    
    setRunningIndex(null);
  };
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    // In a real app, you would use the Fullscreen API here
  };
  
  // Determine layout classes
  const getLayoutClasses = () => {
    switch (layout) {
      case 'split':
        return 'grid grid-cols-1 md:grid-cols-2 gap-6';
      case 'vertical':
        return 'space-y-6';
      case 'tabs':
        return 'space-y-4';
      default:
        return 'grid grid-cols-1 md:grid-cols-2 gap-6';
    }
  };
  
  return (
    <div className={`code-comparison-viewer w-full ${
      isFullscreen ? 'fixed inset-0 z-50 p-6 bg-white' : ''
    }`}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex-1">
          <button 
            className="flex items-center text-neutral-700 hover:text-neutral-900"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 mr-2" />
            ) : (
              <ChevronDown className="h-5 w-5 mr-2" />
            )}
            <h3 className="text-lg font-bold">{title}</h3>
          </button>
          
          {isExpanded && description && (
            <p className="mt-1 text-sm text-neutral-600">{description}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Layout selector */}
          <div className="relative group">
            <button className={`p-1.5 rounded text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100`} title="Change layout">
              <Layout className="h-4 w-4" />
            </button>
            
            <div className="absolute right-0 mt-1 hidden group-hover:block border border-neutral-200 rounded-md shadow-lg z-10 p-1 grid grid-cols-2 gap-1 bg-white">
              <button
                className={`p-1.5 rounded ${
                  layout === 'split' 
                    ? 'bg-neutral-200 text-neutral-900' 
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
                onClick={() => setLayout('split')}
                title="Split view"
              >
                <Columns className="h-4 w-4" />
              </button>
              
              <button
                className={`p-1.5 rounded ${
                  layout === 'vertical' 
                    ? 'bg-neutral-200 text-neutral-900' 
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
                onClick={() => setLayout('vertical')}
                title="Vertical view"
              >
                <List className="h-4 w-4" />
              </button>
              
              <button
                className={`p-1.5 rounded ${
                  layout === 'tabs' 
                    ? 'bg-neutral-200 text-neutral-900' 
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
                onClick={() => setLayout('tabs')}
                title="Tabbed view"
              >
                <Grid className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Fullscreen toggle */}
          <button
            className="p-1.5 rounded text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      
      {/* Content */}
      {isExpanded && (
        <div className={getLayoutClasses()}>
          {layout === 'tabs' ? (
            <>
              {/* Tabs navigation */}
              <div className="flex border-b border-neutral-200">
                {codeSnippets.map((snippet, index) => (
                  <button
                    key={snippet.id}
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTabIndex === index
                        ? 'border-b-2 border-primary-500 text-primary-600'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                    onClick={() => setActiveTabIndex(index)}
                  >
                    {snippet.name}
                  </button>
                ))}
              </div>
              
              {/* Active tab content */}
              <div>
                {codeSnippets.map((snippet, index) => (
                  <div key={snippet.id} className={activeTabIndex === index ? 'block' : 'hidden'}>
                    <div className="relative rounded-lg overflow-hidden border border-neutral-200">
                      {/* Code editor toolbar */}
                      <div className="flex items-center justify-between px-3 py-2 bg-neutral-50 border-b border-neutral-200">
                        <div className="flex items-center">
                          <Code className="h-4 w-4 text-neutral-500 mr-2" />
                          <span className="text-sm font-medium text-neutral-800">{snippet.name}</span>
                          <span className="ml-2 text-xs px-1.5 py-0.5 bg-neutral-200 text-neutral-600 rounded">
                            {snippet.language}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          {/* Run button if enabled */}
                          {showRunButtons && runCode && (
                            <button
                              className={`p-1.5 rounded ${
                                runningIndex === index
                                  ? 'text-primary-600 animate-pulse'
                                  : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100'
                              }`}
                              onClick={() => handleRunCode(snippet.code, snippet.language, index)}
                              disabled={runningIndex !== null}
                              title="Run code"
                            >
                              {runningIndex === index ? (
                                <RefreshCw className="h-4 w-4" />
                              ) : (
                                <PlayCircle className="h-4 w-4" />
                              )}
                            </button>
                          )}
                          
                          {/* Copy button */}
                          <button
                            className={`p-1.5 rounded ${
                              codeCopied === index
                                ? 'text-green-600'
                                : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100'
                            }`}
                            onClick={() => copyCode(snippet.code, index)}
                            title={codeCopied === index ? 'Copied!' : 'Copy code'}
                          >
                            {codeCopied === index ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                          
                          {/* Download button */}
                          <button
                            className="p-1.5 rounded text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
                            onClick={() => downloadCode(snippet.code, snippet.name, snippet.language)}
                            title="Download code"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Code editor */}
                      <CodeEditor
                        initialCode={snippet.code}
                        language={snippet.language}
                        editable={false}
                        showToolbar={false}
                        theme={theme}
                        minHeight="200px"
                      />
                    </div>
                    
                    {/* Run results */}
                    {showRunButtons && runResults[index] && (
                      <div className="mt-4">
                        <div className="text-sm font-medium text-neutral-700 mb-2">Result:</div>
                        {runResults[index].loading ? (
                          <div className="p-3 bg-neutral-100 rounded-md">
                            <div className="animate-pulse flex space-x-4">
                              <div className="flex-1 space-y-3">
                                <div className="h-2 bg-neutral-300 rounded"></div>
                                <div className="h-2 bg-neutral-300 rounded w-5/6"></div>
                              </div>
                            </div>
                          </div>
                        ) : runResults[index].error ? (
                          <div className="p-3 bg-error-50 text-error-800 border border-error-200 rounded-md font-mono text-sm">
                            Error: {runResults[index].error}
                          </div>
                        ) : (
                          <pre className="p-3 bg-neutral-100 rounded-md overflow-x-auto text-sm">
                            {typeof runResults[index].result === 'object'
                              ? JSON.stringify(runResults[index].result, null, 2)
                              : runResults[index].result}
                          </pre>
                        )}
                      </div>
                    )}
                    
                    {/* Stats */}
                    {showStats && stats && stats[snippet.id] && (
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        {stats[snippet.id].executionTime && (
                          <div className="bg-neutral-100 p-3 rounded-md">
                            <div className="text-xs text-neutral-500 mb-1">Execution Time</div>
                            <div className="font-mono text-lg font-bold text-neutral-900">
                              {stats[snippet.id].executionTime} ms
                            </div>
                          </div>
                        )}
                        
                        {stats[snippet.id].memoryUsage && (
                          <div className="bg-neutral-100 p-3 rounded-md">
                            <div className="text-xs text-neutral-500 mb-1">Memory Usage</div>
                            <div className="font-mono text-lg font-bold text-neutral-900">
                              {stats[snippet.id].memoryUsage} MB
                            </div>
                          </div>
                        )}
                        
                        {stats[snippet.id].complexity && (
                          <div className="bg-neutral-100 p-3 rounded-md">
                            <div className="text-xs text-neutral-500 mb-1">Time Complexity</div>
                            <div className="font-mono text-lg font-bold text-neutral-900">
                              {stats[snippet.id].complexity}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            codeSnippets.map((snippet, index) => (
              <div key={snippet.id} className="h-full">
                <div className="relative rounded-lg overflow-hidden border border-neutral-200 h-full flex flex-col">
                  {/* Code editor toolbar */}
                  <div className="flex items-center justify-between px-3 py-2 bg-neutral-50 border-b border-neutral-200">
                    <div className="flex items-center">
                      <Code className="h-4 w-4 text-neutral-500 mr-2" />
                      <span className="text-sm font-medium text-neutral-800">{snippet.name}</span>
                      <span className="ml-2 text-xs px-1.5 py-0.5 bg-neutral-200 text-neutral-600 rounded">
                        {snippet.language}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {/* Run button if enabled */}
                      {showRunButtons && runCode && (
                        <button
                          className={`p-1.5 rounded ${
                            runningIndex === index
                              ? 'text-primary-600 animate-pulse'
                              : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100'
                          }`}
                          onClick={() => handleRunCode(snippet.code, snippet.language, index)}
                          disabled={runningIndex !== null}
                          title="Run code"
                        >
                          {runningIndex === index ? (
                            <RefreshCw className="h-4 w-4" />
                          ) : (
                            <PlayCircle className="h-4 w-4" />
                          )}
                        </button>
                      )}
                      
                      {/* Copy button */}
                      <button
                        className={`p-1.5 rounded ${
                          codeCopied === index
                            ? 'text-green-600'
                            : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100'
                        }`}
                        onClick={() => copyCode(snippet.code, index)}
                        title={codeCopied === index ? 'Copied!' : 'Copy code'}
                      >
                        {codeCopied === index ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                      
                      {/* Download button */}
                      <button
                        className="p-1.5 rounded text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
                        onClick={() => downloadCode(snippet.code, snippet.name, snippet.language)}
                        title="Download code"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Code editor */}
                  <div className="flex-1">
                    <CodeEditor
                      initialCode={snippet.code}
                      language={snippet.language}
                      editable={false}
                      showToolbar={false}
                      theme={theme}
                      minHeight="200px"
                    />
                  </div>
                  
                  {/* Run results */}
                  {showRunButtons && runResults[index] && (
                    <div className="bg-neutral-50 border-t border-neutral-200 p-3">
                      <div className="text-sm font-medium text-neutral-700 mb-2">Result:</div>
                      {runResults[index].loading ? (
                        <div className="p-2 bg-neutral-100 rounded-md">
                          <div className="animate-pulse flex space-x-4">
                            <div className="flex-1 space-y-2">
                              <div className="h-2 bg-neutral-300 rounded"></div>
                              <div className="h-2 bg-neutral-300 rounded w-5/6"></div>
                            </div>
                          </div>
                        </div>
                      ) : runResults[index].error ? (
                        <div className="p-2 bg-error-50 text-error-800 border border-error-200 rounded-md font-mono text-xs">
                          Error: {runResults[index].error}
                        </div>
                      ) : (
                        <pre className="p-2 bg-neutral-100 rounded-md overflow-x-auto text-xs">
                          {typeof runResults[index].result === 'object'
                            ? JSON.stringify(runResults[index].result, null, 2)
                            : runResults[index].result}
                        </pre>
                      )}
                    </div>
                  )}
                  
                  {/* Stats */}
                  {showStats && stats && stats[snippet.id] && (
                    <div className="bg-neutral-50 border-t border-neutral-200 p-3">
                      <div className="grid grid-cols-3 gap-2">
                        {stats[snippet.id].executionTime && (
                          <div className="bg-neutral-100 p-2 rounded-md">
                            <div className="text-xs text-neutral-500 mb-1">Execution Time</div>
                            <div className="font-mono text-sm font-bold text-neutral-900">
                              {stats[snippet.id].executionTime} ms
                            </div>
                          </div>
                        )}
                        
                        {stats[snippet.id].memoryUsage && (
                          <div className="bg-neutral-100 p-2 rounded-md">
                            <div className="text-xs text-neutral-500 mb-1">Memory Usage</div>
                            <div className="font-mono text-sm font-bold text-neutral-900">
                              {stats[snippet.id].memoryUsage} MB
                            </div>
                          </div>
                        )}
                        
                        {stats[snippet.id].complexity && (
                          <div className="bg-neutral-100 p-2 rounded-md">
                            <div className="text-xs text-neutral-500 mb-1">Complexity</div>
                            <div className="font-mono text-sm font-bold text-neutral-900">
                              {stats[snippet.id].complexity}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CodeComparisonViewer;