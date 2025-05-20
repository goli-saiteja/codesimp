// src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Code, GitHub, Twitter, Linkedin, Mail, Coffee, 
  Heart, ExternalLink, BookOpen, User, Terminal, 
  Shield, FileText, HelpCircle
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = {
    platform: [
      { name: 'Home', path: '/' },
      { name: 'Explore', path: '/explore' },
      { name: 'Topics', path: '/topics' },
      { name: 'Code Playground', path: '/playground' },
      { name: 'Authors', path: '/authors' },
    ],
    support: [
      { name: 'Help Center', path: '/help' },
      { name: 'Feedback', path: '/feedback' },
      { name: 'Contact Us', path: '/contact' },
      { name: 'Status', path: '/status', external: true },
    ],
    legal: [
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Code of Conduct', path: '/code-of-conduct' },
      { name: 'Cookies', path: '/cookies' },
    ],
    resources: [
      { name: 'Documentation', path: '/docs' },
      { name: 'API Reference', path: '/api' },
      { name: 'Showcase', path: '/showcase' },
      { name: 'Open Source', path: '/open-source' },
    ],
  };
  
  const socialLinks = [
    { name: 'GitHub', icon: <GitHub size={18} />, url: 'https://github.com/codesource' },
    { name: 'Twitter', icon: <Twitter size={18} />, url: 'https://twitter.com/codesource' },
    { name: 'LinkedIn', icon: <Linkedin size={18} />, url: 'https://linkedin.com/company/codesource' },
    { name: 'Email', icon: <Mail size={18} />, url: 'mailto:contact@codesource.com' },
  ];
  
  // Top technologies
  const topTechnologies = [
    { name: 'React', path: '/topic/react' },
    { name: 'JavaScript', path: '/topic/javascript' },
    { name: 'Python', path: '/topic/python' },
    { name: 'TypeScript', path: '/topic/typescript' },
    { name: 'Node.js', path: '/topic/nodejs' },
    { name: 'Go', path: '/topic/go' },
    { name: 'Rust', path: '/topic/rust' },
    { name: 'DevOps', path: '/topic/devops' },
  ];
  
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
                <Code size={20} className="text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">CodeSource</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              The premium platform for coding blogs and knowledge sharing within the developer community.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-light"
                  aria-label={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
          
          {/* Navigation Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light text-sm flex items-center"
                    >
                      {link.name}
                      <ExternalLink size={12} className="ml-1" />
                    </a>
                  ) : (
                    <Link
                      to={link.path}
                      className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light text-sm"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Trending technologies */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Popular Technologies
          </h3>
          <div className="flex flex-wrap gap-2">
            {topTechnologies.map((tech) => (
              <Link
                key={tech.name}
                to={tech.path}
                className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full px-3 py-1 text-xs"
              >
                {tech.name}
              </Link>
            ))}
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                © {currentYear} CodeSource. All rights reserved.
              </p>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <span className="text-sm">Built with</span>
              <Heart size={14} className="text-red-500" />
              <span className="text-sm">by developers for developers</span>
            </div>
            
            <div className="flex items-center mt-4 md:mt-0">
              <a
                href="https://github.com/sponsors/codesource"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-sm text-primary dark:text-primary-light hover:text-primary-dark"
              >
                <Coffee size={14} />
                <span>Support this project</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;