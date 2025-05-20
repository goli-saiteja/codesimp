// src/components/code/CodeComparisonViewer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { 
  ChevronDown, ChevronUp, ArrowLeft, ArrowRight, Shuffle, Copy, Check, 
  AlertTriangle, ThumbsUp, ThumbsDown, Maximize2, Minimize2, Download,
  Share2, Code, Play, Terminal, FilePlus, Save, Trash, ChevronRight,
  HelpCircle, LifeBuoy, Award, Zap, RefreshCw, AlignVerticalJustifyCenter
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark, a11yLight, materialLight, materialOceanic, atomDark, duotoneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';

// Code Comparison Viewer - Compare code implementations across different languages
const CodeComparisonViewer = ({ 
  snippets = [],
  title = 'Code Comparison',
  description = '',
  allowEditing = false,
  showMetadata = true,
  onSnippetChange = () => {},
  onSave = () => {},
  onExecute = () => {},
}) => {
  const { darkMode } = useSelector(state => state.ui);
  const [codeSnippets, setCodeSnippets] = useState(snippets);
  const [activeSnippetIndices, setActiveSnippetIndices] = useState([0, 1]);
  const [viewMode, setViewMode] = useState('side-by-side'); // 'side-by-side', 'single', 'overlay'
  const [fullscreen, setFullscreen] = useState(false);
  const [showDifferences, setShowDifferences] = useState(false);
  const [syntaxTheme, setSyntaxTheme] = useState(darkMode ? 'material-oceanic' : 'material-light');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [activeSideMenu, setActiveSideMenu] = useState(''); // 'differences', 'insights', 'stats'
  const containerRef = useRef(null);
  
  // Predefined syntax themes
  const themes = {
    'material-light': materialLight,
    'material-oceanic': materialOceanic,
    'a11y-light': a11yLight,
    'a11y-dark': a11yDark,
    'atom-dark': atomDark,
    'duotone-light': duotoneLight,
  };
  
  // Update theme when dark mode changes
  useEffect(() => {
    setSyntaxTheme(darkMode ? 'material-oceanic' : 'material-light');
  }, [darkMode]);
  
  // Copy code to clipboard
  const copyCode = (index) => {
    navigator.clipboard.writeText(codeSnippets[index].code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
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
  
  // Helper function to get language information
  const getLanguageInfo = (languageName) => {
    const languages = {
      javascript: { 
        color: '#f7df1e', 
        displayName: 'JavaScript',
        description: 'High-level, interpreted programming language',
        paradigm: 'Multi-paradigm: event-driven, functional, imperative',
        typing: 'Dynamic, weak',
        popularity: 1, // Ranking
      },
      typescript: { 
        color: '#3178c6', 
        displayName: 'TypeScript',
        description: 'Strict syntactical superset of JavaScript with static typing',
        paradigm: 'Multi-paradigm: object-oriented, functional',
        typing: 'Static, strong',
        popularity: 4,
      },
      python: { 
        color: '#3776ab', 
        displayName: 'Python',
        description: 'Interpreted, high-level, general-purpose programming language',
        paradigm: 'Multi-paradigm: object-oriented, imperative, functional, procedural',
        typing: 'Dynamic, strong',
        popularity: 2,
      },
      java: { 
        color: '#007396', 
        displayName: 'Java',
        description: 'General-purpose, class-based, object-oriented programming language',
        paradigm: 'Multi-paradigm: object-oriented, structured, imperative, functional, reflective',
        typing: 'Static, strong',
        popularity: 3,
      },
      csharp: { 
        color: '#239120', 
        displayName: 'C#',
        description: 'Multi-paradigm programming language encompassing static typing',
        paradigm: 'Multi-paradigm: structured, imperative, object-oriented, event-driven, functional',
        typing: 'Static, strong',
        popularity: 5,
      },
      cpp: { 
        color: '#f34b7d', 
        displayName: 'C++',
        description: 'General-purpose programming language with imperative, object-oriented features',
        paradigm: 'Multi-paradigm: procedural, functional, object-oriented',
        typing: 'Static, strong',
        popularity: 6,
      },
      go: { 
        color: '#00add8', 
        displayName: 'Go',
        description: 'Statically typed, compiled programming language',
        paradigm: 'Multi-paradigm: concurrent, imperative, structural',
        typing: 'Static, strong',
        popularity: 8,
      },
      rust: { 
        color: '#dea584', 
        displayName: 'Rust',
        description: 'Multi-paradigm, performance oriented language focused on safety',
        paradigm: 'Multi-paradigm: concurrent, functional, imperative, structured',
        typing: 'Static, strong',
        popularity: 9,
      },
      php: { 
        color: '#4f5d95', 
        displayName: 'PHP',
        description: 'General-purpose scripting language for web development',
        paradigm: 'Multi-paradigm: imperative, functional, object-oriented, procedural, reflective',
        typing: 'Dynamic, weak',
        popularity: 7,
      },
    };
    
    const langKey = languageName?.toLowerCase()?.replace(/[^a-z]/g, '') || 'javascript';
    
    return languages[langKey] || { 
      color: '#607d8b', 
      displayName: languageName || 'Unknown',
      description: 'Programming language',
      paradigm: 'Unknown',
      typing: 'Unknown',
      popularity: 99,
    };
  };
  
  // Ensure we have enough active snippets
  useEffect(() => {
    if (codeSnippets.length > 0) {
      if (activeSnippetIndices.length === 0) {
        setActiveSnippetIndices([0]);
      } else if (activeSnippetIndices.length === 1 && viewMode === 'side-by-side') {
        // If we have more than one snippet, add the second one
        if (codeSnippets.length > 1) {
          setActiveSnippetIndices([activeSnippetIndices[0], activeSnippetIndices[0] === 0 ? 1 : 0]);
        }
      }
    }
  }, [codeSnippets, activeSnippetIndices, viewMode]);
  
  // Add a new snippet
  const addSnippet = () => {
    const newSnippet = {
      id: `snippet-${Date.now()}`,
      title: `Snippet ${codeSnippets.length + 1}`,
      language: 'javascript',
      code: '// Add your code here',
      description: '',
      author: '',
      createdAt: new Date().toISOString(),
    };
    
    setCodeSnippets([...codeSnippets, newSnippet]);
    onSnippetChange([...codeSnippets, newSnippet]);
  };
  
  // Delete a snippet
  const deleteSnippet = (index) => {
    if (codeSnippets.length <= 1) return;
    
    const newSnippets = [...codeSnippets];
    newSnippets.splice(index, 1);
    setCodeSnippets(newSnippets);
    onSnippetChange(newSnippets);
    
    // Update active indices if needed
    setActiveSnippetIndices(prev => {
      return prev.filter(i => i !== index).map(i => i > index ? i - 1 : i);
    });
  };
  
  // Update snippet code
  const updateSnippetCode = (index, code) => {
    const newSnippets = [...codeSnippets];
    newSnippets[index] = { ...newSnippets[index], code };
    setCodeSnippets(newSnippets);
    onSnippetChange(newSnippets);
  };
  
  // Update snippet metadata
  const updateSnippetMetadata = (index, data) => {
    const newSnippets = [...codeSnippets];
    newSnippets[index] = { ...newSnippets[index], ...data };
    setCodeSnippets(newSnippets);
    onSnippetChange(newSnippets);
  };
  
  // Analyze code similarities and differences
  const analyzeDifferences = () => {
    if (activeSnippetIndices.length < 2) return [];
    
    const snippet1 = codeSnippets[activeSnippetIndices[0]];
    const snippet2 = codeSnippets[activeSnippetIndices[1]];
    
    if (!snippet1 || !snippet2) return [];
    
    const lines1 = snippet1.code.split('\n');
    const lines2 = snippet2.code.split('\n');
    
    // Simple line-by-line comparison for highlighting
    const maxLines = Math.max(lines1.length, lines2.length);
    const differences = [];
    
    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';
      
      if (line1 !== line2) {
        differences.push(i);
      }
    }
    
    return differences;
  };
  
  // Line highlighting based on differences
  const getLineProps = (lineNumber, snippet) => {
    if (!showDifferences) return {};
    
    const differences = analyzeDifferences();
    
    if (differences.includes(lineNumber)) {
      return {
        style: {
          display: 'block',
          background: snippet === 0 
            ? 'rgba(255, 87, 87, 0.15)' 
            : 'rgba(87, 255, 173, 0.15)'
        }
      };
    }
    
    return {};
  };
  
  // Toggles a snippet between active and inactive
  const toggleSnippet = (index) => {
    if (activeSnippetIndices.includes(index)) {
      // Remove if already active, but ensure at least one remains active
      if (activeSnippetIndices.length > 1) {
        setActiveSnippetIndices(prev => prev.filter(i => i !== index));
      }
    } else {
      // Add if viewMode is side-by-side, replace if single
      if (viewMode === 'side-by-side') {
        setActiveSnippetIndices(prev => [...prev, index].slice(0, 2));
      } else {
        setActiveSnippetIndices([index]);
      }
    }
  };
  
  // Switch to next/previous snippet
  const switchSnippet = (direction) => {
    if (codeSnippets.length <= 1) return;
    
    setActiveSnippetIndices(prev => {
      const current = prev[0];
      let next;
      
      if (direction === 'next') {
        next = (current + 1) % codeSnippets.length;
      } else {
        next = (current - 1 + codeSnippets.length) % codeSnippets.length;
      }
      
      return viewMode === 'side-by-side' && prev.length > 1
        ? [next, (next + 1) % codeSnippets.length]
        : [next];
    });
  };
  
  // Generate code statistics
  const getCodeStats = (snippetIndex) => {
    const snippet = codeSnippets[snippetIndex];
    if (!snippet) return null;
    
    const code = snippet.code;
    const lines = code.split('\n');
    const nonEmptyLines = lines.filter(line => line.trim().length > 0);
    const commentRegex = /\/\/.*$|\/\*[\s\S]*?\*\//gm;
    const codeWithoutComments = code.replace(commentRegex, '');
    const commentLines = code.match(commentRegex)?.length || 0;
    
    // Language-specific metrics
    const metrics = {};
    
    if (snippet.language === 'javascript' || snippet.language === 'typescript') {
      metrics.functions = (code.match(/function\s+\w+\s*\(|const\s+\w+\s*=\s*\(|=>\s*{/g) || []).length;
      metrics.variables = (code.match(/const\s+\w+|let\s+\w+|var\s+\w+/g) || []).length;
      metrics.conditionals = (code.match(/if\s*\(|else\s*{|switch\s*\(/g) || []).length;
      metrics.loops = (code.match(/for\s*\(|while\s*\(|forEach\s*\(/g) || []).length;
    } else if (snippet.language === 'python') {
      metrics.functions = (code.match(/def\s+\w+\s*\(/g) || []).length;
      metrics.conditionals = (code.match(/if\s+|elif\s+|else:/g) || []).length;
      metrics.loops = (code.match(/for\s+|while\s+/g) || []).length;
    } else if (snippet.language === 'java' || snippet.language === 'csharp') {
      metrics.functions = (code.match(/\w+\s+\w+\s*\([^)]*\)\s*{/g) || []).length;
      metrics.classes = (code.match(/class\s+\w+/g) || []).length;
      metrics.conditionals = (code.match(/if\s*\(|else\s*{|switch\s*\(/g) || []).length;
      metrics.loops = (code.match(/for\s*\(|while\s*\(|foreach\s*\(/g) || []).length;
    }
    
    return {
      totalLines: lines.length,
      codeLines: nonEmptyLines.length - commentLines,
      commentLines,
      commentPercentage: Math.round((commentLines / nonEmptyLines.length) * 100) || 0,
      charactersPerLine: Math.round(code.length / lines.length) || 0,
      ...metrics,
    };
  };
  
  // Code insights for comparison
  const getCodeInsights = () => {
    if (activeSnippetIndices.length < 2) return [];
    
    const snippet1 = codeSnippets[activeSnippetIndices[0]];
    const snippet2 = codeSnippets[activeSnippetIndices[1]];
    
    if (!snippet1 || !snippet2) return [];
    
    const stats1 = getCodeStats(activeSnippetIndices[0]);
    const stats2 = getCodeStats(activeSnippetIndices[1]);
    
    const insights = [];
    
    // Compare code length
    if (stats1.totalLines !== stats2.totalLines) {
      const diff = Math.abs(stats1.totalLines - stats2.totalLines);
      const percentage = Math.round((diff / Math.min(stats1.totalLines, stats2.totalLines)) * 100);
      
      insights.push({
        type: 'length',
        title: 'Code Length Difference',
        description: `${snippet1.language} implementation ${stats1.totalLines < stats2.totalLines ? 'is' : 'is not'} more concise (${percentage}% ${stats1.totalLines < stats2.totalLines ? 'fewer' : 'more'} lines)`,
        icon: <AlignVerticalJustifyCenter size={16} />,
      });
    }
    
    // Compare commenting practices
    if (Math.abs(stats1.commentPercentage - stats2.commentPercentage) > 5) {
      insights.push({
        type: 'comments',
        title: 'Documentation Difference',
        description: `${stats1.commentPercentage > stats2.commentPercentage ? snippet1.language : snippet2.language} has better code documentation (${Math.max(stats1.commentPercentage, stats2.commentPercentage)}% vs ${Math.min(stats1.commentPercentage, stats2.commentPercentage)}%)`,
        icon: <Terminal size={16} />,
      });
    }
    
    // Compare language features if available
    if (stats1.functions !== undefined && stats2.functions !== undefined) {
      if (stats1.functions !== stats2.functions) {
        insights.push({
          type: 'structure',
          title: 'Code Structure',
          description: `${stats1.functions < stats2.functions ? snippet1.language : snippet2.language} implementation uses fewer functions (${Math.min(stats1.functions, stats2.functions)} vs ${Math.max(stats1.functions, stats2.functions)})`,
          icon: <Code size={16} />,
        });
      }
    }
    
    // Language-specific insights
    const lang1Info = getLanguageInfo(snippet1.language);
    const lang2Info = getLanguageInfo(snippet2.language);
    
    if (lang1Info.typing !== lang2Info.typing) {
      insights.push({
        type: 'language',
        title: 'Type System Difference',
        description: `${lang1Info.displayName} uses ${lang1Info.typing} typing while ${lang2Info.displayName} uses ${lang2Info.typing} typing`,
        icon: <HelpCircle size={16} />,
      });
    }
    
    if (lang1Info.popularity !== lang2Info.popularity) {
      insights.push({
        type: 'popularity',
        title: 'Language Popularity',
        description: `${lang1Info.popularity < lang2Info.popularity ? lang1Info.displayName : lang2Info.displayName} is more widely used in the industry`,
        icon: <Award size={16} />,
      });
    }
    
    return insights;
  };
  
  // Share comparison
  const shareComparison = () => {
    // Generate a shareable link or copy to clipboard
    const shareableData = {
      snippets: codeSnippets,
      activeIndices: activeSnippetIndices,
      viewMode,
    };
    
    // In a real app, you might want to store this in a database and generate a shorter URL
    const shareableString = encodeURIComponent(JSON.stringify(shareableData));
    const shareUrl = `${window.location.origin}/compare?data=${shareableString}`;
    
    navigator.clipboard.writeText(shareUrl);
    
    // Show toast notification
    alert('Shareable link copied to clipboard!');
  };
  
  // Download as file
  const downloadComparison = () => {
    const snippetsToDownload = activeSnippetIndices.map(index => codeSnippets[index]);
    
    let content = `# ${title}\n\n`;
    if (description) {
      content += `${description}\n\n`;
    }
    
    snippetsToDownload.forEach(snippet => {
      content += `## ${snippet.title} (${snippet.language})\n\n`;
      content += '```' + snippet.language + '\n';
      content += snippet.code + '\n';
      content += '```\n\n';
      
      if (snippet.description) {
        content += snippet.description + '\n\n';
      }
    });
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-comparison.md`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  // Render specific menu panels
  const renderSideMenu = () => {
    switch (activeSideMenu) {
      case 'differences':
        const differences = analyzeDifferences();
        return (
          <div className="p-4">
            <h3 className="text-sm font-semibold mb-2">Code Differences</h3>
            {differences.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Found {differences.length} lines with differences
                </p>
                <div className="max-h-40 overflow-y-auto">
                  {differences.map(line => (
                    <div 
                      key={line} 
                      className="text-xs py-1 px-2 bg-gray-100 dark:bg-gray-800 rounded mb-1"
                    >
                      Line {line + 1}
                    </div>
                  ))}
                </div>
                <button
                  className="w-full mt-2 px-3 py-1.5 bg-primary text-white text-xs rounded-md hover:bg-primary-dark"
                  onClick={() => setShowDifferences(!showDifferences)}
                >
                  {showDifferences ? 'Hide Highlighting' : 'Highlight Differences'}
                </button>
              </div>
            ) : (
              <div className="text-center py-4">
                <AlertTriangle size={24} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No differences found or no comparison available
                </p>
              </div>
            )}
          </div>
        );
        
      case 'insights':
        const insights = getCodeInsights();
        return (
          <div className="p-4">
            <h3 className="text-sm font-semibold mb-2">Code Insights</h3>
            {insights.length > 0 ? (
              <div className="space-y-2">
                {insights.map((insight, index) => (
                  <div 
                    key={index}
                    className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md"
                  >
                    <div className="flex items-center mb-1">
                      <span className="mr-1.5 text-primary">{insight.icon}</span>
                      <h4 className="text-xs font-medium">{insight.title}</h4>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      {insight.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Zap size={24} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Select two snippets to see insights
                </p>
              </div>
            )}
          </div>
        );
        
      case 'stats':
        return (
          <div className="p-4">
            <h3 className="text-sm font-semibold mb-2">Code Statistics</h3>
            {activeSnippetIndices.map(index => {
              const stats = getCodeStats(index);
              const snippet = codeSnippets[index];
              if (!stats || !snippet) return null;
              
              return (
                <div key={index} className="mb-4">
                  <h4 className="text-xs font-medium mb-2 pb-1 border-b border-gray-200 dark:border-gray-700">
                    {snippet.title} ({snippet.language})
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div className="text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Lines: </span>
                      <span className="font-medium">{stats.totalLines}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Code: </span>
                      <span className="font-medium">{stats.codeLines}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Comments: </span>
                      <span className="font-medium">{stats.commentLines} ({stats.commentPercentage}%)</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Chars/Line: </span>
                      <span className="font-medium">{stats.charactersPerLine}</span>
                    </div>
                    
                    {/* Language-specific metrics */}
                    {stats.functions !== undefined && (
                      <div className="text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Functions: </span>
                        <span className="font-medium">{stats.functions}</span>
                      </div>
                    )}
                    {stats.classes !== undefined && (
                      <div className="text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Classes: </span>
                        <span className="font-medium">{stats.classes}</span>
                      </div>
                    )}
                    {stats.conditionals !== undefined && (
                      <div className="text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Conditionals: </span>
                        <span className="font-medium">{stats.conditionals}</span>
                      </div>
                    )}
                    {stats.loops !== undefined && (
                      <div className="text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Loops: </span>
                        <span className="font-medium">{stats.loops}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {activeSnippetIndices.length === 0 && (
              <div className="text-center py-4">
                <BarChart2 size={24} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Select a snippet to see statistics
                </p>
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Calculate container classes based on view mode
  const containerClasses = {
    'side-by-side': 'grid grid-cols-2 gap-4',
    'single': 'grid grid-cols-1',
    'overlay': 'relative',
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
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Code size={20} className="mr-2 text-primary" />
            {title}
          </h2>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {description}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Help button */}
          <button
            className={`p-2 rounded-md ${
              showHelp ? 'bg-gray-100 dark:bg-gray-800 text-primary' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
            onClick={() => setShowHelp(!showHelp)}
            title="Help"
          >
            <HelpCircle size={18} />
          </button>
          
          {/* View mode toggle */}
          <div className="flex border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
            <button
              className={`p-2 ${
                viewMode === 'single' 
                  ? 'bg-primary text-white' 
                  : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              onClick={() => setViewMode('single')}
              title="Single view"
            >
              <Terminal size={16} />
            </button>
            <button
              className={`p-2 ${
                viewMode === 'side-by-side' 
                  ? 'bg-primary text-white' 
                  : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              onClick={() => setViewMode('side-by-side')}
              title="Side-by-side view"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              className={`p-2 ${
                viewMode === 'overlay' 
                  ? 'bg-primary text-white' 
                  : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              onClick={() => setViewMode('overlay')}
              title="Overlay view"
            >
              <Layers size={16} />
            </button>
          </div>
          
          {/* Actions menu */}
          <div className="flex border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
            <button
              className="p-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={downloadComparison}
              title="Download"
            >
              <Download size={16} />
            </button>
            <button
              className="p-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={shareComparison}
              title="Share"
            >
              <Share2 size={16} />
            </button>
            <button
              className="p-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => setFullscreen(!fullscreen)}
              title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Help panel */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-hidden"
          >
            <div className="p-4">
              <h3 className="text-sm font-semibold mb-2">Using Code Comparison</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-semibold mb-1">Views</h4>
                  <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <Terminal size={14} className="mr-1 mt-0.5 text-primary" />
                      <span><strong>Single:</strong> View one snippet at a time</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowLeft size={14} className="mr-1 mt-0.5 text-primary" />
                      <span><strong>Side-by-side:</strong> Compare two snippets</span>
                    </li>
                    <li className="flex items-start">
                      <Layers size={14} className="mr-1 mt-0.5 text-primary" />
                      <span><strong>Overlay:</strong> View snippets stacked for direct comparison</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold mb-1">Analysis</h4>
                  <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <AlertTriangle size={14} className="mr-1 mt-0.5 text-primary" />
                      <span><strong>Differences:</strong> Highlight code differences</span>
                    </li>
                    <li className="flex items-start">
                      <Zap size={14} className="mr-1 mt-0.5 text-primary" />
                      <span><strong>Insights:</strong> Get language-specific insights</span>
                    </li>
                    <li className="flex items-start">
                      <BarChart2 size={14} className="mr-1 mt-0.5 text-primary" />
                      <span><strong>Statistics:</strong> View code metrics</span>
                    </li>
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
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Snippets selector */}
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-1 overflow-x-auto">
          {codeSnippets.map((snippet, index) => {
            const isActive = activeSnippetIndices.includes(index);
            const languageInfo = getLanguageInfo(snippet.language);
            
            return (
              <button
                key={snippet.id}
                className={`flex items-center px-3 py-1.5 text-xs rounded-md mr-1 whitespace-nowrap ${
                  isActive 
                    ? 'bg-primary text-white' 
                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => toggleSnippet(index)}
              >
                <div 
                  className="w-2 h-2 rounded-full mr-1.5"
                  style={{ backgroundColor: languageInfo.color }}
                ></div>
                <span>{snippet.title}</span>
              </button>
            );
          })}
          
          {allowEditing && (
            <button
              className="flex items-center px-3 py-1.5 text-xs bg-white dark:bg-gray-900 text-primary border border-primary/30 rounded-md hover:bg-primary/5"
              onClick={addSnippet}
            >
              <FilePlus size={14} className="mr-1" />
              <span>Add</span>
            </button>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          {/* Navigation buttons for single view */}
          {viewMode === 'single' && codeSnippets.length > 1 && (
            <div className="flex border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
              <button
                className="p-1.5 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => switchSnippet('prev')}
              >
                <ChevronLeft size={14} />
              </button>
              <button
                className="p-1.5 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => switchSnippet('next')}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
          
          {/* Analysis tools */}
          <div className="flex border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
            <button
              className={`p-1.5 ${
                activeSideMenu === 'differences' 
                  ? 'bg-primary text-white' 
                  : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveSideMenu(activeSideMenu === 'differences' ? '' : 'differences')}
              title="Show differences"
            >
              <AlertTriangle size={14} />
            </button>
            <button
              className={`p-1.5 ${
                activeSideMenu === 'insights' 
                  ? 'bg-primary text-white' 
                  : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveSideMenu(activeSideMenu === 'insights' ? '' : 'insights')}
              title="Code insights"
            >
              <Zap size={14} />
            </button>
            <button
              className={`p-1.5 ${
                activeSideMenu === 'stats' 
                  ? 'bg-primary text-white' 
                  : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveSideMenu(activeSideMenu === 'stats' ? '' : 'stats')}
              title="Code statistics"
            >
              <BarChart2 size={14} />
            </button>
          </div>
          
          {/* Theme selector */}
          <select
            className="text-xs p-1.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300"
            value={syntaxTheme}
            onChange={(e) => setSyntaxTheme(e.target.value)}
          >
            <option value="material-light">Material Light</option>
            <option value="material-oceanic">Material Dark</option>
            <option value="a11y-light">A11y Light</option>
            <option value="a11y-dark">A11y Dark</option>
            <option value="atom-dark">Atom Dark</option>
            <option value="duotone-light">Duotone Light</option>
          </select>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex">
        {/* Code snippets */}
        <div className={`flex-1 overflow-auto ${activeSideMenu ? 'border-r border-gray-200 dark:border-gray-700' : ''}`}>
          <div className={`p-4 ${containerClasses[viewMode]}`}>
            {activeSnippetIndices.map((snippetIndex, displayIndex) => {
              const snippet = codeSnippets[snippetIndex];
              if (!snippet) return null;
              
              const languageInfo = getLanguageInfo(snippet.language);
              
              return (
                <div
                  key={snippet.id}
                  className="relative"
                  style={{
                    zIndex: viewMode === 'overlay' ? displayIndex + 1 : 'auto',
                    opacity: viewMode === 'overlay' && displayIndex === 1 ? 0.7 : 1,
                  }}
                >
                  {showMetadata && (
                    <div className="mb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: languageInfo.color }}
                          ></div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            {snippet.title}
                          </h3>
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                            {languageInfo.displayName}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <button
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            onClick={() => copyCode(snippetIndex)}
                            title="Copy code"
                          >
                            {copiedIndex === snippetIndex ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                          
                          {allowEditing && (
                            <button
                              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              onClick={() => deleteSnippet(snippetIndex)}
                              title="Delete snippet"
                            >
                              <Trash size={14} />
                            </button>
                          )}
                          
                          {onExecute && (
                            <button
                              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              onClick={() => onExecute(snippet)}
                              title="Run code"
                            >
                              <Play size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                      {snippet.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                          {snippet.description}
                        </p>
                      )}
                    </div>
                  )}
                  
                  <div className={`rounded-md overflow-hidden ${
                    viewMode === 'overlay' ? 'absolute inset-0 top-8' : ''
                  }`}>
                    <SyntaxHighlighter
                      language={snippet.language?.toLowerCase() || 'javascript'}
                      style={themes[syntaxTheme] || themes['material-oceanic']}
                      showLineNumbers
                      wrapLines
                      lineProps={(lineNumber) => getLineProps(lineNumber, displayIndex)}
                      customStyle={{ margin: 0, borderRadius: 4 }}
                    >
                      {snippet.code}
                    </SyntaxHighlighter>
                  </div>
                </div>
              );
            })}
            
            {activeSnippetIndices.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Code size={36} className="mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                  No snippets selected
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Select a snippet from above to start comparing
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Side panel */}
        {activeSideMenu && (
          <div className="w-64 flex-shrink-0 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
            {renderSideMenu()}
          </div>
        )}
      </div>
      
      {/* Actions footer */}
      {allowEditing && activeSnippetIndices.length > 0 && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-end">
          <button
            className="px-4 py-1.5 bg-primary text-white text-sm rounded-md hover:bg-primary-dark"
            onClick={() => onSave(codeSnippets)}
          >
            <Save size={16} className="inline-block mr-1.5" />
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

// Helper component for left chevron icon
const ChevronLeft = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 24}
    height={props.size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

export default CodeComparisonViewer;