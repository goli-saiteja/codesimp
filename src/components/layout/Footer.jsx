import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Heart, Coffee } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-neutral-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center text-white font-bold text-lg">
                C
              </div>
              <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
                CodeSiMP
              </span>
            </Link>
            <p className="text-sm text-neutral-600 mb-4">
              A professional platform for developers to share knowledge, ideas, and code.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-neutral-600 hover:text-neutral-900 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-neutral-600 hover:text-neutral-900 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-neutral-600 hover:text-neutral-900 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Links sections */}
          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4">
                Platform
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-neutral-600 hover:text-primary-600 text-sm">
                    About us
                  </Link>
                </li>
                <li>
                  <Link to="/explore" className="text-neutral-600 hover:text-primary-600 text-sm">
                    Explore
                  </Link>
                </li>
                <li>
                  <Link to="/editor" className="text-neutral-600 hover:text-primary-600 text-sm">
                    Write
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-neutral-600 hover:text-primary-600 text-sm">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-neutral-600 hover:text-primary-600 text-sm">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4">
                Resources
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/docs" className="text-neutral-600 hover:text-primary-600 text-sm">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link to="/api" className="text-neutral-600 hover:text-primary-600 text-sm">
                    API
                  </Link>
                </li>
                <li>
                  <Link to="/guides" className="text-neutral-600 hover:text-primary-600 text-sm">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link to="/tutorials" className="text-neutral-600 hover:text-primary-600 text-sm">
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-neutral-600 hover:text-primary-600 text-sm">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4">
                Company
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/careers" className="text-neutral-600 hover:text-primary-600 text-sm">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-neutral-600 hover:text-primary-600 text-sm">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-neutral-600 hover:text-primary-600 text-sm">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-neutral-600 hover:text-primary-600 text-sm">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/help" className="text-neutral-600 hover:text-primary-600 text-sm">
                    Help
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="mt-12 pt-6 border-t border-neutral-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-neutral-600">
              &copy; {currentYear} CodeSiMP. All rights reserved.
            </p>
            
            <div className="mt-4 md:mt-0 flex items-center text-sm text-neutral-600">
              <span className="flex items-center">
                Made with <Heart className="h-4 w-4 mx-1 text-error-500" /> and <Coffee className="h-4 w-4 mx-1 text-warning-600" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;