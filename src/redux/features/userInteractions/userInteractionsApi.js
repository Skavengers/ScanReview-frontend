import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getBaseUrl from '../../../utils/baseURL';

const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/auth`,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const userInteractionsApi = createApi({
  reducerPath: 'userInteractionsApi',
  baseQuery: baseQuery,
  tagTypes: ['UserInteractions'],
  endpoints: (builder) => ({
    fetchUserInteractions: builder.query({
      query: ({ userId, bookId }) => ({
        url: `/interactions?userId=${userId}&bookId=${bookId}`,
        method: 'GET',
      }),
      transformErrorResponse: (response) => {
        console.error('Error response:', response);
        if (response.status === 404) {
          return { error: 'User interactions not found' };
        } else if (response.status === 401) {
          return { error: 'Unauthorized access' };
        } else {
          return response.data || { error: 'An unknown error occurred' };
        }
      },
      providesTags: ['UserInteractions'],
    }),
    saveUserInteraction: builder.mutation({
      query: ({ userId, bookId, ...rest }) => ({
        url: '/interactions',
        method: 'POST',
        body: { userId, bookId, ...rest },
      }),
      invalidatesTags: ['UserInteractions'],
      transformErrorResponse: (response) => {
        console.error('Error response:', response);
        if (response.status === 400) {
          return { error: 'Bad request: User ID, Book ID, and Interaction Type are required' };
        } else if (response.status === 401) {
          return { error: 'Unauthorized access' };
        } else {
          return response.data || { error: 'An unknown error occurred' };
        }
      },
      fetchFavorites: builder.query({
        query: (userId) => `/interactions/favorites?userId=${userId}`,
        providesTags: ['UserInteractions'],
      }),
      toggleFavorite: builder.mutation({
        query: ({ userId, bookId, favorite }) => ({
          url: '/interactions/favorite',
          method: 'POST',
          body: { userId, bookId, favorite }
        }),
        invalidatesTags: ['UserInteractions'],
      }),
    }),
  }),
});

export const {
  useFetchUserInteractionsQuery,
  useSaveUserInteractionMutation,
  useFetchFavoritesQuery,
  useToggleFavoriteMutation,
} = userInteractionsApi;

export default userInteractionsApi;
