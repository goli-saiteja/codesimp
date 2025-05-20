// src/services/editorService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://api.codesource.com/v1';

// Create axios instance with default config
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

const editorService = {
  /**
   * Save post as draft or publish
   * @param {Object} postData Post data to save
   * @returns {Promise} Promise with saved post data
   */
  async savePost(postData) {
    try {
      // If post has an ID, update it; otherwise create new post
      const endpoint = postData.id ? `/posts/${postData.id}` : '/posts';
      const method = postData.id ? 'put' : 'post';
      
      const response = await api[method](endpoint, postData);
      return response.data;
    } catch (error) {
      console.error('Error saving post:', error);
      throw error;
    }
  },
  
  /**
   * Get post by ID for editing
   * @param {string} postId ID of the post to retrieve
   * @returns {Promise} Promise with post data
   */
  async getPostById(postId) {
    try {
      const response = await api.get(`/posts/${postId}/edit`);
      return response.data;
    } catch (error) {
      console.error('Error loading post:', error);
      throw error;
    }
  },
  
  /**
   * Upload image for post content
   * @param {File} imageFile Image file to upload
   * @returns {Promise} Promise with uploaded image URL
   */
  async uploadImage(imageFile) {
    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await api.post('/uploads/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },
  
  /**
   * Save a version of the post
   * @param {string} postId ID of the post
   * @param {string} versionName Name of the version
   * @returns {Promise} Promise with version data
   */
  async saveVersion(postId, versionName) {
    try {
      const response = await api.post(`/posts/${postId}/versions`, {
        name: versionName,
      });
      
      return response.data;
    } catch (error) {
      console.error('Error saving version:', error);
      throw error;
    }
  },
  
  /**
   * Load a specific version of a post
   * @param {string} postId ID of the post
   * @param {string} versionId ID of the version
   * @returns {Promise} Promise with version data
   */
  async loadVersion(postId, versionId) {
    try {
      const response = await api.get(`/posts/${postId}/versions/${versionId}`);
      return response.data;
    } catch (error) {
      console.error('Error loading version:', error);
      throw error;
    }
  },
  
  /**
   * Get version history for a post
   * @param {string} postId ID of the post
   * @returns {Promise} Promise with version history
   */
  async getVersionHistory(postId) {
    try {
      const response = await api.get(`/posts/${postId}/versions`);
      return response.data;
    } catch (error) {
      console.error('Error getting version history:', error);
      throw error;
    }
  },
  
  /**
   * Invite collaborator to a post
   * @param {string} postId ID of the post
   * @param {string} email Email of the collaborator
   * @param {string} permission Permission level ('read', 'write', 'admin')
   * @returns {Promise} Promise with collaborator data
   */
  async inviteCollaborator(postId, email, permission) {
    try {
      const response = await api.post(`/posts/${postId}/collaborators`, {
        email,
        permission,
      });
      
      return response.data;
    } catch (error) {
      console.error('Error inviting collaborator:', error);
      throw error;
    }
  },
  
  /**
   * Remove collaborator from a post
   * @param {string} postId ID of the post
   * @param {string} collaboratorId ID of the collaborator
   * @returns {Promise} Promise with success status
   */
  async removeCollaborator(postId, collaboratorId) {
    try {
      const response = await api.delete(`/posts/${postId}/collaborators/${collaboratorId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing collaborator:', error);
      throw error;
    }
  },
  
  /**
   * Get all collaborators for a post
   * @param {string} postId ID of the post
   * @returns {Promise} Promise with list of collaborators
   */
  async getCollaborators(postId) {
    try {
      const response = await api.get(`/posts/${postId}/collaborators`);
      return response.data;
    } catch (error) {
      console.error('Error getting collaborators:', error);
      throw error;
    }
  },
  
  /**
   * Analyze code snippet for syntax errors and suggestions
   * @param {string} code Code to analyze
   * @param {string} language Programming language of the code
   * @returns {Promise} Promise with analysis results
   */
  async analyzeCode(code, language) {
    try {
      const response = await api.post('/analyze/code', {
        code,
        language,
      });
      
      return response.data;
    } catch (error) {
      console.error('Error analyzing code:', error);
      throw error;
    }
  },
  
  /**
   * Get AI-generated suggestions for improving content
   * @param {string} content Post content to analyze
   * @returns {Promise} Promise with suggestions
   */
  async getContentSuggestions(content) {
    try {
      const response = await api.post('/ai/content-suggestions', {
        content,
      });
      
      return response.data;
    } catch (error) {
      console.error('Error getting content suggestions:', error);
      throw error;
    }
  },
};

export default editorService;