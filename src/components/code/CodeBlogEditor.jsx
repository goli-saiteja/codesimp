// src/components/editor/CodeBlogEditor.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Code, Image, Bold, Italic, List, ListOrdered, Link as LinkIcon, 
  Heading1, Heading2, Quote, Undo, Redo, Check, Save, EyeOff, Eye,
  Plus, X, Settings, ExternalLink, Terminal, FileText, HelpCircle,
  ChevronDown, ChevronUp, Layout, Coffee, Server, Copy, Upload, Clock,
  Highlighter, AlignLeft, AlignCenter, AlignRight, Bookmark, Layers,
  Download, Clipboard, Share2, Cloud, AlertTriangle
} from 'lucide-react';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image as TiptapImage from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import CodeBlock from '@tiptap/extension-code-block';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import { lowlight } from 'lowlight/lib/core';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import js from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import css from 'highlight.js/lib/languages/css';
import html from 'highlight.js/lib/languages/xml';
import java from 'highlight.js/lib/languages/java';
import go from 'highlight.js/lib/languages/go';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight, materialOceanic } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';
import AICodeReviewer from '../ai/AICodeReviewer';
import { updateContent, updateTitle, addTag, removeTag, updateCodeSnippet, startPublishing, finishPublishing, savePost } from '../../store/slices/editorSlice';

// Register languages for code syntax highlighting
lowlight.registerLanguage('javascript', js);
lowlight.registerLanguage('python', python);
lowlight.registerLanguage('css', css);
lowlight.registerLanguage('html', html);
lowlight.registerLanguage('java', java);
lowlight.registerLanguage('go', go);

// Supported code languages
const CODE_LANGUAGES = [
  { name: 'JavaScript', value: 'javascript' },
  { name: 'Python', value: 'python' },
  { name: 'HTML', value: 'html' },
  { name: 'CSS', value: 'css' },
  { name: 'Java', value: 'java' },
  { name: 'Go', value: 'go' },
  { name: 'TypeScript', value: 'typescript' },
  { name: 'Ruby', value: 'ruby' },
  { name: 'PHP', value: 'php' },
  { name: 'C++', value: 'cpp' },
  { name: 'C#', value: 'csharp' },
  { name: 'Rust', value: 'rust' },
  { name: 'Swift', value: 'swift' },
  { name: 'Kotlin', value: 'kotlin' },
  { name: 'Shell/Bash', value: 'bash' },
  { name: 'SQL', value: 'sql' },
  { name: 'JSON', value: 'json' },
  { name: 'Markdown', value: 'markdown' },
  { name: 'YAML', value: 'yaml' },
  { name: 'GraphQL', value: 'graphql' },
];

