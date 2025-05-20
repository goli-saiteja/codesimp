// src/services/authService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://api.codesource.com/v1';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

const authService = {
  /**
   * Log in a user with email and password
   * @param {string} email User email
   * @param {string} password User password
   * @returns {Promise} Promise with user data and token
   */
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  },
  
  /**
   * Register a new user
   * @param {string} name User's full name
   * @param {string} email User email
   * @param {string} password User password
   * @returns {Promise} Promise with registration result
   */
  async register(name, email, password) {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
    });
    return response.data;
  },
  
  /**
   * Log out the current user
   * @returns {Promise} Promise indicating logout success
   */
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    localStorage.removeItem('token');
    return { success: true };
  },
  
  /**
   * Get the current user's profile
   * @returns {Promise} Promise with user profile data
   */
  async getUserProfile() {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  /**
   * Update user profile information
   * @param {Object} userData Updated user data
   * @returns {Promise} Promise with updated user data
   */
  async updateUserProfile(userData) {
    const response = await api.patch('/auth/me', userData);
    return response.data;
  },
  
  /**
   * Change user password
   * @param {string} currentPassword Current password
   * @param {string} newPassword New password
   * @returns {Promise} Promise with password change result
   */
  async changePassword(currentPassword, newPassword) {
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
  
  /**
   * Request password reset
   * @param {string} email User email
   * @returns {Promise} Promise with password reset request result
   */
  async requestPasswordReset(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
  
  /**
   * Reset password with token
   * @param {string} token Reset token
   * @param {string} newPassword New password
   * @returns {Promise} Promise with password reset result
   */
  async resetPassword(token, newPassword) {
    const response = await api.post('/auth/reset-password', {
      token,
      newPassword,
    });
    return response.data;
  },
  
  /**
   * Verify email with token
   * @param {string} token Verification token
   * @returns {Promise} Promise with email verification result
   */
  async verifyEmail(token) {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },
  
  /**
   * Request email verification link
   * @returns {Promise} Promise with verification request result
   */
  async requestEmailVerification() {
    const response = await api.post('/auth/request-verification');
    return response.data;
  },
  
  /**
   * GitHub OAuth login
   * @param {string} code Authorization code from GitHub
   * @returns {Promise} Promise with login result and tokens
   */
  async githubLogin(code) {
    const response = await api.post('/auth/github', { code });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  },
  
  /**
   * Google OAuth login
   * @param {string} token ID token from Google
   * @returns {Promise} Promise with login result and tokens
   */
  async googleLogin(token) {
    const response = await api.post('/auth/google', { token });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  },
  
  /**
   * Enable two-factor authentication
   * @returns {Promise} Promise with 2FA setup data
   */
  async enableTwoFactorAuth() {
    const response = await api.post('/auth/2fa/enable');
    return response.data;
  },
  
  /**
   * Verify two-factor authentication setup
   * @param {string} token Verification token
   * @returns {Promise} Promise with 2FA verification result
   */
  async verifyTwoFactorAuth(token) {
    const response = await api.post('/auth/2fa/verify', { token });
    return response.data;
  },
  
  /**
   * Disable two-factor authentication
   * @param {string} token Verification token
   * @returns {Promise} Promise with 2FA disable result
   */
  async disableTwoFactorAuth(token) {
    const response = await api.post('/auth/2fa/disable', { token });
    return response.data;
  },
  
  /**
   * Generate recovery codes for 2FA
   * @returns {Promise} Promise with recovery codes
   */
  async generateRecoveryCodes() {
    const response = await api.post('/auth/2fa/recovery-codes');
    return response.data;
  },
  
  /**
   * Check if token is valid
   * @returns {Promise<boolean>} Promise with token validity
   */
  async checkToken() {
    try {
      await api.get('/auth/verify-token');
      return true;
    } catch (error) {
      localStorage.removeItem('token');
      return false;
    }
  },
  
  /**
   * Get the stored token
   * @returns {string|null} The stored token or null
   */
  getToken() {
    return localStorage.getItem('token');
  },
};

export default authService;