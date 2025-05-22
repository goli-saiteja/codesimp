import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async ({ page = 1, limit = 10, filter = 'latest' }, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // For demonstration, we'll simulate a network request
      const response = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            articles: [
              {
                id: 1,
                title: 'Building Scalable React Applications with Redux Toolkit',
                excerpt: 'Learn how to structure large-scale React applications with Redux Toolkit for optimal performance and maintainability.',
                coverImage: '/api/placeholder/640/360',
                author: {
                  id: 1,
                  name: 'Sarah Chen',
                  avatar: '/api/placeholder/40/40',
                  username: 'sarahchen'
                },
                publishedAt: '2023-05-15T10:30:00Z',
                readTime: 8,
                tags: ['react', 'redux', 'javascript'],
                commentsCount: 24,
                likesCount: 182,
                bookmarked: false,
                featured: true
              },
              // More articles would be here
            ],
            totalCount: 100,
            currentPage: page,
            totalPages: 10,
          });
        }, 1000);
      });
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchArticleById = createAsyncThunk(
  'articles/fetchArticleById',
  async (id, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      const response = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            id: 1,
            title: 'Building Scalable React Applications with Redux Toolkit',
            content: '<p>Redux Toolkit is the official, opinionated, batteries-included toolset for efficient Redux development...</p>',
            excerpt: 'Learn how to structure large-scale React applications with Redux Toolkit for optimal performance and maintainability.',
            coverImage: '/api/placeholder/1200/630',
            author: {
              id: 1,
              name: 'Sarah Chen',
              avatar: '/api/placeholder/40/40',
              username: 'sarahchen',
              bio: 'Frontend Developer | React Enthusiast',
            },
            publishedAt: '2023-05-15T10:30:00Z',
            updatedAt: '2023-05-16T14:22:00Z',
            readTime: 8,
            tags: ['react', 'redux', 'javascript'],
            commentsCount: 24,
            likesCount: 182,
            bookmarked: false,
            featured: true,
            views: 1432,
            comments: [
              {
                id: 1,
                author: {
                  id: 2,
                  name: 'Alex Rivera',
                  avatar: '/api/placeholder/40/40',
                  username: 'alexrivera'
                },
                content: 'Great article! I really appreciated the section on performance optimization.',
                createdAt: '2023-05-15T16:45:00Z',
                likesCount: 5,
              },
              // More comments would be here
            ]
          });
        }, 800);
      });
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createArticle = createAsyncThunk(
  'articles/createArticle',
  async (articleData, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      const response = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            id: Math.floor(Math.random() * 10000),
            ...articleData,
            publishedAt: new Date().toISOString(),
            commentsCount: 0,
            likesCount: 0,
            views: 0,
          });
        }, 1500);
      });
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateArticle = createAsyncThunk(
  'articles/updateArticle',
  async ({ id, articleData }, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      const response = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            id,
            ...articleData,
            updatedAt: new Date().toISOString(),
          });
        }, 1200);
      });
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleBookmark = createAsyncThunk(
  'articles/toggleBookmark',
  async (id, { rejectWithValue, getState }) => {
    try {
      const { articles } = getState();
      const article = articles.entities[id];
      
      if (!article) {
        throw new Error('Article not found');
      }
      
      // In a real app, this would be an API call
      const response = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            id,
            bookmarked: !article.bookmarked,
          });
        }, 500);
      });
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleLike = createAsyncThunk(
  'articles/toggleLike',
  async (id, { rejectWithValue, getState }) => {
    try {
      const { articles } = getState();
      const article = articles.entities[id];
      
      if (!article) {
        throw new Error('Article not found');
      }
      
      // In a real app, this would be an API call
      const response = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            id,
            liked: !article.liked,
            likesCount: article.liked 
              ? article.likesCount - 1 
              : article.likesCount + 1,
          });
        }, 500);
      });
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice definition
const articleSlice = createSlice({
  name: 'articles',
  initialState: {
    entities: {},
    ids: [],
    currentArticle: null,
    loading: false,
    error: null,
    pagination: {
      totalCount: 0,
      currentPage: 1,
      totalPages: 1,
    },
  },
  reducers: {
    clearArticleError: (state) => {
      state.error = null;
    },
    resetCurrentArticle: (state) => {
      state.currentArticle = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchArticles
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false;
        
        // Normalize the data: add all articles to entities and ids
        action.payload.articles.forEach(article => {
          state.entities[article.id] = article;
          if (!state.ids.includes(article.id)) {
            state.ids.push(article.id);
          }
        });
        
        // Update pagination
        state.pagination = {
          totalCount: action.payload.totalCount,
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch articles';
      })
      
      // Handle fetchArticleById
      .addCase(fetchArticleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticleById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentArticle = action.payload;
        state.entities[action.payload.id] = action.payload;
        if (!state.ids.includes(action.payload.id)) {
          state.ids.push(action.payload.id);
        }
      })
      .addCase(fetchArticleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch article';
      })
      
      // Handle createArticle
      .addCase(createArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.entities[action.payload.id] = action.payload;
        state.ids.push(action.payload.id);
        state.currentArticle = action.payload;
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create article';
      })
      
      // Handle updateArticle
      .addCase(updateArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.entities[action.payload.id] = {
          ...state.entities[action.payload.id],
          ...action.payload,
        };
        if (state.currentArticle && state.currentArticle.id === action.payload.id) {
          state.currentArticle = {
            ...state.currentArticle,
            ...action.payload,
          };
        }
      })
      .addCase(updateArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update article';
      })
      
      // Handle toggleBookmark
      .addCase(toggleBookmark.fulfilled, (state, action) => {
        state.entities[action.payload.id].bookmarked = action.payload.bookmarked;
        if (state.currentArticle && state.currentArticle.id === action.payload.id) {
          state.currentArticle.bookmarked = action.payload.bookmarked;
        }
      })
      
      // Handle toggleLike
      .addCase(toggleLike.fulfilled, (state, action) => {
        state.entities[action.payload.id].liked = action.payload.liked;
        state.entities[action.payload.id].likesCount = action.payload.likesCount;
        if (state.currentArticle && state.currentArticle.id === action.payload.id) {
          state.currentArticle.liked = action.payload.liked;
          state.currentArticle.likesCount = action.payload.likesCount;
        }
      });
  },
});

// Export actions and reducer
export const { clearArticleError, resetCurrentArticle } = articleSlice.actions;

export default articleSlice.reducer;

// Selectors
export const selectAllArticles = (state) => state.articles.ids.map(id => state.articles.entities[id]);
export const selectArticleById = (state, id) => state.articles.entities[id];
export const selectCurrentArticle = (state) => state.articles.currentArticle;
export const selectArticlesLoading = (state) => state.articles.loading;
export const selectArticlesError = (state) => state.articles.error;
export const selectArticlesPagination = (state) => state.articles.pagination;
export const selectFeaturedArticles = (state) => state.articles.ids
  .map(id => state.articles.entities[id])
  .filter(article => article.featured);
export const selectBookmarkedArticles = (state) => state.articles.ids
  .map(id => state.articles.entities[id])
  .filter(article => article.bookmarked);