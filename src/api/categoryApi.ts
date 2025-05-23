import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { 
  PaginatedCategoriesResponse, 
  PaginatedCategoriesRequest 
} from '../types/category';

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://localhost:44374/',
  }),
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    getPaginatedCategories: builder.query<PaginatedCategoriesResponse, PaginatedCategoriesRequest>({
      query: (body) => ({
        url: 'admin/Category/GetPaginate',
        method: 'POST',
        body,
      }),
      providesTags: ['Category'],
    }),
  }),
});

export const { useGetPaginatedCategoriesQuery } = categoryApi;