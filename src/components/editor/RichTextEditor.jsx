// src/components/editor/RichTextEditor.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import CodeBlock from '@tiptap/extension-code-block';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { updateContent, markSaved } from '../../store/slices/editorSlice';
import { 
  Bold, Italic, Strikethrough, Code, List, ListOrdered, Quote, 
  Link as LinkIcon, Image as ImageIcon, Heading1, Heading2, Heading3,
  AlignLeft, AlignCenter, AlignRight, Undo, Redo, Check, 
  Highlighter, Type, LayoutGrid, CodeSquare
} from 'lucide-react';

// Custom CodeBlock extension with language selector
const CustomCodeBlock = CodeBlock.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      language: {
        default: 'javascript',
        parseHTML: element => element.getAttribute('data-language'),
        renderHTML: attributes => {
          return {
            'data-language': attributes.language,
            class: `language-${attributes.language}`,
          };
        },
      },
    };
  },
});

const RichTextEditor = ({ 
  initialContent = '', 
  placeholder = 'Begin writing your coding journey...', 
  collaborationId = null,
  readOnly = false,
  autofocus = true,
  onChange = () => {},
  onSave = () => {}
}) => {
  const dispatch = useDispatch();
  const { fontSize, fontFamily, lineHeight } = useSelector(state => state.ui);
  const { user } = useSelector(state => state.auth);
  const [isLink, setIsLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [showCodeBlockOptions, setShowCodeBlockOptions] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const codeLanguages = [
    'javascript', 'python', 'html', 'css', 'typescript', 
    'jsx', 'tsx', 'java', 'c', 'cpp', 'php', 'go', 'ruby',
    'rust', 'swift', 'kotlin', 'csharp', 'bash', 'sql', 'json'
  ];
  
  // Set up Yjs collaboration (if enabled)
  const ydoc = useRef(null);
  const provider = useRef(null);
  
  if (collaborationId && !ydoc.current) {
    ydoc.current = new Y.Doc();
    provider.current = new WebrtcProvider(`codesource-${collaborationId}`, ydoc.current, {
      signaling: ['wss://signaling.codesource.com'],
    });
    
    // Set up awareness (show who's editing)
    if (user) {
      provider.current.awareness.setLocalStateField('user', {
        name: user.name,
        color: user.color || '#' + Math.floor(Math.random()*16777215).toString(16),
        avatar: user.avatar,
      });
    }
    
    // Track collaborators
    provider.current.awareness.on('change', () => {
      const states = Array.from(provider.current.awareness.getStates().entries())
        .filter(([key, state]) => state.user)
        .map(([key, state]) => state.user);
      
      setCollaborators(states);
    });
  }
  
  // Configure the editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      Typography,
      Highlight,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Link.configure({
        openOnClick: false,
        linkOnPaste: true,
        HTMLAttributes: {
          class: 'text-primary hover:underline cursor-pointer',
        },
      }),
      Image.configure({
        allowBase64: true,
        inline: true,
      }),
      CustomCodeBlock,
      ...(collaborationId ? [
        Collaboration.configure({
          document: ydoc.current,
        }),
        CollaborationCursor.configure({
          provider: provider.current,
          user: user ? {
            name: user.name,
            color: user.color || '#' + Math.floor(Math.random()*16777215).toString(16),
            avatar: user.avatar,
          } : undefined,
        }),
      ] : []),
    ],
    content: initialContent,
    autofocus,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      dispatch(updateContent(html));
    },
  });
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Save: Ctrl+S or Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveContent();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  // Save content with debounce
  const saveContent = async () => {
    if (!editor || isSaving) return;
    
    try {
      setIsSaving(true);
      const content = editor.getHTML();
      await onSave(content);
      dispatch(markSaved());
      setLastSaved(new Date());
      setIsSaving(false);
    } catch (error) {
      console.error('Error saving content:', error);
      setIsSaving(false);
    }
  };
  
  // Set initial content when it changes
  useEffect(() => {
    if (editor && initialContent && editor.getHTML() !== initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [initialContent, editor]);
  
  if (!editor) {
    return null;
  }
  
  // Link handling
  const setLink = () => {
    if (!linkUrl) return;
    
    // Check if URL has protocol, add http:// if missing
    const url = linkUrl.includes('://') ? linkUrl : `http://${linkUrl}`;
    
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    setIsLink(false);
    setLinkUrl('');
  };
  
  const unsetLink = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
  };
  
  // Image handling
  const addImage = () => {
    const url = window.prompt('Enter the image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url, alt: 'Image' }).run();
    }
  };
  
  // Add code block with specific language
  const addCodeBlock = (language) => {
    editor.chain().focus().toggleCodeBlock({ language }).run();
    setShowCodeBlockOptions(false);
  };
  
  // Helper to check if command is active
  const isActive = (type, options = {}) => {
    return editor.isActive(type, options);
  };
  
  // Button component for toolbar
  const ToolbarButton = ({ icon, title, action, isActive = false, disabled = false }) => (
    <button
      onClick={action}
      className={`p-2 rounded-md ${
        isActive 
          ? 'bg-primary/10 text-primary dark:bg-primary/20' 
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={title}
      disabled={disabled || readOnly}
    >
      {icon}
    </button>
  );
  
  return (
    <div className="rich-text-editor flex flex-col border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {!readOnly && (
        <div className="editor-toolbar flex flex-wrap items-center gap-1 p-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          {/* Text formatting */}
          <div className="flex items-center border-r border-gray-200 dark:border-gray-700 pr-2 mr-1">
            <ToolbarButton
              icon={<Bold size={16} />}
              title="Bold"
              action={() => editor.chain().focus().toggleBold().run()}
              isActive={isActive('bold')}
            />
            <ToolbarButton
              icon={<Italic size={16} />}
              title="Italic"
              action={() => editor.chain().focus().toggleItalic().run()}
              isActive={isActive('italic')}
            />
            <ToolbarButton
              icon={<Strikethrough size={16} />}
              title="Strikethrough"
              action={() => editor.chain().focus().toggleStrike().run()}
              isActive={isActive('strike')}
            />
            <ToolbarButton
              icon={<Highlighter size={16} />}
              title="Highlight"
              action={() => editor.chain().focus().toggleHighlight().run()}
              isActive={isActive('highlight')}
            />
            <ToolbarButton
              icon={<Code size={16} />}
              title="Inline Code"
              action={() => editor.chain().focus().toggleCode().run()}
              isActive={isActive('code')}
            />
          </div>
          
          {/* Headings */}
          <div className="flex items-center border-r border-gray-200 dark:border-gray-700 pr-2 mr-1">
            <ToolbarButton
              icon={<Heading1 size={16} />}
              title="Heading 1"
              action={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={isActive('heading', { level: 1 })}
            />
            <ToolbarButton
              icon={<Heading2 size={16} />}
              title="Heading 2"
              action={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={isActive('heading', { level: 2 })}
            />
            <ToolbarButton
              icon={<Heading3 size={16} />}
              title="Heading 3"
              action={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              isActive={isActive('heading', { level: 3 })}
            />
          </div>
          
          {/* Lists and alignment */}
          <div className="flex items-center border-r border-gray-200 dark:border-gray-700 pr-2 mr-1">
            <ToolbarButton
              icon={<List size={16} />}
              title="Bullet List"
              action={() => editor.chain().focus().toggleBulletList().run()}
              isActive={isActive('bulletList')}
            />
            <ToolbarButton
              icon={<ListOrdered size={16} />}
              title="Ordered List"
              action={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={isActive('orderedList')}
            />
            <ToolbarButton
              icon={<Check size={16} />}
              title="Task List"
              action={() => editor.chain().focus().toggleTaskList().run()}
              isActive={isActive('taskList')}
            />
            <ToolbarButton
              icon={<Quote size={16} />}
              title="Blockquote"
              action={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={isActive('blockquote')}
            />
          </div>
          
          {/* Special blocks */}
          <div className="flex items-center border-r border-gray-200 dark:border-gray-700 pr-2 mr-1">
            <div className="relative">
              <ToolbarButton
                icon={<CodeSquare size={16} />}
                title="Code Block"
                action={() => setShowCodeBlockOptions(!showCodeBlockOptions)}
                isActive={isActive('codeBlock')}
              />
              
              {showCodeBlockOptions && (
                <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 p-2 w-48 max-h-64 overflow-y-auto">
                  <div className="mb-2">
                    <select
                      className="w-full p-1 text-sm border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900"
                      value={codeLanguage}
                      onChange={(e) => setCodeLanguage(e.target.value)}
                    >
                      {codeLanguages.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    className="w-full text-left p-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    onClick={() => addCodeBlock(codeLanguage)}
                  >
                    Insert {codeLanguage} block
                  </button>
                </div>
              )}
            </div>
            
            {/* Link handling */}
            <div className="relative">
              <ToolbarButton
                icon={<LinkIcon size={16} />}
                title={isActive('link') ? 'Edit Link' : 'Add Link'}
                action={() => {
                  if (isActive('link')) {
                    unsetLink();
                  } else {
                    setIsLink(true);
                  }
                }}
                isActive={isActive('link')}
              />
              
              {isLink && (
                <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 p-2 flex">
                  <input
                    type="text"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="w-64 p-1 text-sm border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900"
                    placeholder="https://example.com"
                    onKeyDown={(e) => e.key === 'Enter' && setLink()}
                    autoFocus
                  />
                  <button
                    className="ml-1 px-2 bg-primary text-white rounded"
                    onClick={setLink}
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
            
            <ToolbarButton
              icon={<ImageIcon size={16} />}
              title="Add Image"
              action={addImage}
            />
          </div>
          
          {/* Undo/Redo */}
          <div className="flex items-center">
            <ToolbarButton
              icon={<Undo size={16} />}
              title="Undo"
              action={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            />
            <ToolbarButton
              icon={<Redo size={16} />}
              title="Redo"
              action={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            />
          </div>
          
          {/* Collaborators */}
          {collaborationId && collaborators.length > 0 && (
            <div className="ml-auto flex items-center space-x-1">
              {collaborators.map((user, index) => (
                <div
                  key={index}
                  className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs"
                  style={{ backgroundColor: user.color }}
                  title={user.name}
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Save status */}
          <div className="ml-auto flex items-center">
            {isSaving ? (
              <span className="text-xs text-gray-500 dark:text-gray-400">Saving...</span>
            ) : lastSaved ? (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Saved {new Intl.DateTimeFormat('en', {
                  hour: '2-digit',
                  minute: '2-digit'
                }).format(lastSaved)}
              </span>
            ) : null}
          </div>
        </div>
      )}
      
      <div 
        className={`editor-content p-4 overflow-y-auto ${
          readOnly ? 'prose dark:prose-invert max-w-none' : ''
        }`}
        style={{
          fontSize: fontSize === 'small' ? '0.9rem' : fontSize === 'large' ? '1.1rem' : '1rem',
          fontFamily: fontFamily.body,
          lineHeight: lineHeight,
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;