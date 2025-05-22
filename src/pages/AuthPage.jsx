import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Github, Twitter, Mail, Eye, EyeOff, 
  AlertCircle, Check, Code, Lock, User
} from 'lucide-react';

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Determine if this is login or signup from the URL
  const isLogin = location.pathname === '/login';
  const authMode = isLogin ? 'login' : 'signup';
  
  // Get authentication state from Redux
  const { isLoading, error, user } = useSelector(state => state.auth);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  
  // If user is already authenticated, redirect to home
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    // Signup specific validations
    if (!isLogin) {
      // Name validation
      if (!formData.name) {
        errors.name = 'Name is required';
      }
      
      // Username validation
      if (!formData.username) {
        errors.username = 'Username is required';
      } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        errors.username = 'Username can only contain letters, numbers, and underscores';
      }
      
      // Confirm password validation
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
      
      // Terms agreement validation
      if (!formData.agreeToTerms) {
        errors.agreeToTerms = 'You must agree to the terms and conditions';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    try {
      if (isLogin) {
        // In a real app, dispatch login action
        // dispatch(login(formData.email, formData.password));
        
        // For demo, show success message and simulate redirect
        setSuccessMessage('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        // In a real app, dispatch signup action
        // dispatch(signup(formData));
        
        // For demo, show success message and simulate redirect to login
        setSuccessMessage('Account created successfully! Please log in.');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };
  
  // Handle social auth
  const handleSocialAuth = (provider) => {
    // In a real app, dispatch social auth action
    // dispatch(socialAuth(provider));
    
    // For demo, show success message and simulate redirect
    setSuccessMessage(`${provider} authentication successful! Redirecting...`);
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center text-white font-bold text-2xl">
            C
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-900">
          {isLogin ? 'Sign in to your account' : 'Create a new account'}
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-600">
          {isLogin ? 'Don\'t have an account?' : 'Already have an account?'}{' '}
          <Link
            to={isLogin ? '/signup' : '/login'}
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-soft sm:rounded-lg sm:px-10">
          {/* Success message */}
          {successMessage && (
            <div className="mb-4 bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-md flex items-center">
              <Check className="h-5 w-5 mr-2" />
              {successMessage}
            </div>
          )}
          
          {/* Error message */}
          {error && (
            <div className="mb-4 bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}
          
          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name field - only for signup */}
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
                  Full Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`form-input block w-full pl-10 ${
                      validationErrors.name 
                        ? 'border-error-300 text-error-900 focus:ring-error-500 focus:border-error-500' 
                        : 'border-neutral-300 focus:ring-primary-500 focus:border-primary-500'
                    }`}
                    placeholder="John Doe"
                  />
                </div>
                {validationErrors.name && (
                  <p className="mt-2 text-sm text-error-600">{validationErrors.name}</p>
                )}
              </div>
            )}
            
            {/* Username field - only for signup */}
            {!isLogin && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-neutral-700">
                  Username
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-neutral-400">@</span>
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`form-input block w-full pl-10 ${
                      validationErrors.username 
                        ? 'border-error-300 text-error-900 focus:ring-error-500 focus:border-error-500' 
                        : 'border-neutral-300 focus:ring-primary-500 focus:border-primary-500'
                    }`}
                    placeholder="johndoe"
                  />
                </div>
                {validationErrors.username && (
                  <p className="mt-2 text-sm text-error-600">{validationErrors.username}</p>
                )}
              </div>
            )}
            
            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input block w-full pl-10 ${
                    validationErrors.email 
                      ? 'border-error-300 text-error-900 focus:ring-error-500 focus:border-error-500' 
                      : 'border-neutral-300 focus:ring-primary-500 focus:border-primary-500'
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {validationErrors.email && (
                <p className="mt-2 text-sm text-error-600">{validationErrors.email}</p>
              )}
            </div>
            
            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input block w-full pl-10 pr-10 ${
                    validationErrors.password 
                      ? 'border-error-300 text-error-900 focus:ring-error-500 focus:border-error-500' 
                      : 'border-neutral-300 focus:ring-primary-500 focus:border-primary-500'
                  }`}
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-neutral-400 hover:text-neutral-500 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {validationErrors.password && (
                <p className="mt-2 text-sm text-error-600">{validationErrors.password}</p>
              )}
            </div>
            
            {/* Confirm password field - only for signup */}
            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700">
                  Confirm Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`form-input block w-full pl-10 ${
                      validationErrors.confirmPassword 
                        ? 'border-error-300 text-error-900 focus:ring-error-500 focus:border-error-500' 
                        : 'border-neutral-300 focus:ring-primary-500 focus:border-primary-500'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {validationErrors.confirmPassword && (
                  <p className="mt-2 text-sm text-error-600">{validationErrors.confirmPassword}</p>
                )}
              </div>
            )}
            
            {/* Remember me / Forgot password - only for login */}
            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                    Forgot your password?
                  </Link>
                </div>
              </div>
            )}
            
            {/* Terms and conditions - only for signup */}
            {!isLogin && (
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className={`form-checkbox h-4 w-4 focus:ring-primary-500 ${
                      validationErrors.agreeToTerms 
                        ? 'border-error-300 text-error-600' 
                        : 'border-neutral-300 text-primary-600'
                    }`}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeToTerms" className={`font-medium ${
                    validationErrors.agreeToTerms ? 'text-error-700' : 'text-neutral-700'
                  }`}>
                    I agree to the{' '}
                    <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>
            )}
            
            {!isLogin && validationErrors.agreeToTerms && (
              <p className="text-sm text-error-600">{validationErrors.agreeToTerms}</p>
            )}
            
            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  isLogin ? 'Sign in' : 'Create account'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-neutral-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocialAuth('GitHub')}
                className="w-full inline-flex justify-center py-2 px-4 border border-neutral-300 rounded-md shadow-sm bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                <Github className="h-5 w-5 mr-2" />
                <span>GitHub</span>
              </button>
              <button
                type="button"
                onClick={() => handleSocialAuth('Twitter')}
                className="w-full inline-flex justify-center py-2 px-4 border border-neutral-300 rounded-md shadow-sm bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                <Twitter className="h-5 w-5 mr-2 text-blue-400" />
                <span>Twitter</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;