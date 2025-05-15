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
  endpoints: (builder) => ({
    getPaginatedCategories: builder.mutation<PaginatedCategoriesResponse, PaginatedCategoriesRequest>({
      query: (body) => ({
        url: 'admin/Category/GetPaginate',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetPaginatedCategoriesMutation } = categoryApi;