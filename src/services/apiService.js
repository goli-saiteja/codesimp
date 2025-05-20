// src/services/apiService.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define our base API service
export const apiService = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL || 'https://api.codesource.com/v1',
    prepareHeaders: (headers, { getState }) => {
      // Get the token from the auth state
      const token = getState().auth.token;
      
      // If we have a token, add the Authorization header
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  tagTypes: [
    'Posts',
    'Post',
    'User',
    'Comments',
    'Tags',
    'Bookmarks',
    'Followers',
    'Analytics',
    'Notifications',
    'Snippets',
  ],
  endpoints: (builder) => ({
    // Posts
    getPosts: builder.query({
      query: (params) => ({
        url: '/posts',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.posts.map(({ id }) => ({ type: 'Posts', id })),
              { type: 'Posts', id: 'LIST' },
            ]
          : [{ type: 'Posts', id: 'LIST' }],
    }),
    
    getPost: builder.query({
      query: (id) => `/posts/${id}`,
      providesTags: (result, error, id) => [{ type: 'Post', id }],
    }),
    
    createPost: builder.mutation({
      query: (post) => ({
        url: '/posts',
        method: 'POST',
        body: post,
      }),
      invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
    }),
    
    updatePost: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/posts/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Post', id },
        { type: 'Posts', id: 'LIST' },
      ],
    }),
    
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Post', id },
        { type: 'Posts', id: 'LIST' },
      ],
    }),
    
    // User profiles
    getUserProfile: builder.query({
      query: (userId) => `/users/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'User', id: userId }],
    }),
    
    updateUserProfile: builder.mutation({
      query: ({ userId, ...userData }) => ({
        url: `/users/${userId}`,
        method: 'PATCH',
        body: userData,
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }],
    }),
    
    // Comments
    getComments: builder.query({
      query: (postId) => `/posts/${postId}/comments`,
      providesTags: (result, error, postId) => [{ type: 'Comments', id: postId }],
    }),
    
    addComment: builder.mutation({
      query: ({ postId, content }) => ({
        url: `/posts/${postId}/comments`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: (result, error, { postId }) => [{ type: 'Comments', id: postId }],
    }),
    
    deleteComment: builder.mutation({
      query: ({ postId, commentId }) => ({
        url: `/posts/${postId}/comments/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { postId }) => [{ type: 'Comments', id: postId }],
    }),
    
    // Tags & Categories
    getTags: builder.query({
      query: () => '/tags',
      providesTags: [{ type: 'Tags', id: 'LIST' }],
    }),
    
    getPostsByTag: builder.query({
      query: ({ tag, ...params }) => ({
        url: `/tags/${tag}/posts`,
        params,
      }),
      providesTags: (result, error, { tag }) => [{ type: 'Tags', id: tag }],
    }),
    
    // Bookmarks
    getBookmarks: builder.query({
      query: (params) => ({
        url: '/bookmarks',
        params,
      }),
      providesTags: [{ type: 'Bookmarks', id: 'LIST' }],
    }),
    
    addBookmark: builder.mutation({
      query: (postId) => ({
        url: '/bookmarks',
        method: 'POST',
        body: { postId },
      }),
      invalidatesTags: [{ type: 'Bookmarks', id: 'LIST' }],
    }),
    
    removeBookmark: builder.mutation({
      query: (postId) => ({
        url: `/bookmarks/${postId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Bookmarks', id: 'LIST' }],
    }),
    
    // Following/Followers
    getFollowers: builder.query({
      query: (userId) => `/users/${userId}/followers`,
      providesTags: (result, error, userId) => [{ type: 'Followers', id: `${userId}-followers` }],
    }),
    
    getFollowing: builder.query({
      query: (userId) => `/users/${userId}/following`,
      providesTags: (result, error, userId) => [{ type: 'Followers', id: `${userId}-following` }],
    }),
    
    followUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}/follow`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, userId) => [
        { type: 'Followers', id: `${userId}-followers` },
        { type: 'User', id: userId },
      ],
    }),
    
    unfollowUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}/follow`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, userId) => [
        { type: 'Followers', id: `${userId}-followers` },
        { type: 'User', id: userId },
      ],
    }),
    
    // Analytics
    getPostAnalytics: builder.query({
      query: (postId) => `/analytics/posts/${postId}`,
      providesTags: (result, error, postId) => [{ type: 'Analytics', id: `post-${postId}` }],
    }),
    
    getUserAnalytics: builder.query({
      query: (period = '30d') => ({
        url: '/analytics/user',
        params: { period },
      }),
      providesTags: [{ type: 'Analytics', id: 'user' }],
    }),
    
    // Notifications
    getNotifications: builder.query({
      query: (params) => ({
        url: '/notifications',
        params,
      }),
      providesTags: [{ type: 'Notifications', id: 'LIST' }],
    }),
    
    markNotificationRead: builder.mutation({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: [{ type: 'Notifications', id: 'LIST' }],
    }),
    
    markAllNotificationsRead: builder.mutation({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PATCH',
      }),
      invalidatesTags: [{ type: 'Notifications', id: 'LIST' }],
    }),
    
    // Code Snippets
    getCodeSnippets: builder.query({
      query: (params) => ({
        url: '/snippets',
        params,
      }),
      providesTags: [{ type: 'Snippets', id: 'LIST' }],
    }),
    
    getCodeSnippet: builder.query({
      query: (snippetId) => `/snippets/${snippetId}`,
      providesTags: (result, error, snippetId) => [{ type: 'Snippets', id: snippetId }],
    }),
    
    createCodeSnippet: builder.mutation({
      query: (snippet) => ({
        url: '/snippets',
        method: 'POST',
        body: snippet,
      }),
      invalidatesTags: [{ type: 'Snippets', id: 'LIST' }],
    }),
    
    updateCodeSnippet: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/snippets/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Snippets', id }],
    }),
    
    deleteCodeSnippet: builder.mutation({
      query: (snippetId) => ({
        url: `/snippets/${snippetId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, snippetId) => [
        { type: 'Snippets', id: snippetId },
        { type: 'Snippets', id: 'LIST' },
      ],
    }),
    
    // Search
    search: builder.query({
      query: (params) => ({
        url: '/search',
        params,
      }),
    }),
  }),
});

// Export hooks for the endpoints
export const {
  // Posts
  useGetPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  
  // User profiles
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  
  // Comments
  useGetCommentsQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
  
  // Tags & Categories
  useGetTagsQuery,
  useGetPostsByTagQuery,
  
  // Bookmarks
  useGetBookmarksQuery,
  useAddBookmarkMutation,
  useRemoveBookmarkMutation,
  
  // Following/Followers
  useGetFollowersQuery,
  useGetFollowingQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
  
  // Analytics
  useGetPostAnalyticsQuery,
  useGetUserAnalyticsQuery,
  
  // Notifications
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  
  // Code Snippets
  useGetCodeSnippetsQuery,
  useGetCodeSnippetQuery,
  useCreateCodeSnippetMutation,
  useUpdateCodeSnippetMutation,
  useDeleteCodeSnippetMutation,
  
  // Search
  useSearchQuery,
} = apiService;