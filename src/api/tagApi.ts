import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  PaginatedTagResponse,
  PaginatedTagRequest,
  DeleteTagsResponse,
  AddTagResponse,
  AddTagRequest,
  getTagByIdResponse,
} from '../types/tag';

export const tagApi = createApi({
  reducerPath: 'tagApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://localhost:44374/',
  }),
  tagTypes: ['Tag','TagById'],
  endpoints: (builder) => ({
    getPaginatedTags: builder.query<PaginatedTagResponse, PaginatedTagRequest>({
      query: (body) => ({
        url: 'admin/Tag/GetPaginate',
        method: 'POST',
        body,
      }),
      providesTags: ['Tag'],
    }),
    deleteTags: builder.mutation<DeleteTagsResponse, string[]>({
      query: (ids) => ({
        url: 'admin/Tag',
        method: 'DELETE',
        body: ids,
      }),
      invalidatesTags: ['Tag'],
    }),
    addTag: builder.mutation<AddTagResponse, AddTagRequest>({
      query: (body) => ({
        url: 'admin/Tag',
        method: 'POST',
        body: body, 
      }),
      invalidatesTags: ['Tag'],
    }),
    getTagById: builder.query<getTagByIdResponse, string>({
      query: (id) => ({
        url: `admin/Tag/${id}`,
        method: 'GET',
      }),
      providesTags: ['TagById'],
    }),
    editTag: builder.mutation<AddTagResponse, AddTagRequest>({
      query: (body) => ({
        url: 'admin/Tag',
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: ['Tag','TagById'],
    })
  }),
});

export const { useGetPaginatedTagsQuery, useDeleteTagsMutation, useAddTagMutation,useEditTagMutation, useGetTagByIdQuery } = tagApi;