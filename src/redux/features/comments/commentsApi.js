import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getBaseUrl from '../../../utils/baseURL';

const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/comments`,
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const commentsApi = createApi({
  reducerPath: 'commentsApi',
  baseQuery,
  tagTypes: ['Comments'],
  endpoints: (builder) => ({
    fetchCommentsByBook: builder.query({
      query: (bookId) => `/book/${bookId}`,
      providesTags: (result, error, bookId) => [{ type: 'Comments', id: bookId }],
    }),
    fetchCommentsByList: builder.query({
      query: (listId) => `/list/${listId}`,
      providesTags: (result, error, listId) => [{ type: 'Comments', id: listId }],
    }),
    addComment: builder.mutation({
      query: (data) => ({
        url: `/`,
        method: 'POST',
        body: data,
      }),
      // Fix typo here: "ListId" --> "listId" (case-sensitive)
      invalidatesTags: (result, error, { bookId, listId, type }) => {
        if (type === 'book') return [{ type: 'Comments', id: bookId }];
        if (type === 'list') return [{ type: 'Comments', id: listId }];
        return ['Comments'];
      },
    }),
    deleteComment: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Comments'],
    }),
  }),
});

export const {
  useFetchCommentsByBookQuery,
  useFetchCommentsByListQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
} = commentsApi;

export default commentsApi;
