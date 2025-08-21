import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getBaseUrl from '../../../utils/baseURL';

const listApi = createApi({
  reducerPath: 'listApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/lists`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Lists'],
  endpoints: (builder) => ({
    fetchLists: builder.query({
      query: () => '/',
      providesTags: ['Lists'],
    }),
    fetchListById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Lists', id }],
    }),
    fetchListsByUser: builder.query({
      query: (userId) => `/user/${userId}`,
      providesTags: ['Lists'],
    }),
    fetchListsByCategory: builder.query({
      query: (category) => `/category/${category}`,
      providesTags: ['Lists'],
    }),
    createList: builder.mutation({
      query: (listData) => ({
        url: '/create-list',
        method: 'POST',
        body: listData,
      }),
      invalidatesTags: ['Lists'],
    }),
    updateList: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/edit/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Lists', id }],
    }),
    deleteList: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Lists'],
    }),
likeList: builder.mutation({
  query: (id) => ({
    url: `/${id}/like`,
    method: 'POST',
  }),
  invalidatesTags: (result, error, id) => [{ type: 'Lists', id }],
}),

    viewList: builder.mutation({
      query: (id) => ({
        url: `/${id}/view`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Lists', id }],
    }),
  }),
});

export const {
  useFetchListsQuery,
  useFetchListByIdQuery,
  useFetchListsByUserQuery,
  useFetchListsByCategoryQuery,
  useCreateListMutation,
  useUpdateListMutation,
  useDeleteListMutation,
  useLikeListMutation,
  useViewListMutation,
} = listApi;
export default listApi;
