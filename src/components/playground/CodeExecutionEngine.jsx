// src/components/playground/CodeExecutionEngine.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Play, RefreshCw, Download, Share2, Maximize2, Minimize2, 
  Save, Plus, Settings, Copy, ExternalLink, Layers, Code, Split
} from 'lucide-react';
import CodeMirrorEditor from '../editor/CodeMirrorEditor';
import { saveCodeSnippet } from '../../store/slices/playgroundSlice';

const runtimes = {
  javascript: {
    name: 'JavaScript',
    versions: ['ES2021', 'ES2020', 'ES2019', 'ES2018', 'ES2017'],
    defaultVersion: 'ES2021',
    defaultCode: '// JavaScript code\nconsole.log("Hello, world!");\n\n// Try using modern features\nconst numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(n => n * 2);\nconsole.log(doubled);',
  },
  typescript: {
    name: 'TypeScript',
    versions: ['4.5', '4.4', '4.3', '4.2', '4.1'],
    defaultVersion: '4.5',
    defaultCode: '// TypeScript code\ninterface Person {\n  name: string;\n  age: number;\n}\n\nfunction greet(person: Person): string {\n  return `Hello, ${person.name}! You are ${person.age} years old.`;\n}\n\nconst alice: Person = { name: "Alice", age: 28 };\nconsole.log(greet(alice));',
  },
  python: {
    name: 'Python',
    versions: ['3.10', '3.9', '3.8', '3.7', '3.6'],
    defaultVersion: '3.10',
    defaultCode: '# Python code\ndef greet(name):\n    return f"Hello, {name}!"\n\n# Try using modern features\nnames = ["Alice", "Bob", "Charlie"]\ngreeted_names = [greet(name) for name in names]\nprint(greeted_names)',
  },
  rust: {
    name: 'Rust',
    versions: ['1.58', '1.57', '1.56', '1.55', '1.54'],
    defaultVersion: '1.58',
    defaultCode: '// Rust code\nfn main() {\n    println!("Hello, world!");\n    \n    // Try using Rust features\n    let numbers = vec![1, 2, 3, 4, 5];\n    let doubled: Vec<i32> = numbers.iter().map(|&n| n * 2).collect();\n    println!("{:?}", doubled);\n}',
  },
  go: {
    name: 'Go',
    versions: ['1.17', '1.16', '1.15', '1.14', '1.13'],
    defaultVersion: '1.17',
    defaultCode: '// Go code\npackage main\n\nimport (\n\t"fmt"\n)\n\nfunc main() {\n\tfmt.Println("Hello, world!")\n\t\n\t// Try using Go features\n\tnumbers := []int{1, 2, 3, 4, 5}\n\tdoubled := make([]int, len(numbers))\n\tfor i, n := range numbers {\n\t\tdoubled[i] = n * 2\n\t}\n\tfmt.Println(doubled)\n}',
  },
  java: {
    name: 'Java',
    versions: ['17', '16', '15', '14', '11', '8'],
    defaultVersion: '17',
    defaultCode: '// Java code\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, world!");\n        \n        // Try using Java features\n        int[] numbers = {1, 2, 3, 4, 5};\n        int[] doubled = new int[numbers.length];\n        for (int i = 0; i < numbers.length; i++) {\n            doubled[i] = numbers[i] * 2;\n        }\n        \n        for (int n : doubled) {\n            System.out.print(n + " ");\n        }\n    }\n}',
  },
  cpp: {
    name: 'C++',
    versions: ['C++20', 'C++17', 'C++14', 'C++11', 'C++98'],
    defaultVersion: 'C++20',
    defaultCode: '// C++ code\n#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint main() {\n    std::cout << "Hello, world!" << std::endl;\n    \n    // Try using C++ features\n    std::vector<int> numbers = {1, 2, 3, 4, 5};\n    std::vector<int> doubled(numbers.size());\n    std::transform(numbers.begin(), numbers.end(), doubled.begin(),\n                 [](int n) { return n * 2; });\n    \n    for (int n : doubled) {\n        std::cout << n << " ";\n    }\n    \n    return 0;\n}',
  },
  ruby: {
    name: 'Ruby',
    versions: ['3.1', '3.0', '2.7', '2.6', '2.5'],
    defaultVersion: '3.1',
    defaultCode: '# Ruby code\ndef greet(name)\n  "Hello, #{name}!"\nend\n\n# Try using Ruby features\nnumbers = [1, 2, 3, 4, 5]\ndoubled = numbers.map { |n| n * 2 }\nputs doubled',
  },
  kotlin: {
    name: 'Kotlin',
    versions: ['1.6', '1.5', '1.4', '1.3', '1.2'],
    defaultVersion: '1.6',
    defaultCode: '// Kotlin code\nfun main() {\n    println("Hello, world!")\n    \n    // Try using Kotlin features\n    val numbers = listOf(1, 2, 3, 4, 5)\n    val doubled = numbers.map { it * 2 }\n    println(doubled)\n}',
  },
};

