import { configureStore } from '@reduxjs/toolkit';
import booksApi from './features/books/booksApi';
import listApi from './features/lists/listApiSlice';
import userInteractionsApi from './features/userInteractions/userInteractionsApi';
import commentsApi from './features/comments/commentsApi';
export const store = configureStore({
  reducer: {
    [booksApi.reducerPath]: booksApi.reducer,
    [listApi.reducerPath]: listApi.reducer,
    [userInteractionsApi.reducerPath]: userInteractionsApi.reducer,
    [commentsApi.reducerPath]: commentsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      booksApi.middleware, 
      listApi.middleware, 
      userInteractionsApi.middleware,
      commentsApi.middleware,
    ),
})