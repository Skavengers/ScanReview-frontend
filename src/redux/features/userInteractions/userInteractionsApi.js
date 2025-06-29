import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getBaseUrl from '../../../utils/baseURL';

const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/auth`, // Adjusted base URL
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
        url: `/interactions?userId=${userId}&bookId=${bookId}`, // Adjusted URL
        method: 'GET',
      }),
      transformErrorResponse: (response) => {
        console.error('Error response:', response);
        return response.data || { error: 'An unknown error occurred' };
      },
      providesTags: ['UserInteractions'],
    }),
    saveUserInteraction: builder.mutation({
      query: ({ userId, bookId, ...rest }) => ({
        url: '/interactions', // Adjusted URL
        method: 'POST',
        body: { userId, bookId, ...rest },
      }),
      invalidatesTags: ['UserInteractions'],
      transformErrorResponse: (response) => {
        console.error('Error response:', response);
        return response.data || { error: 'An unknown error occurred' };
      },
    }),
  }),
});

export const {
  useFetchUserInteractionsQuery,
  useSaveUserInteractionMutation,
} = userInteractionsApi;

export default userInteractionsApi;