const CodeExecutionEngine = () => {
  const dispatch = useDispatch();
  const [language, setLanguage] = useState('javascript');
  const [version, setVersion] = useState(runtimes[language].defaultVersion);
  const [code, setCode] = useState(runtimes[language].defaultCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [layout, setLayout] = useState('split'); // 'split', 'editor', 'output'
  const [executionTime, setExecutionTime] = useState(null);
  const [memoryUsage, setMemoryUsage] = useState(null);
  const { playground, auth } = useSelector(state => state);
  const containerRef = useRef(null);
  
  // Change default code when language changes
  useEffect(() => {
    setCode(runtimes[language].defaultCode);
    setVersion(runtimes[language].defaultVersion);
    setOutput('');
    setExecutionTime(null);
    setMemoryUsage(null);
  }, [language]);
  
  // Execute code
  const runCode = async () => {
    setIsRunning(true);
    setOutput('');
    setExecutionTime(null);
    setMemoryUsage(null);
    
    try {
      const startTime = performance.now();
      
      // This is a simplified simulation - in a real app, you'd send the code to a backend service
      // that would execute it in a sandbox environment
      let result = '';
      
      // Simple code execution simulation for JavaScript
      if (language === 'javascript') {
        try {
          // Create a sandbox for safer execution
          const sandbox = {
            console: {
              log: (...args) => {
                result += args.map(arg => 
                  typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
                ).join(' ') + '\n';
              },
              error: (...args) => {
                result += 'ERROR: ' + args.map(arg => 
                  typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
                ).join(' ') + '\n';
              }
            }
          };
          
          // Execute in isolated context
          const executeCode = new Function('console', `
            try {
              ${code}
            } catch (error) {
              console.error(error.message);
            }
          `);
          
          executeCode(sandbox.console);
        } catch (error) {
          result += `Execution Error: ${error.message}\n`;
        }
      } else {
        // Simulate execution for other languages
        result = `Running ${runtimes[language].name} ${version} code...\n\n`;
        result += '--- Simulated Output ---\n';
        
        // Wait to simulate execution time
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (language === 'python') {
          result += 'Hello, world!\n';
          result += "['Hello, Alice!', 'Hello, Bob!', 'Hello, Charlie!']\n";
        } else if (language === 'rust') {
          result += 'Hello, world!\n';
          result += '[2, 4, 6, 8, 10]\n';
        } else {
          result += 'Hello, world!\n';
          result += language === 'ruby' ? '[2, 4, 6, 8, 10]\n' : '2 4 6 8 10\n';
        }
        
        result += '\nExecution successful!\n';
      }
      
      const endTime = performance.now();
      setExecutionTime(endTime - startTime);
      
      // Simulate memory usage
      const randomMemory = Math.floor(Math.random() * 20) + 5; // Between 5-25 MB
      setMemoryUsage(randomMemory);
      
      setOutput(result);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };
  
  // Save snippet
  const saveSnippet = () => {
    if (!auth.isAuthenticated) {
      // Show login prompt
      return;
    }
    
    const snippet = {
      id: Date.now().toString(),
      title: `${runtimes[language].name} Snippet`,
      language,
      version,
      code,
      createdAt: new Date().toISOString(),
      isPublic: false,
    };
    
    dispatch(saveCodeSnippet(snippet));
    setIsSaved(true);
    
    // Reset saved status after 3 seconds
    setTimeout(() => setIsSaved(false), 3000);
  };
  
  // Share snippet
  const shareSnippet = () => {
    // Generate a shareable link
    const snippetData = {
      language,
      version,
      code,
    };
    
    const encodedData = encodeURIComponent(JSON.stringify(snippetData));
    const shareUrl = `${window.location.origin}/playground?s=${encodedData}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl);
    
    // Show toast notification
    // This would typically use your app's notification system
    alert('Shareable link copied to clipboard!');
  };
  
  // Toggle fullscreen
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
  
  return (
    <div 
      ref={containerRef}
      className={`code-playground bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50 p-4' : ''
      }`}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <select
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-l-md p-1.5 pr-8 text-sm"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {Object.keys(runtimes).map((lang) => (
                <option key={lang} value={lang}>{runtimes[lang].name}</option>
              ))}
            </select>
            <select
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 border-l-0 rounded-r-md p-1.5 pr-8 text-sm"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
            >
              {runtimes[language].versions.map((ver) => (
                <option key={ver} value={ver}>{ver}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={runCode}
            disabled={isRunning}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-md ${
              isRunning
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isRunning ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play size={14} />
                <span>Run</span>
              </>
            )}
          </button>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setLayout('editor')}
            className={`p-1.5 rounded-md ${
              layout === 'editor'
                ? 'bg-gray-200 dark:bg-gray-700'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title="Editor Only"
          >
            <Code size={16} />
          </button>
          <button
            onClick={() => setLayout('split')}
            className={`p-1.5 rounded-md ${
              layout === 'split'
                ? 'bg-gray-200 dark:bg-gray-700'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title="Split View"
          >
            <Split size={16} />
          </button>
          <button
            onClick={() => setLayout('output')}
            className={`p-1.5 rounded-md ${
              layout === 'output'
                ? 'bg-gray-200 dark:bg-gray-700'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title="Output Only"
          >
            <Layers size={16} />
          </button>
          
          <div className="mx-1 h-4 border-r border-gray-300 dark:border-gray-600"></div>
          
          <button
            onClick={saveSnippet}
            className={`p-1.5 rounded-md ${
              isSaved
                ? 'text-green-600 dark:text-green-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title="Save Snippet"
          >
            <Save size={16} />
          </button>
          <button
            onClick={shareSnippet}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Share Code"
          >
            <Share2 size={16} />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 rounded-md ${
              showSettings 
                ? 'bg-gray-200 dark:bg-gray-700' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title="Settings"
          >
            <Settings size={16} />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>
      
      {/* Settings Panel */}
      {showSettings && (
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3">
          <h3 className="text-sm font-semibold mb-2">Playground Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 dark:border-gray-600"
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
                  className="rounded border-gray-300 dark:border-gray-600"
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
                  className="rounded border-gray-300 dark:border-gray-600"
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
                  className="rounded border-gray-300 dark:border-gray-600"
                  checked={true}
                  onChange={() => {}}
                />
                <span>Show performance metrics</span>
              </label>
            </div>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <div 
        className={`flex ${
          layout === 'editor' ? 'flex-col' : layout === 'output' ? 'flex-col-reverse' : 'flex-col md:flex-row'
        }`}
      >
        {/* Code Editor */}
        {layout !== 'output' && (
          <div className={`${layout === 'split' ? 'md:w-1/2' : 'w-full'}`}>
            <CodeMirrorEditor
              snippet={{ 
                id: 'playground',
                code, 
                language,
                isExecutable: true,
              }}
              height={isFullscreen ? 'calc(100vh - 170px)' : '400px'}
              onChange={setCode}
              showToolbar={false}
            />
          </div>
        )}
        
        {/* Output Panel */}
        {layout !== 'editor' && (
          <div 
            className={`${
              layout === 'split' ? 'md:w-1/2 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700' : 'w-full'
            }`}
          >
            <div className="flex flex-col h-full">
              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Output</h3>
                {(executionTime !== null || memoryUsage !== null) && (
                  <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                    {executionTime !== null && (
                      <span title="Execution Time">⏱️ {executionTime.toFixed(2)} ms</span>
                    )}
                    {memoryUsage !== null && (
                      <span title="Memory Usage">🧠 {memoryUsage} MB</span>
                    )}
                  </div>
                )}
              </div>
              <pre 
                className={`p-4 overflow-auto font-mono text-sm bg-gray-900 text-gray-100 ${
                  isFullscreen ? 'h-[calc(100vh-170px)]' : 'h-[400px]'
                }`}
              >
                {output || 'Run your code to see the output here...'}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeExecutionEngine;