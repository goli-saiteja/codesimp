import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Hash,
  Bookmark,
  BarChart2,
  Settings,
  HelpCircle,
  Zap,
  Code,
  CodeSandbox,
  Coffee,
  Star,
  ChevronDown,
  PenTool,
  Bell,
  Search,
  Layers,
  Terminal,
  Database,
  Globe,
  Server,
  Shield,
  Cpu,
  CloudLightning
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);
  const [collectionsExpanded, setCollectionsExpanded] = useState(false);
  
  // Check if a given path is active
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // Navigation item component
  const NavItem = ({ to, icon: Icon, label, badge, active }) => (
    <Link
      to={to}
      className={`flex items-center px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
        active
          ? 'bg-primary-50 text-primary-700'
          : 'text-neutral-700 hover:bg-neutral-100'
      }`}
    >
      <Icon className={`h-5 w-5 mr-3 ${active ? 'text-primary-500' : 'text-neutral-500'}`} />
      <span>{label}</span>
      {badge && (
        <span className="ml-auto px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
          {badge}
        </span>
      )}
    </Link>
  );
  
  return (
    <div className="py-4 flex flex-col h-full">
      <div className="px-4 mb-6">
        <Link
          to="/editor"
          className="flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors font-medium"
        >
          <PenTool className="h-4 w-4 mr-2" />
          New Article
        </Link>
      </div>
      
      <div className="px-3 space-y-1">
        <NavItem to="/" icon={Home} label="Home" active={isActive('/')} />
        <NavItem to="/explore" icon={Hash} label="Explore" active={isActive('/explore')} />
        <NavItem to="/bookmarks" icon={Bookmark} label="Bookmarks" active={isActive('/bookmarks')} badge="5" />
        <NavItem to="/notifications" icon={Bell} label="Notifications" active={isActive('/notifications')} badge="3" />
        <NavItem to="/dashboard" icon={BarChart2} label="Dashboard" active={isActive('/dashboard')} />
      </div>
      
      <div className="mt-6 px-4 mb-2">
        <button
          onClick={() => setCategoriesExpanded(!categoriesExpanded)}
          className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-neutral-700"
        >
          <span>Categories</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              categoriesExpanded ? 'transform rotate-180' : ''
            }`}
          />
        </button>
      </div>
      
      {categoriesExpanded && (
        <div className="px-3 space-y-1 mb-4">
          <NavItem 
            to="/category/javascript" 
            icon={Zap} 
            label="JavaScript" 
            active={isActive('/category/javascript')} 
          />
          <NavItem 
            to="/category/react" 
            icon={Code} 
            label="React" 
            active={isActive('/category/react')} 
          />
          <NavItem 
            to="/category/backend" 
            icon={Server} 
            label="Backend" 
            active={isActive('/category/backend')} 
          />
          <NavItem 
            to="/category/database" 
            icon={Database} 
            label="Database" 
            active={isActive('/category/database')} 
          />
          <NavItem 
            to="/category/web" 
            icon={Globe} 
            label="Web Dev" 
            active={isActive('/category/web')} 
          />
          <NavItem 
            to="/category/devops" 
            icon={CloudLightning} 
            label="DevOps" 
            active={isActive('/category/devops')} 
          />
          <NavItem 
            to="/category/security" 
            icon={Shield} 
            label="Security" 
            active={isActive('/category/security')} 
          />
          <NavItem 
            to="/category/ai" 
            icon={Cpu} 
            label="AI & ML" 
            active={isActive('/category/ai')} 
          />
        </div>
      )}
      
      <div className="px-4 mb-2">
        <button
          onClick={() => setCollectionsExpanded(!collectionsExpanded)}
          className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-wider text-neutral-500 hover:text-neutral-700"
        >
          <span>Collections</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              collectionsExpanded ? 'transform rotate-180' : ''
            }`}
          />
        </button>
      </div>
      
      {collectionsExpanded && (
        <div className="px-3 space-y-1 mb-4">
          <NavItem 
            to="/collection/tutorials" 
            icon={Coffee} 
            label="Tutorials" 
            active={isActive('/collection/tutorials')} 
          />
          <NavItem 
            to="/collection/best-practices" 
            icon={Star} 
            label="Best Practices" 
            active={isActive('/collection/best-practices')} 
          />
          <NavItem 
            to="/collection/architecture" 
            icon={Layers} 
            label="Architecture" 
            active={isActive('/collection/architecture')} 
          />
          <NavItem 
            to="/collection/snippets" 
            icon={CodeSandbox} 
            label="Code Snippets" 
            active={isActive('/collection/snippets')} 
          />
          <NavItem 
            to="/collection/cli" 
            icon={Terminal} 
            label="CLI Tools" 
            active={isActive('/collection/cli')} 
          />
        </div>
      )}
      
      {/* Trending tags */}
      <div className="px-4 py-3 mt-auto">
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">
          Trending Tags
        </p>
        <div className="flex flex-wrap gap-2">
          <Link 
            to="/tag/typescript"
            className="px-2.5 py-1 text-xs font-medium rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
          >
            #typescript
          </Link>
          <Link 
            to="/tag/nextjs"
            className="px-2.5 py-1 text-xs font-medium rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
          >
            #nextjs
          </Link>
          <Link 
            to="/tag/aws"
            className="px-2.5 py-1 text-xs font-medium rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
          >
            #aws
          </Link>
          <Link 
            to="/tag/performance"
            className="px-2.5 py-1 text-xs font-medium rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
          >
            #performance
          </Link>
        </div>
      </div>
      
      {/* Footer links */}
      <div className="px-3 pt-4 mt-2 border-t border-neutral-200">
        <NavItem to="/settings" icon={Settings} label="Settings" active={isActive('/settings')} />
        <NavItem to="/help" icon={HelpCircle} label="Help & Support" active={isActive('/help')} />
      </div>
    </div>
  );
};

export default Sidebar;