import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './features/cart/cartSlice'
import booksApi from './features/books/booksApi'
import listApi from './features/lists/listApiSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    //lists: listReducer,
    [booksApi.reducerPath]: booksApi.reducer,
    [listApi.reducerPath]: listApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(booksApi.middleware, listApi.middleware),
})