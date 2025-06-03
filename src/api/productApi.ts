import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  PaginatedProductsResponse,
  PaginatedProductsRequest,
  DeleteProductsResponse,
  AddProductResponse,
  AddProductRequest,
  getProductByIdResponse
} from '../types/product';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://localhost:44374/',
  }),
  tagTypes: ['Product','ProductById'],
  endpoints: (builder) => ({
    getPaginatedProducts: builder.query<PaginatedProductsResponse, PaginatedProductsRequest>({
      query: (body) => ({
        url: 'admin/Product/GetPaginate',
        method: 'POST',
        body,
      }),
      providesTags: ['Product'],
    }),
    deleteProducts: builder.mutation<DeleteProductsResponse, string[]>({
      query: (ids) => ({
        url: 'admin/Product',
        method: 'DELETE',
        body: ids,
      }),
      invalidatesTags: ['Product'],
    }),
    addProduct: builder.mutation<AddProductResponse, AddProductRequest>({
      query: (body) => ({
        url: 'admin/Product',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Product'],
    }),
    getProductById: builder.query<getProductByIdResponse, string>({
      query: (id) => ({
        url: `admin/Product/${id}`,
        method: 'GET',
      }),
      providesTags: ['ProductById'],
    }),
    editProduct: builder.mutation<AddProductResponse, AddProductRequest>({
      query: (body) => ({
        url: 'admin/Product',
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: ['Product','ProductById'],
    }),
  }),
});

export const { useGetPaginatedProductsQuery, useDeleteProductsMutation, useAddProductMutation,useEditProductMutation, useGetProductByIdQuery } = productApi;