import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import CodePlayground from '../components/code/CodePlayground';
import { 
  ArrowLeft, Save, List, Trash2, Star, Share2, 
  Download, Clock, AlertCircle, Info, User, ExternalLink,
  Plus, Check, BookOpen
} from 'lucide-react';

const CodePlaygroundPage = () => {
  const { playgroundId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // State for playground data
  const [playground, setPlayground] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isStarred, setIsStarred] = useState(false);
  
  // Sample templates for new playgrounds
  const templates = [
    {
      id: 'blank',
      name: 'Blank',
      description: 'Start from scratch with a blank template',
      code: {
        html: '<div id="app">\n  <h1>Hello, CodeSiMP!</h1>\n  <p>Start editing to see some magic happen.</p>\n</div>',
        css: 'body {\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;\n  margin: 0;\n  padding: 1rem;\n  color: #213547;\n}\n\nh1 {\n  color: #5b6ef8;\n  margin-bottom: 0.5rem;\n}\n\np {\n  margin: 0.5rem 0;\n}',
        js: 'const app = document.getElementById("app");\nconsole.log("Hello from JavaScript!");\n\n// Uncomment to use React\n// const element = React.createElement("div", null, "Hello React!");\n// ReactDOM.render(element, app);'
      }
    },
    {
      id: 'react',
      name: 'React',
      description: 'Start with a basic React setup',
      code: {
        html: '<div id="root"></div>',
        css: 'body {\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;\n  margin: 0;\n  padding: 1rem;\n  color: #213547;\n}\n\n.app {\n  max-width: 1200px;\n  margin: 0 auto;\n}\n\n.title {\n  color: #5b6ef8;\n  margin-bottom: 1rem;\n}\n\n.card {\n  padding: 1.5rem;\n  border-radius: 8px;\n  background-color: #f9fafb;\n  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);\n}\n\n.button {\n  background-color: #5b6ef8;\n  color: white;\n  border: none;\n  padding: 0.5rem 1rem;\n  border-radius: 4px;\n  cursor: pointer;\n  font-weight: 500;\n  transition: background-color 0.2s;\n}\n\n.button:hover {\n  background-color: #4149eb;\n}',
        js: 'const { useState, useEffect } = React;\n\nfunction App() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div className="app">\n      <h1 className="title">React Counter Example</h1>\n      <div className="card">\n        <p>Count: {count}</p>\n        <button \n          className="button"\n          onClick={() => setCount(count + 1)}\n        >\n          Increment\n        </button>\n      </div>\n    </div>\n  );\n}\n\nReactDOM.render(<App />, document.getElementById("root"));'
      }
    },
    {
      id: 'tailwind',
      name: 'Tailwind CSS',
      description: 'Start with Tailwind CSS enabled',
      code: {
        html: '<div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">\n  <div class="max-w-md w-full bg-white rounded-xl shadow-md overflow-hidden">\n    <div class="p-6">\n      <div class="flex items-center justify-between mb-4">\n        <h2 class="text-xl font-bold text-gray-900">Tailwind CSS Example</h2>\n        <span class="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700">New</span>\n      </div>\n      <p class="text-gray-600 mb-4">This is a simple card component built with Tailwind CSS.</p>\n      <div class="mt-6 flex justify-end">\n        <button class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors" id="action-button">Click me</button>\n      </div>\n    </div>\n  </div>\n</div>',
        css: '/* You can add custom CSS here if needed */',
        js: 'document.getElementById("action-button").addEventListener("click", function() {\n  alert("Button clicked!");\n});'
      }
    }
  ];
  
  // Fetch playground data
  useEffect(() => {
    if (playgroundId === 'new') {
      // Creating a new playground
      setPlayground({
        id: 'new',
        title: 'Untitled Playground',
        code: templates[0].code,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: {
          id: 1,
          name: 'You',
          avatar: '/api/placeholder/40/40',
          username: 'you'
        },
        settings: {
          reactEnabled: false,
          tailwindEnabled: false
        }
      });
      setIsLoading(false);
    } else if (playgroundId) {
      // In a real app, fetch the playground data from an API
      setIsLoading(true);
      setTimeout(() => {
        setPlayground({
          id: playgroundId,
          title: 'React Todo App Example',
          code: {
            html: '<div id="root"></div>',
            css: 'body {\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;\n  margin: 0;\n  padding: 1rem;\n  color: #213547;\n  background-color: #f9fafb;\n}\n\n.app {\n  max-width: 600px;\n  margin: 0 auto;\n}\n\n.title {\n  color: #5b6ef8;\n  margin-bottom: 1rem;\n  text-align: center;\n}\n\n.card {\n  padding: 1.5rem;\n  border-radius: 8px;\n  background-color: white;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);\n  margin-bottom: 1.5rem;\n}\n\n.todo-form {\n  display: flex;\n  margin-bottom: 1rem;\n}\n\n.todo-input {\n  flex: 1;\n  padding: 0.5rem;\n  border: 1px solid #e5e7eb;\n  border-radius: 4px 0 0 4px;\n  font-size: 1rem;\n}\n\n.add-button {\n  background-color: #5b6ef8;\n  color: white;\n  border: none;\n  padding: 0.5rem 1rem;\n  border-radius: 0 4px 4px 0;\n  cursor: pointer;\n  font-weight: 500;\n}\n\n.todo-list {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n}\n\n.todo-item {\n  display: flex;\n  align-items: center;\n  padding: 0.75rem 0;\n  border-bottom: 1px solid #e5e7eb;\n}\n\n.todo-item:last-child {\n  border-bottom: none;\n}\n\n.todo-checkbox {\n  margin-right: 0.75rem;\n}\n\n.todo-text {\n  flex: 1;\n}\n\n.todo-text.completed {\n  text-decoration: line-through;\n  color: #9ca3af;\n}\n\n.delete-button {\n  background-color: #ef4444;\n  color: white;\n  border: none;\n  padding: 0.25rem 0.5rem;\n  border-radius: 4px;\n  cursor: pointer;\n  font-size: 0.75rem;\n}',
            js: 'const { useState, useEffect } = React;\n\nfunction TodoApp() {\n  const [todos, setTodos] = useState([]);\n  const [newTodo, setNewTodo] = useState("");\n  \n  useEffect(() => {\n    // Load todos from localStorage if available\n    const savedTodos = localStorage.getItem("todos");\n    if (savedTodos) {\n      setTodos(JSON.parse(savedTodos));\n    }\n  }, []);\n  \n  useEffect(() => {\n    // Save todos to localStorage when they change\n    localStorage.setItem("todos", JSON.stringify(todos));\n  }, [todos]);\n  \n  const addTodo = (e) => {\n    e.preventDefault();\n    if (!newTodo.trim()) return;\n    \n    setTodos([...todos, {\n      id: Date.now(),\n      text: newTodo,\n      completed: false\n    }]);\n    setNewTodo("");\n  };\n  \n  const toggleTodo = (id) => {\n    setTodos(todos.map(todo => \n      todo.id === id ? { ...todo, completed: !todo.completed } : todo\n    ));\n  };\n  \n  const deleteTodo = (id) => {\n    setTodos(todos.filter(todo => todo.id !== id));\n  };\n  \n  return (\n    <div className="app">\n      <h1 className="title">React Todo App</h1>\n      \n      <div className="card">\n        <form className="todo-form" onSubmit={addTodo}>\n          <input\n            type="text"\n            className="todo-input"\n            placeholder="Add a new todo..."\n            value={newTodo}\n            onChange={(e) => setNewTodo(e.target.value)}\n          />\n          <button type="submit" className="add-button">Add</button>\n        </form>\n        \n        {todos.length === 0 ? (\n          <p className="text-center text-gray-500">No todos yet. Add one above!</p>\n        ) : (\n          <ul className="todo-list">\n            {todos.map(todo => (\n              <li key={todo.id} className="todo-item">\n                <input\n                  type="checkbox"\n                  className="todo-checkbox"\n                  checked={todo.completed}\n                  onChange={() => toggleTodo(todo.id)}\n                />\n                <span className={`todo-text ${todo.completed ? "completed" : ""}`}>\n                  {todo.text}\n                </span>\n                <button\n                  className="delete-button"\n                  onClick={() => deleteTodo(todo.id)}\n                >\n                  Delete\n                </button>\n              </li>\n            ))}\n          </ul>\n        )}\n      </div>\n      \n      <div className="text-center text-gray-500 text-sm">\n        Data is saved in your browser\'s localStorage\n      </div>\n    </div>\n  );\n}\n\nReactDOM.render(<TodoApp />, document.getElementById("root"));'
          },
          createdAt: '2023-05-10T14:30:00Z',
          updatedAt: '2023-05-12T09:45:00Z',
          author: {
            id: 2,
            name: 'Sarah Chen',
            avatar: '/api/placeholder/40/40',
            username: 'sarahchen'
          },
          settings: {
            reactEnabled: true,
            tailwindEnabled: false
          },
          views: 1432,
          stars: 78,
          forks: 23
        });
        setIsStarred(false);
        setIsLoading(false);
      }, 1000);
    }
  }, [playgroundId]);
  
  // Handle saving the playground
  const handleSave = async (playgroundData) => {
    setIsSaving(true);
    
    try {
      // In a real app, make an API call to save the playground
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the playground data
      setPlayground({
        ...playground,
        ...playgroundData,
        updatedAt: new Date().toISOString()
      });
      
      setSuccessMessage('Playground saved successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // If this is a new playground, redirect to the saved playground URL
      if (playgroundId === 'new') {
        const newId = Math.floor(Math.random() * 10000);
        navigate(`/playground/${newId}`, { replace: true });
      }
    } catch (error) {
      setError('Failed to save playground');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Toggle starring the playground
  const toggleStar = async () => {
    try {
      // In a real app, make an API call to toggle star
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsStarred(!isStarred);
      
      // Update the star count
      if (playground.stars) {
        setPlayground({
          ...playground,
          stars: isStarred ? playground.stars - 1 : playground.stars + 1
        });
      }
    } catch (error) {
      setError('Failed to star playground');
      setTimeout(() => setError(null), 3000);
    }
  };
  
  // Create a fork of the playground
  const forkPlayground = async () => {
    try {
      // In a real app, make an API call to create a fork
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to the new forked playground
      navigate(`/playground/new`, { state: { forkedFrom: playground } });
    } catch (error) {
      setError('Failed to fork playground');
      setTimeout(() => setError(null), 3000);
    }
  };
  
  // Delete the playground
  const deletePlayground = async () => {
    if (!window.confirm('Are you sure you want to delete this playground?')) {
      return;
    }
    
    try {
      // In a real app, make an API call to delete the playground
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to the playgrounds list
      navigate('/playgrounds');
    } catch (error) {
      setError('Failed to delete playground');
      setTimeout(() => setError(null), 3000);
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Handle creating a new playground from a template
  const createFromTemplate = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;
    
    setPlayground({
      ...playground,
      code: template.code,
      settings: {
        reactEnabled: templateId === 'react',
        tailwindEnabled: templateId === 'tailwind'
      }
    });
  };
  
  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between py-3 px-4 bg-white border-b border-neutral-200">
        <div className="flex items-center">
          <button 
            className="mr-3 p-1.5 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-md"
            onClick={() => navigate(-1)}
            title="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          {playgroundId === 'new' && (
            <div className="flex items-center">
              <h1 className="text-lg font-semibold text-neutral-900 mr-4">
                New Playground
              </h1>
              
              <div className="relative group">
                <button className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-700">
                  Choose template
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div className="absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 hidden group-hover:block">
                  <div className="py-1">
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        className="w-full text-left px-4 py-2 hover:bg-neutral-100"
                        onClick={() => createFromTemplate(template.id)}
                      >
                        <div className="font-medium text-neutral-900">{template.name}</div>
                        <div className="text-sm text-neutral-500">{template.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {playground && playgroundId !== 'new' && (
            <h1 className="text-lg font-semibold text-neutral-900">
              {playground.title}
            </h1>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Save button */}
          <button
            className={`btn-outline btn-sm ${isSaving ? 'opacity-75 cursor-not-allowed' : ''}`}
            onClick={() => handleSave(playground)}
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
          
          {/* Actions for existing playgrounds */}
          {playground && playgroundId !== 'new' && (
            <>
              {/* Fork button */}
              <button
                className="btn-ghost btn-sm"
                onClick={forkPlayground}
                title="Fork this playground"
              >
                <svg className="h-4 w-4 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 5C7 3.89543 7.89543 3 9 3C10.1046 3 11 3.89543 11 5C11 6.10457 10.1046 7 9 7C7.89543 7 7 6.10457 7 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 19C14 17.8954 14.8954 17 16 17C17.1046 17 18 17.8954 18 19C18 20.1046 17.1046 21 16 21C14.8954 21 14 20.1046 14 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 19C7 17.8954 7.89543 17 9 17C10.1046 17 11 17.8954 11 19C11 20.1046 10.1046 21 9 21C7.89543 21 7 20.1046 7 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 17L16 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Fork
              </button>
              
              {/* Star button */}
              <button
                className={`btn-ghost btn-sm ${isStarred ? 'text-yellow-600' : ''}`}
                onClick={toggleStar}
                title={isStarred ? 'Unstar this playground' : 'Star this playground'}
              >
                <Star className={`h-4 w-4 mr-1.5 ${isStarred ? 'fill-yellow-500' : ''}`} />
                {playground.stars || 0}
              </button>
              
              {/* Info button */}
              <button
                className={`p-1.5 rounded-md ${
                  showInfoPanel 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
                onClick={() => setShowInfoPanel(!showInfoPanel)}
                title="Show info"
              >
                <Info className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Success/error messages */}
      {successMessage && (
        <div className="px-4 py-2 bg-success-100 border-b border-success-200 text-success-800 flex items-center">
          <Check className="h-4 w-4 mr-2" />
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="px-4 py-2 bg-error-100 border-b border-error-200 text-error-800 flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
        </div>
      )}
      
      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code playground */}
        <div className={`flex-1 ${showInfoPanel ? 'md:w-2/3' : 'w-full'}`}>
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
            </div>
          ) : playground ? (
            <CodePlayground
              initialCode={playground.code}
              title={playground.title}
              onSave={handleSave}
              includeReact={playground.settings?.reactEnabled}
              includeTailwind={playground.settings?.tailwindEnabled}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-6">
              <BookOpen className="h-12 w-12 text-neutral-300 mb-4" />
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">Playground not found</h3>
              <p className="text-neutral-600 mb-6 text-center">
                The playground you're looking for might have been moved or deleted.
              </p>
              <button 
                className="btn-primary"
                onClick={() => navigate('/playground/new')}
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Create New Playground
              </button>
            </div>
          )}
        </div>
        
        {/* Info panel for existing playgrounds */}
        {showInfoPanel && playground && playgroundId !== 'new' && (
          <div className="hidden md:block md:w-1/3 border-l border-neutral-200 bg-white overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">
                Playground Details
              </h2>
              
              <div className="space-y-6">
                {/* Author info */}
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-2">Author</h3>
                  <div className="flex items-center">
                    <img
                      src={playground.author.avatar}
                      alt={playground.author.name}
                      className="h-10 w-10 rounded-full mr-3"
                    />
                    <div>
                      <div className="font-medium text-neutral-900">
                        {playground.author.name}
                      </div>
                      <div className="text-sm text-neutral-500">
                        @{playground.author.username}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Dates */}
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-2">History</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-neutral-400 mr-2" />
                      <div className="text-sm">
                        <span className="text-neutral-700">Created:</span>
                        <span className="text-neutral-900 ml-2">{formatDate(playground.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-neutral-400 mr-2" />
                      <div className="text-sm">
                        <span className="text-neutral-700">Last updated:</span>
                        <span className="text-neutral-900 ml-2">{formatDate(playground.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Stats */}
                {(playground.views || playground.stars || playground.forks) && (
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 mb-2">Stats</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {playground.views && (
                        <div className="text-center">
                          <div className="text-xl font-bold text-neutral-900">
                            {playground.views.toLocaleString()}
                          </div>
                          <div className="text-xs text-neutral-500">Views</div>
                        </div>
                      )}
                      
                      {playground.stars && (
                        <div className="text-center">
                          <div className="text-xl font-bold text-neutral-900">
                            {playground.stars.toLocaleString()}
                          </div>
                          <div className="text-xs text-neutral-500">Stars</div>
                        </div>
                      )}
                      
                      {playground.forks && (
                        <div className="text-center">
                          <div className="text-xl font-bold text-neutral-900">
                            {playground.forks.toLocaleString()}
                          </div>
                          <div className="text-xs text-neutral-500">Forks</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Settings */}
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-2">Settings</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-neutral-700">React</div>
                      <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        playground.settings?.reactEnabled 
                          ? 'bg-success-100 text-success-800' 
                          : 'bg-neutral-100 text-neutral-800'
                      }`}>
                        {playground.settings?.reactEnabled ? 'Enabled' : 'Disabled'}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-neutral-700">Tailwind CSS</div>
                      <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        playground.settings?.tailwindEnabled 
                          ? 'bg-success-100 text-success-800' 
                          : 'bg-neutral-100 text-neutral-800'
                      }`}>
                        {playground.settings?.tailwindEnabled ? 'Enabled' : 'Disabled'}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-2">Actions</h3>
                  <div className="space-y-2">
                    <button
                      className="w-full flex items-center justify-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50"
                      onClick={forkPlayground}
                    >
                      <svg className="h-4 w-4 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 5C7 3.89543 7.89543 3 9 3C10.1046 3 11 3.89543 11 5C11 6.10457 10.1046 7 9 7C7.89543 7 7 6.10457 7 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 19C14 17.8954 14.8954 17 16 17C17.1046 17 18 17.8954 18 19C18 20.1046 17.1046 21 16 21C14.8954 21 14 20.1046 14 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 19C7 17.8954 7.89543 17 9 17C10.1046 17 11 17.8954 11 19C11 20.1046 10.1046 21 9 21C7.89543 21 7 20.1046 7 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 17L16 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Fork Playground
                    </button>
                    
                    <button
                      className="w-full flex items-center justify-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50"
                      onClick={() => {
                        // Open playground in new tab
                        window.open(`/playground/${playgroundId}/full`, '_blank');
                      }}
                    >
                      <ExternalLink className="h-4 w-4 mr-1.5" />
                      Open in New Tab
                    </button>
                    
                    <button
                      className="w-full flex items-center justify-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50"
                      onClick={downloadPlayground}
                    >
                      <Download className="h-4 w-4 mr-1.5" />
                      Download as HTML
                    </button>
                    
                    <button
                      className="w-full flex items-center justify-center px-4 py-2 border border-neutral-300 rounded-md shadow-sm text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50"
                      onClick={() => {
                        // Generate a shareable URL
                        const shareUrl = `${window.location.origin}/playground/${playgroundId}`;
                        
                        // Copy to clipboard
                        navigator.clipboard.writeText(shareUrl);
                        
                        // Show success message
                        setSuccessMessage('Share link copied to clipboard');
                        setTimeout(() => setSuccessMessage(''), 3000);
                      }}
                    >
                      <Share2 className="h-4 w-4 mr-1.5" />
                      Share Playground
                    </button>
                    
                    {playground.author.username === 'you' && (
                      <button
                        className="w-full flex items-center justify-center px-4 py-2 border border-error-300 rounded-md shadow-sm text-sm font-medium text-error-700 bg-white hover:bg-error-50"
                        onClick={deletePlayground}
                      >
                        <Trash2 className="h-4 w-4 mr-1.5" />
                        Delete Playground
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodePlaygroundPage;