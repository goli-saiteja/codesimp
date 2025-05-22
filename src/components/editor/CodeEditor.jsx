import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';
import 'prismjs/themes/prism-tomorrow.css';
import { 
  Copy, Download, Play, Settings, RefreshCw, 
  Check, ChevronDown, Upload, Share2, Maximize2
} from 'lucide-react';

const CodeEditor = ({ 
  initialCode = '', 
  language = 'javascript', 
  onChange,
  editable = true,
  showToolbar = true,
  minHeight = '200px',
  maxHeight = '500px',
  theme = 'dark',
  runnable = false,
  onRun,
  filename = 'example.js'
}) => {
  const [code, setCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const dispatch = useDispatch();
  
  // Language options
  const languageOptions = [
    { id: 'javascript', name: 'JavaScript', extension: 'js' },
    { id: 'jsx', name: 'JSX', extension: 'jsx' },
    { id: 'typescript', name: 'TypeScript', extension: 'ts' },
    { id: 'tsx', name: 'TSX', extension: 'tsx' },
    { id: 'css', name: 'CSS', extension: 'css' },
    { id: 'scss', name: 'SCSS', extension: 'scss' },
    { id: 'html', name: 'HTML', extension: 'html' },
    { id: 'python', name: 'Python', extension: 'py' },
    { id: 'java', name: 'Java', extension: 'java' },
    { id: 'go', name: 'Go', extension: 'go' },
    { id: 'rust', name: 'Rust', extension: 'rs' },
    { id: 'c', name: 'C', extension: 'c' },
    { id: 'cpp', name: 'C++', extension: 'cpp' },
    { id: 'csharp', name: 'C#', extension: 'cs' },
    { id: 'json', name: 'JSON', extension: 'json' },
    { id: 'markdown', name: 'Markdown', extension: 'md' },
    { id: 'yaml', name: 'YAML', extension: 'yaml' },
    { id: 'bash', name: 'Bash', extension: 'sh' },
    { id: 'sql', name: 'SQL', extension: 'sql' },
  ];
  
  // Find the current language option
  const currentLanguageOption = languageOptions.find(opt => opt.id === selectedLanguage) || languageOptions[0];
  
  // Update the parent component when code changes
  useEffect(() => {
    if (onChange) {
      onChange(code, selectedLanguage);
    }
  }, [code, selectedLanguage, onChange]);
  
  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    // In a real implementation, you would use the Fullscreen API here
  };
  
  // Copy code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Download code as file
  const downloadCode = () => {
    const extension = currentLanguageOption.extension;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `code.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Run the code
  const runCode = async () => {
    if (!runnable || !onRun) return;
    
    setIsRunning(true);
    setOutput('');
    
    try {
      // In a real app, you would send the code to a backend service
      // or use a sandboxed environment to run it
      const result = await onRun(code, selectedLanguage);
      setOutput(result);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };
  
  // Change language
  const changeLanguage = (langId) => {
    setSelectedLanguage(langId);
    setLanguageDropdownOpen(false);
  };
  
  // Reset code to initial value
  const resetCode = () => {
    setCode(initialCode);
  };
  
  // Handle code change
  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };
  
  // Determine if HTML should be highlighted as JSX
  const getLanguageForHighlighting = (lang) => {
    if (lang === 'html') return languages.jsx;
    return languages[lang] || languages.javascript;
  };
  
  // Helper to highlight the code
  const highlightCode = (code) => {
    return highlight(code, getLanguageForHighlighting(selectedLanguage), selectedLanguage);
  };
  
  return (
    <div 
      className={`editor-container ${isFullscreen ? 'fixed inset-0 z-50 p-6 bg-neutral-900' : ''} ${
        theme === 'dark' ? 'bg-syntax-bg text-syntax-text' : 'bg-white text-neutral-900'
      }`}
    >
      {/* Toolbar */}
      {showToolbar && (
        <div className={`flex items-center justify-between px-3 py-2 border-b ${
          theme === 'dark' ? 'border-neutral-700' : 'border-neutral-200'
        }`}>
          <div className="flex items-center space-x-2">
            {/* Language selector */}
            <div className="relative">
              <button
                className={`flex items-center px-2 py-1 rounded text-xs font-medium ${
                  theme === 'dark' 
                    ? 'bg-neutral-700 hover:bg-neutral-600 text-neutral-200' 
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                }`}
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
              >
                {currentLanguageOption.name}
                <ChevronDown className="h-3 w-3 ml-1" />
              </button>
              
              {languageDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setLanguageDropdownOpen(false)}
                  />
                  <div className={`absolute left-0 mt-1 max-h-60 w-40 overflow-y-auto rounded-md shadow-lg z-20 ${
                    theme === 'dark' ? 'bg-neutral-800' : 'bg-white'
                  }`}>
                    {languageOptions.map(option => (
                      <button
                        key={option.id}
                        className={`flex items-center w-full px-3 py-1.5 text-xs ${
                          selectedLanguage === option.id 
                            ? theme === 'dark' 
                              ? 'bg-primary-700 text-white' 
                              : 'bg-primary-50 text-primary-700'
                            : theme === 'dark' 
                              ? 'text-neutral-200 hover:bg-neutral-700' 
                              : 'text-neutral-700 hover:bg-neutral-100'
                        }`}
                        onClick={() => changeLanguage(option.id)}
                      >
                        {option.name}
                        {selectedLanguage === option.id && (
                          <Check className="h-3 w-3 ml-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            
            {/* Filename (optional) */}
            {filename && (
              <span className={`text-xs font-mono ${
                theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
              }`}>
                {filename}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            {/* Run button */}
            {runnable && (
              <button
                className={`p-1.5 rounded ${
                  isRunning ? 'animate-pulse' : ''
                } ${
                  theme === 'dark' 
                    ? 'hover:bg-neutral-700 text-green-400' 
                    : 'hover:bg-neutral-100 text-green-600'
                }`}
                onClick={runCode}
                disabled={isRunning}
                title="Run code"
              >
                {isRunning ? (
                  <RefreshCw className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </button>
            )}
            
            {/* Reset button */}
            <button
              className={`p-1.5 rounded ${
                theme === 'dark' 
                  ? 'hover:bg-neutral-700 text-neutral-400' 
                  : 'hover:bg-neutral-100 text-neutral-600'
              }`}
              onClick={resetCode}
              title="Reset code"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            
            {/* Copy button */}
            <button
              className={`p-1.5 rounded ${
                copied 
                  ? theme === 'dark' 
                    ? 'text-green-400' 
                    : 'text-green-600'
                  : theme === 'dark' 
                    ? 'hover:bg-neutral-700 text-neutral-400' 
                    : 'hover:bg-neutral-100 text-neutral-600'
              }`}
              onClick={copyToClipboard}
              title={copied ? 'Copied!' : 'Copy code'}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
            
            {/* Download button */}
            <button
              className={`p-1.5 rounded ${
                theme === 'dark' 
                  ? 'hover:bg-neutral-700 text-neutral-400' 
                  : 'hover:bg-neutral-100 text-neutral-600'
              }`}
              onClick={downloadCode}
              title="Download code"
            >
              <Download className="h-4 w-4" />
            </button>
            
            {/* Share button */}
            <button
              className={`p-1.5 rounded ${
                theme === 'dark' 
                  ? 'hover:bg-neutral-700 text-neutral-400' 
                  : 'hover:bg-neutral-100 text-neutral-600'
              }`}
              onClick={() => {
                // Share functionality would go here
              }}
              title="Share code"
            >
              <Share2 className="h-4 w-4" />
            </button>
            
            {/* Fullscreen button */}
            <button
              className={`p-1.5 rounded ${
                theme === 'dark' 
                  ? 'hover:bg-neutral-700 text-neutral-400' 
                  : 'hover:bg-neutral-100 text-neutral-600'
              }`}
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              <Maximize2 className="h-4 w-4" />
            </button>
            
            {/* Settings button */}
            <button
              className={`p-1.5 rounded ${
                theme === 'dark' 
                  ? 'hover:bg-neutral-700 text-neutral-400' 
                  : 'hover:bg-neutral-100 text-neutral-600'
              }`}
              onClick={() => setSettingsOpen(!settingsOpen)}
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      
      {/* Editor */}
      <div 
        className={`overflow-auto border-0`}
        style={{ 
          minHeight, 
          maxHeight: isFullscreen ? 'calc(100vh - 160px)' : maxHeight
        }}
      >
        <Editor
          value={code}
          onValueChange={handleCodeChange}
          highlight={highlightCode}
          padding={16}
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '14px',
            backgroundColor: theme === 'dark' ? '#282c34' : '#ffffff',
            color: theme === 'dark' ? '#abb2bf' : '#1e293b',
            minHeight: '100%',
          }}
          textareaClassName="outline-none focus:ring-0 border-0"
          readOnly={!editable}
        />
      </div>
      
      {/* Output console (when runnable) */}
      {runnable && output && (
        <div 
          className={`mt-2 p-3 rounded overflow-auto font-mono text-sm ${
            theme === 'dark' 
              ? 'bg-neutral-800 border border-neutral-700' 
              : 'bg-neutral-100 border border-neutral-200'
          }`}
          style={{ maxHeight: '150px' }}
        >
          <div className={`mb-1 text-xs font-medium ${
            theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
          }`}>
            Output:
          </div>
          <pre className="whitespace-pre-wrap">{output}</pre>
        </div>
      )}
      
      {/* Settings panel */}
      {settingsOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/50" 
            onClick={() => setSettingsOpen(false)}
          />
          <div className={`absolute right-2 top-12 w-64 p-4 rounded-lg shadow-lg z-50 ${
            theme === 'dark' ? 'bg-neutral-800' : 'bg-white'
          }`}>
            <h3 className={`text-sm font-semibold mb-3 ${
              theme === 'dark' ? 'text-neutral-200' : 'text-neutral-800'
            }`}>
              Editor Settings
            </h3>
            
            <div className="space-y-3">
              {/* Theme setting */}
              <div>
                <label className={`block text-xs font-medium mb-1 ${
                  theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                }`}>
                  Theme
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    className={`px-3 py-1 text-xs rounded-md ${
                      theme === 'light' 
                        ? 'bg-primary-100 text-primary-700' 
                        : theme === 'dark' 
                          ? 'bg-neutral-700 text-neutral-300' 
                          : 'bg-neutral-100 text-neutral-700'
                    }`}
                    onClick={() => {
                      // dispatch(setEditorTheme('light'));
                    }}
                  >
                    Light
                  </button>
                  <button
                    className={`px-3 py-1 text-xs rounded-md ${
                      theme === 'dark' 
                        ? 'bg-primary-100 text-primary-700' 
                        : theme === 'dark' 
                          ? 'bg-neutral-700 text-neutral-300' 
                          : 'bg-neutral-100 text-neutral-700'
                    }`}
                    onClick={() => {
                      // dispatch(setEditorTheme('dark'));
                    }}
                  >
                    Dark
                  </button>
                </div>
              </div>
              
              {/* Font size setting */}
              <div>
                <label className={`block text-xs font-medium mb-1 ${
                  theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                }`}>
                  Font Size
                </label>
                <select
                  className={`w-full text-xs rounded-md ${
                    theme === 'dark' 
                      ? 'bg-neutral-700 text-neutral-300 border-neutral-600' 
                      : 'bg-white text-neutral-800 border-neutral-300'
                  }`}
                  onChange={(e) => {
                    // dispatch(setFontSize(e.target.value));
                  }}
                  defaultValue="14px"
                >
                  <option value="12px">12px</option>
                  <option value="14px">14px</option>
                  <option value="16px">16px</option>
                  <option value="18px">18px</option>
                </select>
              </div>
              
              {/* Tab size setting */}
              <div>
                <label className={`block text-xs font-medium mb-1 ${
                  theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                }`}>
                  Tab Size
                </label>
                <select
                  className={`w-full text-xs rounded-md ${
                    theme === 'dark' 
                      ? 'bg-neutral-700 text-neutral-300 border-neutral-600' 
                      : 'bg-white text-neutral-800 border-neutral-300'
                  }`}
                  onChange={(e) => {
                    // dispatch(setTabSize(parseInt(e.target.value)));
                  }}
                  defaultValue="2"
                >
                  <option value="2">2 spaces</option>
                  <option value="4">4 spaces</option>
                </select>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CodeEditor;