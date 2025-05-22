import React, { useState, useEffect, useRef } from 'react';
import CodeEditor from '../editor/CodeEditor';
import { 
  Play, RefreshCw, Download, Copy, Share2, 
  Settings, Layout, Columns, Rows, Maximize2, 
  Save, Upload, Check, Clipboard, X, ExternalLink
} from 'lucide-react';

const CodePlayground = ({ 
  initialCode = {
    html: '<div id="app">\n  <h1>Hello, CodeSiMP!</h1>\n  <p>Start editing to see some magic happen.</p>\n</div>',
    css: 'body {\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;\n  margin: 0;\n  padding: 1rem;\n  color: #213547;\n}\n\nh1 {\n  color: #5b6ef8;\n  margin-bottom: 0.5rem;\n}\n\np {\n  margin: 0.5rem 0;\n}',
    js: 'const app = document.getElementById("app");\nconsole.log("Hello from JavaScript!");\n\n// Uncomment to use React\n// const element = React.createElement("div", null, "Hello React!");\n// ReactDOM.render(element, app);'
  },
  defaultLayout = 'split',
  defaultTab = 'html',
  includeReact = true,
  includeTailwind = false,
  readOnly = false,
  title = 'Untitled Playground',
  onSave,
  canSave = true,
  theme = 'light'
}) => {
  // State for code content
  const [code, setCode] = useState(initialCode);
  
  // State for the current tab
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  // State for the layout
  const [layout, setLayout] = useState(defaultLayout);
  
  // State for the preview window
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(null);
  
  // State for playground title
  const [playgroundTitle, setPlaygroundTitle] = useState(title);
  const [editingTitle, setEditingTitle] = useState(false);
  
  // State for settings
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [reactEnabled, setReactEnabled] = useState(includeReact);
  const [tailwindEnabled, setTailwindEnabled] = useState(includeTailwind);
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  // State for share dialog
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Refs
  const previewRef = useRef(null);
  const previewIframeRef = useRef(null);
  const refreshTimeout = useRef(null);
  
  // Function to update code in a specific tab
  const updateCode = (newCode, language) => {
    setCode(prev => ({
      ...prev,
      [language]: newCode
    }));
    
    // Auto refresh the preview after a delay
    if (autoRefresh) {
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
      }
      
      refreshTimeout.current = setTimeout(() => {
        refreshPreview();
      }, 1000);
    }
  };
  
  // Function to refresh the preview
  const refreshPreview = () => {
    setPreviewLoading(true);
    setPreviewError(null);
    
    try {
      const iframe = previewIframeRef.current;
      
      if (!iframe) return;
      
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      
      // Clear the document
      iframeDoc.open();
      
      // Add React and ReactDOM if enabled
      const reactScripts = reactEnabled ? `
        <script src="https://cdnjs.cloudflare.com/ajax/libs/react/17.0.2/umd/react.development.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/17.0.2/umd/react-dom.development.js"></script>
      ` : '';
      
      // Add Tailwind if enabled
      const tailwindScript = tailwindEnabled ? `
        <script src="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.js"></script>
      ` : '';
      
      // Create the HTML document with the code
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>CodeSiMP Playground</title>
            ${reactScripts}
            ${tailwindScript}
            <style>
              ${code.css}
            </style>
          </head>
          <body>
            ${code.html}
            <script>
              // Error handling for the console
              const originalConsoleError = console.error;
              console.error = function() {
                originalConsoleError.apply(console, arguments);
                const errorMessage = Array.from(arguments).join(' ');
                window.parent.postMessage({ type: 'error', message: errorMessage }, '*');
              };
              
              try {
                ${code.js}
              } catch (error) {
                console.error('Runtime error:', error.message);
              }
            </script>
          </body>
        </html>
      `;
      
      // Write the HTML to the iframe
      iframeDoc.write(html);
      iframeDoc.close();
      
      // Listen for error messages from the iframe
      window.addEventListener('message', handleIframeMessage);
      
      // Set loading to false after a short delay
      setTimeout(() => {
        setPreviewLoading(false);
      }, 300);
      
    } catch (error) {
      setPreviewError(`Error rendering preview: ${error.message}`);
      setPreviewLoading(false);
    }
  };
  
  // Handle messages from the iframe
  const handleIframeMessage = (event) => {
    if (event.data.type === 'error') {
      setPreviewError(event.data.message);
    }
  };
  
  // Effect to render the preview on mount and when code changes
  useEffect(() => {
    refreshPreview();
    
    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('message', handleIframeMessage);
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
      }
    };
  }, []);
  
  // Function to handle manual refresh
  const handleRefresh = () => {
    if (refreshTimeout.current) {
      clearTimeout(refreshTimeout.current);
    }
    refreshPreview();
  };
  
  // Function to download the playground as an HTML file
  const downloadPlayground = () => {
    // Create a Blob with the HTML content
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${playgroundTitle}</title>
          ${reactEnabled ? `
            <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
            <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
          ` : ''}
          ${tailwindEnabled ? `
            <script src="https://cdn.tailwindcss.com"></script>
          ` : ''}
          <style>
            ${code.css}
          </style>
        </head>
        <body>
          ${code.html}
          <script>
            ${code.js}
          </script>
        </body>
      </html>
    `;
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Create a link and click it to download the file
    const a = document.createElement('a');
    a.href = url;
    a.download = `${playgroundTitle.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Function to save the playground
  const handleSave = () => {
    if (onSave) {
      onSave({
        title: playgroundTitle,
        code,
        settings: {
          reactEnabled,
          tailwindEnabled
        }
      });
    }
  };
  
  // Function to share the playground
  const handleShare = () => {
    // In a real app, this would make an API call to save the playground
    // and generate a shareable URL
    const mockShareUrl = `https://codesimp.com/playground/${Date.now()}`;
    setShareUrl(mockShareUrl);
    setShareDialogOpen(true);
  };
  
  // Function to copy the share URL
  const copyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Helper function to determine layout classes
  const getLayoutClasses = () => {
    switch (layout) {
      case 'horizontal':
        return 'flex-col';
      case 'vertical':
        return 'flex-row';
      case 'preview-only':
        return 'hidden';
      case 'code-only':
        return 'flex-1';
      default:
        return 'flex-col md:flex-row';
    }
  };
  
  // Helper function to determine preview classes
  const getPreviewClasses = () => {
    switch (layout) {
      case 'horizontal':
        return 'h-1/2 w-full';
      case 'vertical':
        return 'h-full w-1/2';
      case 'preview-only':
        return 'h-full w-full';
      case 'code-only':
        return 'hidden';
      default:
        return 'h-full w-full md:w-1/2';
    }
  };
  
  return (
    <div className={`code-playground h-full flex flex-col rounded-lg overflow-hidden border ${
      theme === 'dark' ? 'border-neutral-700 bg-neutral-800' : 'border-neutral-200 bg-white'
    }`}>
      {/* Toolbar */}
      <div className={`flex items-center justify-between px-3 py-2 border-b ${
        theme === 'dark' ? 'border-neutral-700 bg-neutral-900' : 'border-neutral-200 bg-neutral-50'
      }`}>
        <div className="flex items-center">
          {/* Playground title */}
          {editingTitle ? (
            <input
              type="text"
              className={`px-2 py-1 text-sm font-medium rounded border ${
                theme === 'dark' 
                  ? 'bg-neutral-800 text-white border-neutral-700' 
                  : 'bg-white text-neutral-900 border-neutral-300'
              }`}
              value={playgroundTitle}
              onChange={(e) => setPlaygroundTitle(e.target.value)}
              onBlur={() => setEditingTitle(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setEditingTitle(false);
                }
              }}
              autoFocus
            />
          ) : (
            <h3 
              className={`text-sm font-semibold cursor-pointer ${
                theme === 'dark' ? 'text-white' : 'text-neutral-900'
              }`}
              onClick={() => !readOnly && setEditingTitle(true)}
            >
              {playgroundTitle}
            </h3>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          {/* Run button */}
          <button
            className={`p-1.5 rounded ${
              theme === 'dark' 
                ? 'hover:bg-neutral-700 text-green-400' 
                : 'hover:bg-neutral-200 text-green-600'
            }`}
            onClick={handleRefresh}
            title="Run code (Ctrl+Enter)"
          >
            <Play className="h-4 w-4" />
          </button>
          
          {/* Layout options */}
          <div className="relative group">
            <button
              className={`p-1.5 rounded ${
                theme === 'dark' 
                  ? 'hover:bg-neutral-700 text-neutral-300' 
                  : 'hover:bg-neutral-200 text-neutral-600'
              }`}
              title="Change layout"
            >
              <Layout className="h-4 w-4" />
            </button>
            
            <div className={`absolute right-0 mt-1 hidden group-hover:block border rounded-md shadow-lg z-10 p-1 grid grid-cols-2 gap-1 ${
              theme === 'dark' 
                ? 'bg-neutral-800 border-neutral-700' 
                : 'bg-white border-neutral-200'
            }`}>
              <button
                className={`p-1.5 rounded ${
                  layout === 'split' 
                    ? theme === 'dark' 
                      ? 'bg-neutral-700 text-white' 
                      : 'bg-neutral-200 text-neutral-900'
                    : theme === 'dark' 
                      ? 'text-neutral-300 hover:bg-neutral-700' 
                      : 'text-neutral-600 hover:bg-neutral-100'
                }`}
                onClick={() => setLayout('split')}
                title="Split view"
              >
                <Columns className="h-4 w-4" />
              </button>
              
              <button
                className={`p-1.5 rounded ${
                  layout === 'horizontal' 
                    ? theme === 'dark' 
                      ? 'bg-neutral-700 text-white' 
                      : 'bg-neutral-200 text-neutral-900'
                    : theme === 'dark' 
                      ? 'text-neutral-300 hover:bg-neutral-700' 
                      : 'text-neutral-600 hover:bg-neutral-100'
                }`}
                onClick={() => setLayout('horizontal')}
                title="Horizontal view"
              >
                <Rows className="h-4 w-4" />
              </button>
              
              <button
                className={`p-1.5 rounded ${
                  layout === 'code-only' 
                    ? theme === 'dark' 
                      ? 'bg-neutral-700 text-white' 
                      : 'bg-neutral-200 text-neutral-900'
                    : theme === 'dark' 
                      ? 'text-neutral-300 hover:bg-neutral-700' 
                      : 'text-neutral-600 hover:bg-neutral-100'
                }`}
                onClick={() => setLayout('code-only')}
                title="Code only"
              >
                <div className="h-4 w-4 flex items-center justify-center text-xs font-mono">
                  { }
                </div>
              </button>
              
              <button
                className={`p-1.5 rounded ${
                  layout === 'preview-only' 
                    ? theme === 'dark' 
                      ? 'bg-neutral-700 text-white' 
                      : 'bg-neutral-200 text-neutral-900'
                    : theme === 'dark' 
                      ? 'text-neutral-300 hover:bg-neutral-700' 
                      : 'text-neutral-600 hover:bg-neutral-100'
                }`}
                onClick={() => setLayout('preview-only')}
                title="Preview only"
              >
                <div className="h-4 w-4 flex items-center justify-center text-xs">
                  
                </div>
              </button>
            </div>
          </div>
          
          {/* Save button */}
          {canSave && (
            <button
              className={`p-1.5 rounded ${
                theme === 'dark' 
                  ? 'hover:bg-neutral-700 text-neutral-300' 
                  : 'hover:bg-neutral-200 text-neutral-600'
              }`}
              onClick={handleSave}
              title="Save playground"
            >
              <Save className="h-4 w-4" />
            </button>
          )}
          
          {/* Download button */}
          <button
            className={`p-1.5 rounded ${
              theme === 'dark' 
                ? 'hover:bg-neutral-700 text-neutral-300' 
                : 'hover:bg-neutral-200 text-neutral-600'
            }`}
            onClick={downloadPlayground}
            title="Download as HTML"
          >
            <Download className="h-4 w-4" />
          </button>
          
          {/* Share button */}
          <button
            className={`p-1.5 rounded ${
              theme === 'dark' 
                ? 'hover:bg-neutral-700 text-neutral-300' 
                : 'hover:bg-neutral-200 text-neutral-600'
            }`}
            onClick={handleShare}
            title="Share playground"
          >
            <Share2 className="h-4 w-4" />
          </button>
          
          {/* Settings button */}
          <button
            className={`p-1.5 rounded ${
              theme === 'dark' 
                ? 'hover:bg-neutral-700 text-neutral-300' 
                : 'hover:bg-neutral-200 text-neutral-600'
            }`}
            onClick={() => setSettingsOpen(!settingsOpen)}
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code editor section */}
        <div className={`${layout === 'preview-only' ? 'hidden' : 'flex flex-col'} ${
          layout === 'vertical' ? 'w-1/2' : layout === 'code-only' ? 'w-full' : 'w-full md:w-1/2'
        }`}>
          {/* Tabs */}
          <div className={`flex ${
            theme === 'dark' ? 'bg-neutral-900' : 'bg-neutral-100'
          }`}>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'html' 
                  ? theme === 'dark' 
                    ? 'bg-neutral-800 text-white' 
                    : 'bg-white text-neutral-900 border-t-2 border-primary-500' 
                  : theme === 'dark' 
                    ? 'bg-neutral-900 text-neutral-400 hover:text-neutral-200' 
                    : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900'
              }`}
              onClick={() => setActiveTab('html')}
            >
              HTML
            </button>
            
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'css' 
                  ? theme === 'dark' 
                    ? 'bg-neutral-800 text-white' 
                    : 'bg-white text-neutral-900 border-t-2 border-primary-500' 
                  : theme === 'dark' 
                    ? 'bg-neutral-900 text-neutral-400 hover:text-neutral-200' 
                    : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900'
              }`}
              onClick={() => setActiveTab('css')}
            >
              CSS
            </button>
            
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'js' 
                  ? theme === 'dark' 
                    ? 'bg-neutral-800 text-white' 
                    : 'bg-white text-neutral-900 border-t-2 border-primary-500' 
                  : theme === 'dark' 
                    ? 'bg-neutral-900 text-neutral-400 hover:text-neutral-200' 
                    : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900'
              }`}
              onClick={() => setActiveTab('js')}
            >
              JS
            </button>
          </div>
          
          {/* Editor */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'html' && (
              <CodeEditor
                initialCode={code.html}
                language="html"
                onChange={(newCode) => updateCode(newCode, 'html')}
                editable={!readOnly}
                showToolbar={false}
                theme={theme}
              />
            )}
            
            {activeTab === 'css' && (
              <CodeEditor
                initialCode={code.css}
                language="css"
                onChange={(newCode) => updateCode(newCode, 'css')}
                editable={!readOnly}
                showToolbar={false}
                theme={theme}
              />
            )}
            
            {activeTab === 'js' && (
              <CodeEditor
                initialCode={code.js}
                language="javascript"
                onChange={(newCode) => updateCode(newCode, 'js')}
                editable={!readOnly}
                showToolbar={false}
                theme={theme}
              />
            )}
          </div>
        </div>
        
        {/* Preview section */}
        {layout !== 'code-only' && (
          <div
            className={`${
              layout === 'vertical' ? 'w-1/2' : layout === 'preview-only' ? 'w-full' : 'w-full md:w-1/2'
            } flex flex-col ${
              theme === 'dark' ? 'bg-white' : 'bg-white'
            } ${
              layout !== 'preview-only' && (theme === 'dark' ? 'border-l border-neutral-700' : 'border-l border-neutral-200')
            }`}
            ref={previewRef}
          >
            <div className={`flex items-center justify-between px-3 py-1.5 ${
              theme === 'dark' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-900'
            }`}>
              <span className="text-sm font-medium">Preview</span>
              
              <div className="flex items-center space-x-1">
                <button
                  className={`p-1 rounded ${
                    theme === 'dark' 
                      ? 'hover:bg-neutral-700 text-neutral-300' 
                      : 'hover:bg-neutral-200 text-neutral-600'
                  }`}
                  onClick={handleRefresh}
                  title="Refresh preview"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
                
                <button
                  className={`p-1 rounded ${
                    theme === 'dark' 
                      ? 'hover:bg-neutral-700 text-neutral-300' 
                      : 'hover:bg-neutral-200 text-neutral-600'
                  }`}
                  onClick={() => {
                    // Open preview in new tab/window
                    const win = window.open('', '_blank');
                    win.document.write(`
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <meta charset="UTF-8">
                          <meta name="viewport" content="width=device-width, initial-scale=1.0">
                          <title>${playgroundTitle}</title>
                          ${reactEnabled ? `
                            <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
                            <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
                          ` : ''}
                          ${tailwindEnabled ? `
                            <script src="https://cdn.tailwindcss.com"></script>
                          ` : ''}
                          <style>
                            ${code.css}
                          </style>
                        </head>
                        <body>
                          ${code.html}
                          <script>
                            ${code.js}
                          </script>
                        </body>
                      </html>
                    `);
                    win.document.close();
                  }}
                  title="Open in new tab"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 relative bg-white">
              {previewLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                  <div className="animate-spin h-6 w-6 border-2 border-primary-500 border-t-transparent rounded-full"></div>
                </div>
              )}
              
              {previewError && (
                <div className="absolute bottom-0 left-0 right-0 bg-error-100 text-error-800 p-2 text-sm font-mono border-t border-error-200">
                  <div className="flex items-start">
                    <div className="mr-2 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      {previewError}
                    </div>
                    <button
                      className="ml-2 text-error-600 hover:text-error-800"
                      onClick={() => setPreviewError(null)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
              
              <iframe
                ref={previewIframeRef}
                title="Preview"
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-modals"
                loading="lazy"
              ></iframe>
            </div>
          </div>
        )}
      </div>
      
      {/* Settings modal */}
      {settingsOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/50" 
            onClick={() => setSettingsOpen(false)}
          />
          <div className={`absolute z-50 w-72 top-12 right-4 rounded-lg shadow-lg ${
            theme === 'dark' ? 'bg-neutral-800 border border-neutral-700' : 'bg-white border border-neutral-200'
          }`}>
            <div className={`flex items-center justify-between px-4 py-3 border-b ${
              theme === 'dark' ? 'border-neutral-700' : 'border-neutral-200'
            }`}>
              <h3 className={`text-sm font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-neutral-900'
              }`}>
                Playground Settings
              </h3>
              <button 
                className={`text-neutral-500 hover:text-neutral-700`}
                onClick={() => setSettingsOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="space-y-4">
                {/* Libraries */}
                <div>
                  <h4 className={`text-xs font-semibold uppercase mb-2 ${
                    theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
                  }`}>
                    Libraries
                  </h4>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className={`flex items-center text-sm ${
                        theme === 'dark' ? 'text-neutral-200' : 'text-neutral-800'
                      }`}>
                        <input
                          type="checkbox"
                          className="form-checkbox mr-2"
                          checked={reactEnabled}
                          onChange={() => setReactEnabled(!reactEnabled)}
                        />
                        React
                      </label>
                      <span className={`text-xs ${
                        theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
                      }`}>
                        v17.0.2
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className={`flex items-center text-sm ${
                        theme === 'dark' ? 'text-neutral-200' : 'text-neutral-800'
                      }`}>
                        <input
                          type="checkbox"
                          className="form-checkbox mr-2"
                          checked={tailwindEnabled}
                          onChange={() => setTailwindEnabled(!tailwindEnabled)}
                        />
                        Tailwind CSS
                      </label>
                      <span className={`text-xs ${
                        theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
                      }`}>
                        v2.2.19
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Behavior */}
                <div>
                  <h4 className={`text-xs font-semibold uppercase mb-2 ${
                    theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
                  }`}>
                    Behavior
                  </h4>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className={`flex items-center text-sm ${
                        theme === 'dark' ? 'text-neutral-200' : 'text-neutral-800'
                      }`}>
                        <input
                          type="checkbox"
                          className="form-checkbox mr-2"
                          checked={autoRefresh}
                          onChange={() => setAutoRefresh(!autoRefresh)}
                        />
                        Auto-refresh preview
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Keyboard shortcuts */}
                <div>
                  <h4 className={`text-xs font-semibold uppercase mb-2 ${
                    theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'
                  }`}>
                    Keyboard Shortcuts
                  </h4>
                  
                  <div className={`p-2 rounded text-xs font-mono ${
                    theme === 'dark' ? 'bg-neutral-900 text-neutral-300' : 'bg-neutral-100 text-neutral-700'
                  }`}>
                    <div className="flex justify-between mb-1">
                      <span>Run Code</span>
                      <span>Ctrl+Enter</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Save</span>
                      <span>Ctrl+S</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Format Code</span>
                      <span>Shift+Alt+F</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Share dialog */}
      {shareDialogOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/50" 
            onClick={() => setShareDialogOpen(false)}
          />
          <div className={`fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-lg shadow-lg ${
            theme === 'dark' ? 'bg-neutral-800 border border-neutral-700' : 'bg-white border border-neutral-200'
          }`}>
            <div className={`flex items-center justify-between px-4 py-3 border-b ${
              theme === 'dark' ? 'border-neutral-700' : 'border-neutral-200'
            }`}>
              <h3 className={`text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-neutral-900'
              }`}>
                Share Playground
              </h3>
              <button 
                className={`text-neutral-500 hover:text-neutral-700`}
                onClick={() => setShareDialogOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4">
              <p className={`text-sm mb-4 ${
                theme === 'dark' ? 'text-neutral-300' : 'text-neutral-600'
              }`}>
                Share this playground with others. Anyone with the link can view and fork your code.
              </p>
              
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-1 ${
                  theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'
                }`}>
                  Shareable Link
                </label>
                <div className="flex">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className={`flex-1 rounded-l-md text-sm ${
                      theme === 'dark' 
                        ? 'bg-neutral-700 border-neutral-600 text-white' 
                        : 'bg-neutral-50 border-neutral-200 text-neutral-800'
                    }`}
                  />
                  <button
                    className={`px-3 py-2 rounded-r-md ${
                      copied 
                        ? theme === 'dark' 
                          ? 'bg-green-700 text-white' 
                          : 'bg-green-600 text-white'
                        : theme === 'dark' 
                          ? 'bg-neutral-700 text-white hover:bg-neutral-600' 
                          : 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300'
                    }`}
                    onClick={copyShareUrl}
                  >
                    {copied ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Clipboard className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    theme === 'dark' 
                      ? 'bg-neutral-700 text-white hover:bg-neutral-600' 
                      : 'bg-white text-neutral-800 border border-neutral-300 hover:bg-neutral-50'
                  }`}
                  onClick={() => setShareDialogOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CodePlayground;