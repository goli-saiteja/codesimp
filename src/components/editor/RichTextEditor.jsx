import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import CodeEditor from './CodeEditor';
import {
  Bold, Italic, Underline, List, ListOrdered, Link, Image, Code, Quote,
  AlignLeft, AlignCenter, AlignRight, Heading1, Heading2, Heading3,
  PlusCircle, XCircle, Upload, Eye, EyeOff, ChevronDown,
  Type, Palette, Check, HelpCircle, ExternalLink
} from 'lucide-react';

const RichTextEditor = ({
  initialContent = '',
  onChange,
  placeholder = 'Write your article here...',
  minHeight = '400px',
  maxHeight = 'none',
  readOnly = false,
}) => {
  const [content, setContent] = useState(initialContent);
  const [showPreview, setShowPreview] = useState(false);
  const [codeEditorOpen, setCodeEditorOpen] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [codeContent, setCodeContent] = useState('// Enter your code here');
  const [fontDropdownOpen, setFontDropdownOpen] = useState(false);
  const [colorDropdownOpen, setColorDropdownOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [selection, setSelection] = useState(null);
  
  const editorRef = useRef(null);
  const dispatch = useDispatch();
  
  // Supported font families
  const fontFamilies = [
    { name: 'System UI', value: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' },
    { name: 'Serif', value: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' },
    { name: 'Mono', value: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' },
    { name: 'Inter', value: '"Inter", sans-serif' },
    { name: 'Plus Jakarta Sans', value: '"Plus Jakarta Sans", sans-serif' },
    { name: 'Merriweather', value: '"Merriweather", serif' },
  ];
  
  // Supported text colors
  const textColors = [
    { name: 'Default', value: 'inherit' },
    { name: 'Gray', value: '#64748b' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
  ];
  
  // Update the parent component when content changes
  useEffect(() => {
    if (onChange) {
      onChange(content);
    }
  }, [content, onChange]);
  
  // Save the current selection when a formatting button is clicked
  const saveSelection = () => {
    if (window.getSelection) {
      const sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        return sel.getRangeAt(0);
      }
    }
    return null;
  };
  
  // Restore the saved selection
  const restoreSelection = (range) => {
    if (range) {
      if (window.getSelection) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  };
  
  // Execute a formatting command
  const execCommand = (command, value = null) => {
    if (!editorRef.current || readOnly) return;
    
    // Focus the editor if it's not already focused
    editorRef.current.focus();
    
    // Execute the command
    document.execCommand(command, false, value);
    
    // Update the content state
    setContent(editorRef.current.innerHTML);
  };
  
  // Insert a link
  const insertLink = () => {
    if (!linkText || !linkUrl || readOnly) return;
    
    // Restore the saved selection
    restoreSelection(selection);
    
    // Create the link
    const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
    document.execCommand('insertHTML', false, linkHtml);
    
    // Update the content state
    setContent(editorRef.current.innerHTML);
    
    // Close the dialog
    setLinkDialogOpen(false);
    setLinkText('');
    setLinkUrl('');
  };
  
  // Insert a code block
  const insertCodeBlock = () => {
    if (readOnly) return;
    
    // Create a formatted code block
    const codeHtml = `
      <pre class="code-block" data-language="${codeLanguage}">
        <code>${codeContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>
      </pre>
      <p><br></p>
    `;
    
    // Insert the code block
    document.execCommand('insertHTML', false, codeHtml);
    
    // Update the content state
    setContent(editorRef.current.innerHTML);
    
    // Close the code editor
    setCodeEditorOpen(false);
    setCodeContent('// Enter your code here');
  };
  
  // Upload an image
  const uploadImage = async (e) => {
    if (readOnly) return;
    
    const file = e.target.files[0];
    if (!file) return;
    
    // In a real app, you would upload the image to a server
    // and get back a URL. For this example, we'll create a
    // local object URL.
    const imageUrl = URL.createObjectURL(file);
    
    // Insert the image
    document.execCommand('insertImage', false, imageUrl);
    
    // Update the content state
    setContent(editorRef.current.innerHTML);
  };
  
  // Handle content changes
  const handleContentChange = (e) => {
    setContent(e.target.innerHTML);
  };
  
  // Apply a font family
  const applyFontFamily = (fontFamily) => {
    execCommand('fontName', fontFamily);
    setFontDropdownOpen(false);
  };
  
  // Apply a text color
  const applyTextColor = (color) => {
    execCommand('foreColor', color);
    setColorDropdownOpen(false);
  };
  
  // Generate rendered HTML for preview
  const getRenderedHTML = () => {
    // In a real app, you would process the HTML to make it safe
    // and enhance it with syntax highlighting, etc.
    return content;
  };
  
  return (
    <div className="rich-text-editor border border-neutral-200 rounded-lg shadow-soft bg-white overflow-hidden">
      {/* Toolbar */}
      {!readOnly && (
        <div className="rich-editor-toolbar border-b border-neutral-200 bg-neutral-50 flex-wrap">
          {/* Text formatting */}
          <button
            type="button"
            className="p-1.5 text-neutral-700 hover:bg-neutral-200 rounded"
            onClick={() => execCommand('bold')}
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </button>
          
          <button
            type="button"
            className="p-1.5 text-neutral-700 hover:bg-neutral-200 rounded"
            onClick={() => execCommand('italic')}
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </button>
          
          <button
            type="button"
            className="p-1.5 text-neutral-700 hover:bg-neutral-200 rounded"
            onClick={() => execCommand('underline')}
            title="Underline (Ctrl+U)"
          >
            <Underline className="h-4 w-4" />
          </button>
          
          <div className="mx-1 h-6 border-r border-neutral-300"></div>
          
          {/* Headings */}
          <button
            type="button"
            className="p-1.5 text-neutral-700 hover:bg-neutral-200 rounded"
            onClick={() => execCommand('formatBlock', '<h1>')}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </button>
          
          <button
            type="button"
            className="p-1.5 text-neutral-700 hover:bg-neutral-200 rounded"
            onClick={() => execCommand('formatBlock', '<h2>')}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </button>
          
          <button
            type="button"
            className="p-1.5 text-neutral-700 hover:bg-neutral-200 rounded"
            onClick={() => execCommand('formatBlock', '<h3>')}
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </button>
          
          <div className="mx-1 h-6 border-r border-neutral-300"></div>
          
          {/* Font family */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center p-1.5 text-neutral-700 hover:bg-neutral-200 rounded"
              onClick={() => setFontDropdownOpen(!fontDropdownOpen)}
              title="Font Family"
            >
              <Type className="h-4 w-4" />
              <ChevronDown className="ml-1 h-3 w-3" />
            </button>
            
            {fontDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setFontDropdownOpen(false)}
                ></div>
                <div className="absolute left-0 mt-1 w-48 bg-white border border-neutral-200 rounded-md shadow-lg z-20">
                  {fontFamilies.map((font, index) => (
                    <button
                      key={index}
                      type="button"
                      className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-100"
                      style={{ fontFamily: font.value }}
                      onClick={() => applyFontFamily(font.value)}
                    >
                      {font.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          
          {/* Text color */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center p-1.5 text-neutral-700 hover:bg-neutral-200 rounded"
              onClick={() => setColorDropdownOpen(!colorDropdownOpen)}
              title="Text Color"
            >
              <Palette className="h-4 w-4" />
              <ChevronDown className="ml-1 h-3 w-3" />
            </button>
            
            {colorDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setColorDropdownOpen(false)}
                ></div>
                <div className="absolute left-0 mt-1 w-48 bg-white border border-neutral-200 rounded-md shadow-lg z-20">
                  <div className="grid grid-cols-3 gap-1 p-2">
                    {textColors.map((color, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`w-full h-6 rounded-md border ${
                          color.value === 'inherit' ? 'border-neutral-300' : 'border-transparent'
                        }`}
                        style={{ 
                          backgroundColor: color.value === 'inherit' ? 'white' : color.value,
                          color: color.value === 'inherit' ? 'black' : 'white',
                        }}
                        onClick={() => applyTextColor(color.value)}
                        title={color.name}
                      >
                        {color.value === 'inherit' && <span className="text-xs">Default</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="mx-1 h-6 border-r border-neutral-300"></div>
          
          {/* Alignment */}
          <button
            type="button"
            className="p-1.5 text-neutral-700 hover:bg-neutral-200 rounded"
            onClick={() => execCommand('justifyLeft')}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </button>
          
          <button
            type="button"
            className="p-1.5 text-neutral-700 hover:bg-neutral-200 rounded"
            onClick={() => execCommand('justifyCenter')}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </button>
          
          <button
            type="button"
            className="p-1.5 text-neutral-700 hover:bg-neutral-200 rounded"
            onClick={() => execCommand('justifyRight')}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </button>
          
          <div className="mx-1 h-6 border-r border-neutral-300"></div>
          
          {/* Lists */}
          <button
            type="button"
            className="p-1.5 text-neutral-700 hover:bg-neutral-200 rounded"
            onClick={() => execCommand('insertUnorderedList')}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </button>
          
          <button
            type="button"
            className="p-1.5 text-neutral-700 hover:bg-neutral-200 rounded"
            onClick={() => execCommand('insertOrderedList')}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
          
          <div className="mx-1 h-6 border-r border-neutral-300"></div>
          
          {/* Special elements */}
          <button
            type="button"
            className="p-1.5 text-neutral-700 hover:bg-neutral-200 rounded"
            onClick={() => {
              setSelection(saveSelection());
              setLinkDialogOpen(true);
            }}
            title="Insert Link"
          >
            <Link className="h-4 w-4" />
          </button>
          
          <label className="p-1.5 text-neutral-700 hover:bg-neutral-200 rounded cursor-pointer">
            <Image className="h-4 w-4" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={uploadImage}
            />
            <span className="sr-only">Upload Image</span>
          </label>
          
          <button
            type="button"
            className="p-1.5 text-neutral-700 hover:bg-neutral-200 rounded"
            onClick={() => setCodeEditorOpen(true)}
            title="Insert Code Block"
          >
            <Code className="h-4 w-4" />
          </button>
          
          <button
            type="button"
            className="p-1.5 text-neutral-700 hover:bg-neutral-200 rounded"
            onClick={() => execCommand('formatBlock', '<blockquote>')}
            title="Insert Quote"
          >
            <Quote className="h-4 w-4" />
          </button>
          
          <div className="ml-auto"></div>
          
          {/* Preview toggle */}
          <button
            type="button"
            className="flex items-center px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-200 rounded"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? (
              <>
                <EyeOff className="h-4 w-4 mr-1.5" />
                Edit
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-1.5" />
                Preview
              </>
            )}
          </button>
        </div>
      )}
      
      {/* Editor content area */}
      <div 
        className="relative"
        style={{ 
          minHeight, 
          maxHeight: maxHeight !== 'none' ? maxHeight : undefined 
        }}
      >
        {/* Preview mode */}
        {showPreview ? (
          <div 
            className="prose-custom p-4 overflow-auto"
            style={{ 
              minHeight, 
              maxHeight: maxHeight !== 'none' ? maxHeight : undefined 
            }}
            dangerouslySetInnerHTML={{ __html: getRenderedHTML() }}
          ></div>
        ) : (
          /* Edit mode */
          <div 
            ref={editorRef}
            className="rich-editor-content"
            contentEditable={!readOnly}
            dangerouslySetInnerHTML={{ __html: content }}
            onInput={handleContentChange}
            style={{ 
              minHeight, 
              maxHeight: maxHeight !== 'none' ? maxHeight : undefined 
            }}
            placeholder={placeholder}
          ></div>
        )}
      </div>
      
      {/* Link dialog */}
      {linkDialogOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/50" 
            onClick={() => setLinkDialogOpen(false)}
          ></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
              <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
                <h3 className="text-lg font-semibold text-neutral-900">Insert Link</h3>
                <button
                  type="button"
                  className="text-neutral-500 hover:text-neutral-700"
                  onClick={() => setLinkDialogOpen(false)}
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Link Text
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="Enter link text"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    URL
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setLinkDialogOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={insertLink}
                    disabled={!linkText || !linkUrl}
                  >
                    Insert Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Code editor dialog */}
      {codeEditorOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/50" 
            onClick={() => setCodeEditorOpen(false)}
          ></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl">
              <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
                <h3 className="text-lg font-semibold text-neutral-900">Insert Code Block</h3>
                <button
                  type="button"
                  className="text-neutral-500 hover:text-neutral-700"
                  onClick={() => setCodeEditorOpen(false)}
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Language
                  </label>
                  <select
                    className="form-select"
                    value={codeLanguage}
                    onChange={(e) => setCodeLanguage(e.target.value)}
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="jsx">JSX</option>
                    <option value="typescript">TypeScript</option>
                    <option value="tsx">TSX</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                    <option value="scss">SCSS</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="go">Go</option>
                    <option value="rust">Rust</option>
                    <option value="c">C</option>
                    <option value="cpp">C++</option>
                    <option value="csharp">C#</option>
                    <option value="php">PHP</option>
                    <option value="ruby">Ruby</option>
                    <option value="swift">Swift</option>
                    <option value="kotlin">Kotlin</option>
                    <option value="sql">SQL</option>
                    <option value="bash">Bash</option>
                    <option value="json">JSON</option>
                    <option value="markdown">Markdown</option>
                    <option value="yaml">YAML</option>
                  </select>
                </div>
                
                <div className="mb-4 border border-neutral-200 rounded-lg overflow-hidden">
                  <CodeEditor
                    initialCode={codeContent}
                    language={codeLanguage}
                    onChange={(newCode) => setCodeContent(newCode)}
                    minHeight="200px"
                    theme="dark"
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setCodeEditorOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={insertCodeBlock}
                  >
                    Insert Code Block
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RichTextEditor;