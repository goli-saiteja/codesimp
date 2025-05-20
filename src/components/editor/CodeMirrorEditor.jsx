// src/components/editor/CodeMirrorEditor.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import { java } from '@codemirror/lang-java';
import { rust } from '@codemirror/lang-rust';
import { sql } from '@codemirror/lang-sql';
import { markdown } from '@codemirror/lang-markdown';
import { php } from '@codemirror/lang-php';
import { cpp } from '@codemirror/lang-cpp';
import { json } from '@codemirror/lang-json';
import { EditorView } from '@codemirror/view';
import { githubDark, githubLight } from '@uiw/codemirror-theme-github';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { nord } from '@uiw/codemirror-theme-nord';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { solarizedDark, solarizedLight } from '@uiw/codemirror-theme-solarized';
import { updateCodeSnippet } from '../../store/slices/editorSlice';
import { CornerUpLeft, Copy, Check, Play, Download, Upload, Save, Share2 } from 'lucide-react';

// Language providers mapping
const languageProviders = {
  javascript: javascript({ jsx: true }),
  typescript: javascript({ jsx: true, typescript: true }),
  jsx: javascript({ jsx: true }),
  tsx: javascript({ jsx: true, typescript: true }),
  python: python(),
  css: css(),
  html: html(),
  java: java(),
  rust: rust(),
  sql: sql(),
  markdown: markdown(),
  php: php(),
  cpp: cpp(),
  'c++': cpp(),
  json: json(),
  plaintext: null,
};

// Theme mapping
const themes = {
  'github-dark': githubDark,
  'github-light': githubLight,
  'vs-dark': vscodeDark,
  'dracula': dracula,
  'nord': nord,
  'monokai': okaidia,
  'solarized-dark': solarizedDark,
  'solarized-light': solarizedLight,
};

const CodeMirrorEditor = ({ 
  snippet,
  readOnly = false,
  height = '300px',
  showToolbar = true,
  onChange = () => {},
  onRun = () => {},
}) => {
  const dispatch = useDispatch();
  const { darkMode, codeTheme, codeFontSize, showLineNumbers, wrapCode } = useSelector(state => state.ui);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorRef = useRef(null);
  const [code, setCode] = useState(snippet?.code || '');
  
  // Set the theme based on dark mode and user preference
  const themeKey = codeTheme || (darkMode ? 'github-dark' : 'github-light');
  const theme = themes[themeKey] || themes['github-dark'];
  
  // Get the language provider based on snippet language
  const language = snippet?.language?.toLowerCase() || 'javascript';
  const languageProvider = languageProviders[language] || null;
  
  // Handle code changes
  const handleChange = (value) => {
    setCode(value);
    onChange(value);
    
    if (snippet?.id) {
      dispatch(updateCodeSnippet({
        id: snippet.id,
        code: value,
      }));
    }
  };
  
  // Copy code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    
    if (!isFullscreen) {
      // Enter fullscreen
      document.body.style.overflow = 'hidden';
    } else {
      // Exit fullscreen
      document.body.style.overflow = '';
    }
  };
  
  // Handle 'Run' button click
  const handleRun = () => {
    onRun(code, language);
  };
  
  // Download code as file
  const downloadCode = () => {
    const extension = {
      javascript: 'js',
      typescript: 'ts',
      jsx: 'jsx',
      tsx: 'tsx',
      python: 'py',
      css: 'css',
      html: 'html',
      java: 'java',
      rust: 'rs',
      sql: 'sql',
      markdown: 'md',
      php: 'php',
      cpp: 'cpp',
      'c++': 'cpp',
      json: 'json',
    }[language] || 'txt';
    
    const fileName = `snippet.${extension}`;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  // Upload code from file
  const uploadCode = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setCode(content);
      handleChange(content);
    };
    reader.readAsText(file);
  };
  
  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (isFullscreen) {
        document.body.style.overflow = '';
      }
    };
  }, [isFullscreen]);
  
  // Reset code when snippet changes
  useEffect(() => {
    if (snippet?.code !== undefined) {
      setCode(snippet.code);
    }
  }, [snippet?.code]);
  
  // Extensions for the editor
  const extensions = [
    EditorView.lineWrapping.of(wrapCode),
    EditorView.theme({
      "&": {
        fontSize: `${codeFontSize}px`,
      }
    }),
  ];
  
  if (languageProvider) {
    extensions.push(languageProvider);
  }
  
  return (
    <div 
      className={`code-editor-container rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 ${
        isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900 p-4' : ''
      }`}
      ref={editorRef}
    >
      {showToolbar && (
        <div className="code-editor-toolbar flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {snippet?.title || language.charAt(0).toUpperCase() + language.slice(1)}
            </span>
            
            {snippet?.isExecutable && (
              <button
                onClick={handleRun}
                className="p-1.5 rounded-md text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 dark:text-green-400"
                title="Run code"
              >
                <Play size={16} />
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={copyToClipboard}
              className="p-1.5 rounded-md text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
              title="Copy code"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
            
            <button
              onClick={downloadCode}
              className="p-1.5 rounded-md text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
              title="Download code"
            >
              <Download size={16} />
            </button>
            
            <label className="p-1.5 rounded-md text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 cursor-pointer">
              <Upload size={16} />
              <input
                type="file"
                className="hidden"
                onChange={uploadCode}
                accept=".js,.jsx,.ts,.tsx,.py,.css,.html,.java,.rs,.sql,.md,.php,.cpp,.json,.txt"
              />
            </label>
            
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-md text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              <CornerUpLeft size={16} className={isFullscreen ? "rotate-180" : ""} />
            </button>
          </div>
        </div>
      )}
      
      <CodeMirror
        value={code}
        height={isFullscreen ? "calc(100vh - 80px)" : height}
        theme={theme}
        extensions={extensions}
        onChange={handleChange}
        readOnly={readOnly}
        basicSetup={{
          lineNumbers: showLineNumbers,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          syntaxHighlighting: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          highlightSelectionMatches: true,
          commentToggle: true,
        }}
        className="h-full w-full"
      />
    </div>
  );
};

export default CodeMirrorEditor;