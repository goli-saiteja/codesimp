// src/pages/AuthPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { loginUser, registerUser, clearError } from '../store/slices/authSlice';
import { 
  User, Lock, Mail, GitHub, Code, AlertCircle,
  Eye, EyeOff, Check, Loader, ArrowRight
} from 'lucide-react';

const AuthPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, error } = useSelector(state => state.auth);
  
  // Determine if we're on login or register page
  const isLogin = location.pathname === '/auth/login' || location.pathname === '/auth';
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = location.state?.from || '/';
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);
  
  // Clear errors when switching between login/register
  useEffect(() => {
    dispatch(clearError());
    setValidationErrors({});
  }, [isLogin, dispatch]);
  
  // Set page title
  useEffect(() => {
    document.title = isLogin ? 'Sign In - CodeSource' : 'Create Account - CodeSource';
    
    return () => {
      document.title = 'CodeSource';
    };
  }, [isLogin]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation errors as user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Validate form data
  const validateForm = () => {
    const errors = {};
    
    if (!isLogin && !formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (isLogin) {
      dispatch(loginUser({
        email: formData.email,
        password: formData.password
      }));
    } else {
      dispatch(registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password
      }));
    }
  };
  
  // Handle OAuth login
  const handleGithubLogin = () => {
    // In a real app, this would redirect to GitHub OAuth flow
    console.log('GitHub login clicked');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
              <Code size={24} className="text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLogin ? 'Sign in to CodeSource' : 'Create your account'}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {isLogin 
              ? 'Enter your credentials to access your account'
              : 'Join the developer community to share and discover code'
            }
          </p>
        </div>
        
        {/* Auth form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm rounded-md flex items-start">
              <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {/* GitHub oauth button */}
          <button
            className="w-full flex items-center justify-center py-2.5 px-4 mb-4 bg-gray-900 dark:bg-gray-700 text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
            onClick={handleGithubLogin}
          >
            <GitHub size={18} className="mr-2" />
            <span>Continue with GitHub</span>
          </button>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">or continue with email</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Name field (register only) */}
            {!isLogin && (
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className={`pl-10 w-full rounded-md border ${
                      validationErrors.name 
                        ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary'
                    } bg-white dark:bg-gray-900 py-2 text-gray-900 dark:text-gray-100`}
                    placeholder="John Doe"
                  />
                </div>
                {validationErrors.name && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{validationErrors.name}</p>
                )}
              </div>
            )}
            
            {/* Email field */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`pl-10 w-full rounded-md border ${
                    validationErrors.email 
                      ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary'
                  } bg-white dark:bg-gray-900 py-2 text-gray-900 dark:text-gray-100`}
                  placeholder="you@example.com"
                />
              </div>
              {validationErrors.email && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{validationErrors.email}</p>
              )}
            </div>
            
            {/* Password field */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`pl-10 pr-10 w-full rounded-md border ${
                    validationErrors.password 
                      ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary'
                  } bg-white dark:bg-gray-900 py-2 text-gray-900 dark:text-gray-100`}
                  placeholder={isLogin ? "Enter password" : "Create password"}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {validationErrors.password && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{validationErrors.password}</p>
              )}
            </div>
            
            {/* Confirm Password (register only) */}
            {!isLogin && (
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Check size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`pl-10 w-full rounded-md border ${
                      validationErrors.confirmPassword 
                        ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary'
                    } bg-white dark:bg-gray-900 py-2 text-gray-900 dark:text-gray-100`}
                    placeholder="Confirm password"
                  />
                </div>
                {validationErrors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{validationErrors.confirmPassword}</p>
                )}
              </div>
            )}
            
            {/* Forgot password link (login only) */}
            {isLogin && (
              <div className="flex justify-end mb-4">
                <Link
                  to="/auth/forgot-password"
                  className="text-sm text-primary hover:text-primary-dark dark:hover:text-primary-light"
                >
                  Forgot password?
                </Link>
              </div>
            )}
            
            {/* Submit button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center py-2.5 px-4 bg-primary hover:bg-primary-dark text-white font-medium rounded-md transition-colors"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin mr-2" />
                  <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                </>
              ) : (
                <>
                  <span>{isLogin ? 'Sign in' : 'Create account'}</span>
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </button>
          </form>
        </div>
        
        {/* Login/Register toggle link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Link
              to={isLogin ? "/auth/register" : "/auth/login"}
              className="text-primary hover:text-primary-dark dark:hover:text-primary-light font-medium"
            >
              {isLogin ? "Create one" : "Sign in"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;