// ToolbarButton component for editor controls
const ToolbarButton = ({ icon, isActive = false, onClick, tooltip }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-md ${
      isActive 
        ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light' 
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
    }`}
    title={tooltip}
  >
    {icon}
  </button>
);

// MenuDivider component for toolbar separators
const MenuDivider = () => (
  <div className="h-6 border-l border-gray-200 dark:border-gray-700 mx-1"></div>
);

// CodeBlogEditor component
const CodeBlogEditor = ({
  initialContent = null,
  onSave = () => {},
  onPublish = () => {},
}) => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector(state => state.ui);
  const { 
    content, title, isDraft, isPublishing, postId, tags, 
    codeSnippets, lastSaved 
  } = useSelector(state => state.editor);
  
  const [previewMode, setPreviewMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [activeCodeSnippet, setActiveCodeSnippet] = useState(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showAIReview, setShowAIReview] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [autosaveEnabled, setAutosaveEnabled] = useState(true);
  const [editorTheme, setEditorTheme] = useState('default');
  const [autosaveInterval, setAutosaveInterval] = useState(30);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [coverImage, setCoverImage] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [lastSavedStr, setLastSavedStr] = useState('');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const autosaveTimerRef = useRef(null);
  
  // Create editor with plugins
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your technical blog post...',
      }),
      TiptapImage.configure({
        inline: false,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: content || initialContent || '',
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      dispatch(updateContent(newContent));
      setUnsavedChanges(true);
      
      // Calculate word count and reading time
      const text = editor.getText();
      const words = text.trim().split(/\s+/).filter(Boolean);
      setWordCount(words.length);
      
      // Assuming average reading speed of 200 words per minute
      // Add extra time for code blocks (150% normal reading time)
      const codeBlocks = editor.getJSON().content?.filter(node => node.type === 'codeBlock') || [];
      const codeBlockCount = codeBlocks.length;
      const baseReadingTime = words.length / 200;
      const codeReadingTime = codeBlockCount * 0.5; // Extra time for each code block
      setReadingTime(Math.ceil(baseReadingTime + codeReadingTime));
    },
  });
  
  // Set initial content if available
  useEffect(() => {
    if (editor && initialContent && !content) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent, content]);
  
  // Update editor content when content from Redux changes
  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);
  
  // Setup autosave timer
  useEffect(() => {
    if (autosaveEnabled) {
      autosaveTimerRef.current = setInterval(() => {
        if (unsavedChanges) {
          handleSave(false); // Auto save without notification
        }
      }, autosaveInterval * 1000);
    }
    
    return () => {
      if (autosaveTimerRef.current) {
        clearInterval(autosaveTimerRef.current);
      }
    };
  }, [autosaveEnabled, autosaveInterval, unsavedChanges]);
  
  // Format last saved time
  useEffect(() => {
    if (lastSaved) {
      const date = new Date(lastSaved);
      setLastSavedStr(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  }, [lastSaved]);
  
  // Handle save action
  const handleSave = async (showNotification = true) => {
    if (!title.trim()) {
      alert('Please add a title before saving');
      return;
    }
    
    setSaving(true);
    
    try {
      await onSave({
        title,
        content: editor.getHTML(),
        tags,
        coverImage,
        subtitle,
        codeSnippets,
        id: postId,
        isDraft: true,
      });
      
      setUnsavedChanges(false);
      
      if (showNotification) {
        // Show success toast
        console.log('Post saved successfully');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      // Show error toast
    } finally {
      setSaving(false);
    }
  };
  
  // Handle publish action
  const handlePublish = async () => {
    if (!title.trim()) {
      alert('Please add a title before publishing');
      return;
    }
    
    if (tags.length === 0) {
      alert('Please add at least one tag before publishing');
      return;
    }
    
    try {
      dispatch(startPublishing());
      
      await onPublish({
        title,
        content: editor.getHTML(),
        tags,
        coverImage,
        subtitle,
        codeSnippets,
        id: postId,
        isDraft: false,
      });
      
      setUnsavedChanges(false);
      dispatch(finishPublishing());
      
      // Show success toast
      console.log('Post published successfully');
    } catch (error) {
      console.error('Error publishing post:', error);
      // Show error toast
    }
  };
  
  // Handle add tag
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      dispatch(addTag(tagInput.trim()));
      setTagInput('');
    }
  };
  
  // Handle adding a link
  const handleAddLink = () => {
    // Ensure URL has protocol
    let url = linkUrl;
    if (url && !/^https?:\/\//.test(url)) {
      url = 'https://' + url;
    }
    
    if (editor && url) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run();
      
      setShowLinkDialog(false);
      setLinkUrl('');
    }
  };
  
  // Handle adding an image
  const handleAddImage = () => {
    if (editor && imageUrl) {
      editor
        .chain()
        .focus()
        .setImage({ src: imageUrl })
        .run();
      
      setShowImageDialog(false);
      setImageUrl('');
    }
  };
  
  // Handle uploading an image
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (editor) {
        editor
          .chain()
          .focus()
          .setImage({ src: event.target.result })
          .run();
      }
    };
    reader.readAsDataURL(file);
  };
  
  // Add code snippet
  const handleAddCodeSnippet = () => {
    const newSnippet = {
      id: `snippet-${Date.now()}`,
      language: 'javascript',
      code: '// Add your code here\n\n',
      title: `Code Snippet ${codeSnippets.length + 1}`,
    };
    
    dispatch(updateCodeSnippet({
      id: newSnippet.id,
      ...newSnippet,
    }));
    
    setActiveCodeSnippet(newSnippet);
    setShowCodeEditor(true);
  };
  
  // Update active code snippet
  const handleUpdateCodeSnippet = (code) => {
    if (activeCodeSnippet) {
      dispatch(updateCodeSnippet({
        ...activeCodeSnippet,
        code,
      }));
    }
  };
  
  // Insert code snippet to editor
  const handleInsertCodeSnippet = () => {
    if (!activeCodeSnippet || !editor) return;
    
    editor
      .chain()
      .focus()
      .setCodeBlock({ language: activeCodeSnippet.language })
      .insertContent(activeCodeSnippet.code)
      .run();
    
    setShowCodeEditor(false);
  };
  
  // Handle applying AI suggested fixes
  const handleApplyAIFix = (suggestion) => {
    if (!editor || !suggestion) return;
    
    // Insert code at current position
    if (suggestion.example) {
      editor
        .chain()
        .focus()
        .setCodeBlock({ language: activeCodeSnippet?.language || 'javascript' })
        .insertContent(suggestion.example)
        .run();
    }
  };
  
  // Get toolbar buttons based on editor instance
  const getToolbarButtons = () => {
    if (!editor) return [];
    
    return [
      {
        icon: <Bold size={16} />,
        tooltip: 'Bold (Ctrl+B)',
        isActive: editor.isActive('bold'),
        onClick: () => editor.chain().focus().toggleBold().run(),
      },
      {
        icon: <Italic size={16} />,
        tooltip: 'Italic (Ctrl+I)',
        isActive: editor.isActive('italic'),
        onClick: () => editor.chain().focus().toggleItalic().run(),
      },
      {
        icon: <Highlighter size={16} />,
        tooltip: 'Highlight',
        isActive: editor.isActive('highlight'),
        onClick: () => editor.chain().focus().toggleHighlight().run(),
      },
      { type: 'divider' },
      {
        icon: <Heading1 size={16} />,
        tooltip: 'Heading 1',
        isActive: editor.isActive('heading', { level: 1 }),
        onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      },
      {
        icon: <Heading2 size={16} />,
        tooltip: 'Heading 2',
        isActive: editor.isActive('heading', { level: 2 }),
        onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      },
      { type: 'divider' },
      {
        icon: <List size={16} />,
        tooltip: 'Bullet List',
        isActive: editor.isActive('bulletList'),
        onClick: () => editor.chain().focus().toggleBulletList().run(),
      },
      {
        icon: <ListOrdered size={16} />,
        tooltip: 'Ordered List',
        isActive: editor.isActive('orderedList'),
        onClick: () => editor.chain().focus().toggleOrderedList().run(),
      },
      {
        icon: <Quote size={16} />,
        tooltip: 'Blockquote',
        isActive: editor.isActive('blockquote'),
        onClick: () => editor.chain().focus().toggleBlockquote().run(),
      },
      { type: 'divider' },
      {
        icon: <AlignLeft size={16} />,
        tooltip: 'Align Left',
        isActive: editor.isActive({ textAlign: 'left' }),
        onClick: () => editor.chain().focus().setTextAlign('left').run(),
      },
      {
        icon: <AlignCenter size={16} />,
        tooltip: 'Align Center',
        isActive: editor.isActive({ textAlign: 'center' }),
        onClick: () => editor.chain().focus().setTextAlign('center').run(),
      },
      {
        icon: <AlignRight size={16} />,
        tooltip: 'Align Right',
        isActive: editor.isActive({ textAlign: 'right' }),
        onClick: () => editor.chain().focus().setTextAlign('right').run(),
      },
      { type: 'divider' },
      {
        icon: <LinkIcon size={16} />,
        tooltip: 'Add Link',
        isActive: editor.isActive('link'),
        onClick: () => setShowLinkDialog(true),
      },
      {
        icon: <Image size={16} />,
        tooltip: 'Add Image',
        isActive: false,
        onClick: () => setShowImageDialog(true),
      },
      {
        icon: <Code size={16} />,
        tooltip: 'Add Code Snippet',
        isActive: false,
        onClick: handleAddCodeSnippet,
      },
      { type: 'divider' },
      {
        icon: <Undo size={16} />,
        tooltip: 'Undo',
        isActive: false,
        onClick: () => editor.chain().focus().undo().run(),
        disabled: !editor.can().undo(),
      },
      {
        icon: <Redo size={16} />,
        tooltip: 'Redo',
        isActive: false,
        onClick: () => editor.chain().focus().redo().run(),
        disabled: !editor.can().redo(),
      },
    ];
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Title input */}
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Enter post title..."
          className="w-full text-3xl font-bold text-gray-900 dark:text-white bg-transparent border-0 border-b border-gray-200 dark:border-gray-700 focus:ring-0 focus:border-primary py-3 px-0"
          value={title}
          onChange={(e) => {
            dispatch(updateTitle(e.target.value));
            setUnsavedChanges(true);
          }}
          maxLength={100}
        />
        
        <div className="absolute bottom-3 right-0 text-xs text-gray-500 dark:text-gray-400">
          {title.length}/100
        </div>
      </div>
      
      {/* Subtitle input */}
      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Add a subtitle or brief description..."
          className="w-full text-lg text-gray-600 dark:text-gray-300 bg-transparent border-0 border-b border-gray-200 dark:border-gray-700 focus:ring-0 focus:border-primary py-2 px-0"
          value={subtitle}
          onChange={(e) => {
            setSubtitle(e.target.value);
            setUnsavedChanges(true);
          }}
          maxLength={200}
        />
        
        <div className="absolute bottom-2 right-0 text-xs text-gray-500 dark:text-gray-400">
          {subtitle.length}/200
        </div>
      </div>
      
      {/* Cover image input */}
      <div className="mb-6">
        {coverImage ? (
          <div className="relative mb-2">
            <img 
              src={coverImage} 
              alt="Cover" 
              className="w-full h-64 object-cover rounded-lg"
            />
            <button
              className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
              onClick={() => setCoverImage('')}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div 
            className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary dark:hover:border-primary-light transition-colors"
            onClick={() => document.getElementById('cover-image-input').click()}
          >
            <Image size={24} className="text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Add a cover image</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Recommended size: 1600 x 840px</p>
          </div>
        )}
        <input
          id="cover-image-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                setCoverImage(event.target.result);
                setUnsavedChanges(true);
              };
              reader.readAsDataURL(file);
            }
          }}
        />
      </div>
      
      {/* Tags input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tags (up to 5)
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, index) => (
            <div 
              key={index}
              className="flex items-center bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full px-3 py-1"
            >
              <span className="text-sm">{tag}</span>
              <button
                className="ml-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => dispatch(removeTag(tag))}
              >
                <X size={14} />
              </button>
            </div>
          ))}
          
          {tags.length < 5 && (
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Add a tag..."
                className="text-sm bg-gray-100 dark:bg-gray-800 border-0 rounded-l-full py-1 px-3 focus:ring-0 focus:border-primary"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                maxLength={20}
              />
              <button
                className="bg-primary text-white rounded-r-full px-3 py-1 text-sm"
                onClick={handleAddTag}
              >
                Add
              </button>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Add relevant tags to help readers discover your content
        </p>
      </div>
      
      {/* Editor header with toolbar */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-t-lg">
        <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center space-x-1 overflow-x-auto">
            {getToolbarButtons().map((button, index) => (
              button.type === 'divider' ? (
                <MenuDivider key={`divider-${index}`} />
              ) : (
                <ToolbarButton
                  key={button.tooltip}
                  icon={button.icon}
                  isActive={button.isActive}
                  onClick={button.onClick}
                  tooltip={button.tooltip}
                />
              )
            ))}
            
            {/* Advanced button */}
            <div className="relative ml-2">
              <button
                className="flex items-center space-x-1 px-2 py-1 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings size={16} />
                <span>Settings</span>
                {showSettings ? (
                  <ChevronUp size={14} />
                ) : (
                  <ChevronDown size={14} />
                )}
              </button>
              
              {/* Settings dropdown */}
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 top-full mt-1 z-10 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
                  >
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Editor Settings
                      </h3>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                              checked={autosaveEnabled}
                              onChange={(e) => setAutosaveEnabled(e.target.checked)}
                            />
                            <span>Autosave draft</span>
                          </label>
                        </div>
                        
                        {autosaveEnabled && (
                          <div>
                            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                              Autosave interval (seconds)
                            </label>
                            <select
                              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-2 text-sm"
                              value={autosaveInterval}
                              onChange={(e) => setAutosaveInterval(Number(e.target.value))}
                            >
                              <option value="10">10 seconds</option>
                              <option value="30">30 seconds</option>
                              <option value="60">1 minute</option>
                              <option value="300">5 minutes</option>
                            </select>
                          </div>
                        )}
                        
                        <div>
                          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                            Editor Theme
                          </label>
                          <select
                            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-2 text-sm"
                            value={editorTheme}
                            onChange={(e) => setEditorTheme(e.target.value)}
                          >
                            <option value="default">Default</option>
                            <option value="minimal">Minimal</option>
                            <option value="markdown">Markdown</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="flex items-center">
            {lastSaved && (
              <span className="text-xs text-gray-500 dark:text-gray-400 mr-3">
                <span className="hidden sm:inline">Last saved:</span> {lastSavedStr}
              </span>
            )}
            
            <button
              className={`flex items-center space-x-1 px-3 py-1.5 mr-2 text-sm rounded-md ${
                previewMode
                  ? 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800'
                  : 'text-primary border border-primary/30'
              }`}
              onClick={() => setPreviewMode(!previewMode)}
            >
              {previewMode ? (
                <>
                  <Edit size={16} />
                  <span>Edit</span>
                </>
              ) : (
                <>
                  <Eye size={16} />
                  <span>Preview</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Editor Content */}
        <div className={`p-4 min-h-[400px] ${editorTheme === 'minimal' ? 'max-w-3xl mx-auto' : ''}`}>
          {previewMode ? (
            <div className="prose dark:prose-invert max-w-none prose-img:rounded-lg prose-pre:rounded-lg">
              <h1 className="mb-4">{title || 'Untitled Post'}</h1>
              {subtitle && <p className="text-xl text-gray-600 dark:text-gray-300 -mt-2 mb-6">{subtitle}</p>}
              <div dangerouslySetInnerHTML={{ __html: editor ? editor.getHTML() : content }} />
            </div>
          ) : (
            <EditorContent editor={editor} className={`prose-lg max-w-none focus:outline-none ${editorTheme === 'markdown' ? 'font-mono text-base' : ''}`} />
          )}
        </div>
      </div>
      
      {/* Footer with word count and actions */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">{wordCount}</span> words
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">{readingTime}</span> min read
          </div>
          <button
            className="flex items-center text-primary hover:text-primary-dark text-sm"
            onClick={() => setShowAIReview(!showAIReview)}
          >
            {showAIReview ? (
              <>
                <EyeOff size={16} className="mr-1" />
                <span>Hide AI Review</span>
              </>
            ) : (
              <>
                <Zap size={16} className="mr-1" />
                <span>AI Review</span>
              </>
            )}
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center"
            onClick={() => handleSave(true)}
            disabled={saving}
          >
            {saving ? (
              <>
                <RefreshCw size={16} className="mr-2 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                <span>Save Draft</span>
              </>
            )}
          </button>
          
          <button
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md text-sm font-medium flex items-center"
            onClick={handlePublish}
            disabled={isPublishing}
          >
            {isPublishing ? (
              <>
                <RefreshCw size={16} className="mr-2 animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Send size={16} className="mr-2" />
                <span>Publish</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Link Dialog */}
      <AnimatePresence>
        {showLinkDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center"
            onClick={() => setShowLinkDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Add Link</h3>
              </div>
              
              <div className="p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    URL
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-800"
                    placeholder="https://example.com"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
                    autoFocus
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => setShowLinkDialog(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md text-sm font-medium"
                    onClick={handleAddLink}
                    disabled={!linkUrl}
                  >
                    Add Link
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Image Dialog */}
      <AnimatePresence>
        {showImageDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center"
            onClick={() => setShowImageDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Add Image</h3>
              </div>
              
              <div className="p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-800"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddImage()}
                    autoFocus
                  />
                </div>
                
                <div className="text-center mb-4">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                    or
                  </span>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Upload Image
                  </label>
                  <div
                    className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center cursor-pointer hover:border-primary dark:hover:border-primary-light"
                    onClick={() => document.getElementById('image-upload').click()}
                  >
                    <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Click to upload or drag and drop
                    </p>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => setShowImageDialog(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md text-sm font-medium"
                    onClick={handleAddImage}
                    disabled={!imageUrl}
                  >
                    Add Image
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Code Editor Modal */}
      <AnimatePresence>
        {showCodeEditor && activeCodeSnippet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center"
            onClick={() => setShowCodeEditor(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-3xl w-full mx-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Edit Code Snippet</h3>
                <button
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => setShowCodeEditor(false)}
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-800"
                    placeholder="Snippet title"
                    value={activeCodeSnippet.title}
                    onChange={(e) => dispatch(updateCodeSnippet({
                      ...activeCodeSnippet,
                      title: e.target.value,
                    }))}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Language
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-800"
                    value={activeCodeSnippet.language}
                    onChange={(e) => dispatch(updateCodeSnippet({
                      ...activeCodeSnippet,
                      language: e.target.value,
                    }))}
                  >
                    {CODE_LANGUAGES.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Code
                  </label>
                  <div className="relative border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
                    <div className="absolute top-2 right-2 z-10 flex space-x-1">
                      <button
                        className="p-1 bg-gray-800/70 hover:bg-gray-800/90 text-white rounded"
                        onClick={() => {
                          navigator.clipboard.writeText(activeCodeSnippet.code);
                          // Show toast notification
                        }}
                        title="Copy code"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        className="p-1 bg-primary/80 hover:bg-primary text-white rounded"
                        onClick={() => setShowAIReview(true)}
                        title="AI Review"
                      >
                        <Zap size={14} />
                      </button>
                    </div>
                    <SyntaxHighlighter
                      language={activeCodeSnippet.language}
                      style={darkMode ? materialOceanic : materialLight}
                      customStyle={{ 
                        margin: 0, 
                        padding: '1rem',
                        borderRadius: '0.375rem', 
                        minHeight: '300px',
                        maxHeight: '400px',
                        fontSize: '0.9rem',
                      }}
                      contentEditable={true}
                      onKeyDown={(e) => {
                        // Stop propagation to prevent dialog from closing on Escape
                        if (e.key === 'Escape') e.stopPropagation(); 
                      }}
                      onInput={(e) => {
                        handleUpdateCodeSnippet(e.currentTarget.textContent);
                      }}
                    >
                      {activeCodeSnippet.code}
                    </SyntaxHighlighter>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => setShowCodeEditor(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md text-sm font-medium"
                    onClick={handleInsertCodeSnippet}
                  >
                    Insert to Editor
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* AI Code Review Panel */}
      {showAIReview && activeCodeSnippet && (
        <div className="fixed bottom-0 right-0 w-full md:w-1/2 h-3/4 z-40 border-t border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
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
              code={activeCodeSnippet.code}
              language={activeCodeSnippet.language}
              title={`Review for ${activeCodeSnippet.title || 'Code Snippet'}`}
              onFixSuggestion={handleApplyAIFix}
              showCodeEditor={false}
            />
          </div>
        </div>
      )}
      
      {/* Unsaved changes warning */}
      {unsavedChanges && (
        <div className="fixed bottom-4 left-4 bg-white dark:bg-gray-900 shadow-lg border border-yellow-300 dark:border-yellow-700 rounded-lg py-2 px-4 flex items-center space-x-2 z-50">
          <AlertTriangle size={16} className="text-yellow-500" />
          <span className="text-sm text-gray-800 dark:text-gray-200">Unsaved changes</span>
          <button
            className="ml-2 px-2 py-1 text-xs bg-primary text-white rounded hover:bg-primary-dark"
            onClick={() => handleSave(true)}
          >
            Save now
          </button>
        </div>
      )}
    </div>
  );
};

// Helper components
const Edit = ({ size = 24, className = '' }) => (
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
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const Send = ({ size = 24, className = '' }) => (
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
    <path d="M22 2L11 13"></path>
    <path d="M22 2L15 22l-4-9-9-4 20-7z"></path>
  </svg>
);

export default CodeBlogEditor;