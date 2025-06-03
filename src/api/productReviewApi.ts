import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  PaginatedProductReviewsResponse,
  PaginatedProductReviewsRequest,
  DeleteProductReviewsResponse,
  AddProductReviewResponse,
  AddProductReviewRequest,
  getProductReviewByIdResponse
} from '../types/productReview';

export const productReviewApi = createApi({
  reducerPath: 'productReviewApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://localhost:44374/',
  }),
  tagTypes: ['ProductReview','ProductReviewById'],
  endpoints: (builder) => ({
    getPaginatedProductReviews: builder.query<PaginatedProductReviewsResponse, PaginatedProductReviewsRequest>({
      query: (body) => ({
        url: 'admin/ProductReview/GetPaginate',
        method: 'POST',
        body,
      }),
      providesTags: ['ProductReview'],
    }),
    deleteProductReviews: builder.mutation<DeleteProductReviewsResponse, string[]>({
      query: (ids) => ({
        url: 'admin/ProductReview',
        method: 'DELETE',
        body: ids,
      }),
      invalidatesTags: ['ProductReview'],
    }),
    addProductReview: builder.mutation<AddProductReviewResponse, AddProductReviewRequest>({
      query: (body) => ({
        url: 'admin/ProductReview',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['ProductReview'],
    }),
    getProductReviewById: builder.query<getProductReviewByIdResponse, string>({
      query: (id) => ({
        url: `admin/ProductReview/${id}`,
        method: 'GET',
      }),
      providesTags: ['ProductReviewById'],
    }),
    editProductReview: builder.mutation<AddProductReviewResponse, AddProductReviewRequest>({
      query: (body) => ({
        url: 'admin/ProductReview',
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: ['ProductReview','ProductReviewById'],
    })
  }),
});

export const { useGetPaginatedProductReviewsQuery, useDeleteProductReviewsMutation, useAddProductReviewMutation,useEditProductReviewMutation, useGetProductReviewByIdQuery } = productReviewApi;