import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { 
  PaginatedCategoriesResponse, 
  PaginatedCategoriesRequest,
  DeleteCategoriesResponse,
  AddCategoryResponse,
  AddCategoryRequest,
  GetParentCategoriesResponse,
  GetCategoryByIdResponse
} from '../types/category';

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://localhost:44374/',
  }),
  tagTypes: ['Category','CategoryById'],
  endpoints: (builder) => ({
    getPaginatedCategories: builder.query<PaginatedCategoriesResponse, PaginatedCategoriesRequest>({
      query: (body) => ({
        url: 'admin/Category/GetPaginate',
        method: 'POST',
        body,
      }),
      providesTags: ['Category'],
    }),
    deleteCategories: builder.mutation<DeleteCategoriesResponse, string[]>({
      query: (ids) => ({
        url: 'admin/Category',
        method: 'DELETE',
        body: ids,
      }),
      invalidatesTags: ['Category'],
    }),
    addCategory: builder.mutation<AddCategoryResponse, AddCategoryRequest>({
      query: (body) => ({
        url: 'admin/Category',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Category'],
    }),
    getParentCategories: builder.query<GetParentCategoriesResponse, void>({
      query: () => ({
        url: 'admin/Category/GetParentsForSelect',
        method: 'GET',
      }),
    }),
    getCategoryById: builder.query<GetCategoryByIdResponse, string>({
      query: (id) => ({
        url: `admin/Category/${id}`,
        method: 'GET',
      }),
      providesTags: ['CategoryById'],
    }),
    editCategory: builder.mutation<AddCategoryResponse, AddCategoryRequest>({
      query: (body) => ({
        url: 'admin/Category',
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: ['Category','CategoryById'],
    }),
  }),
});

export const { useGetPaginatedCategoriesQuery,useDeleteCategoriesMutation,useAddCategoryMutation,useGetParentCategoriesQuery,useGetCategoryByIdQuery,useEditCategoryMutation } = categoryApi;