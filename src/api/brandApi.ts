import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  AddBrandRequest,
  getBrandByIdResponse,
  PaginatedBrandResponse,
  PaginatedBrandRequest,
  DeleteBrandsResponse,
  AddBrandResponse,
} from '../types/brand';

export const brandApi = createApi({
  reducerPath: 'brandApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://localhost:44374/',
  }),
  tagTypes: ['Brand','BrandById'],
  endpoints: (builder) => ({
    getPaginatedBrands: builder.query<PaginatedBrandResponse, PaginatedBrandRequest>({
      query: (body) => ({
        url: 'admin/Brand/GetPaginate',
        method: 'POST',
        body,
      }),
      providesTags: ['Brand'],
    }),
    deleteBrands: builder.mutation<DeleteBrandsResponse, string[]>({
      query: (ids) => ({
        url: 'admin/Brand',
        method: 'DELETE',
        body: ids,
      }),
      invalidatesTags: ['Brand'],
    }),
    addBrand: builder.mutation<AddBrandResponse, AddBrandRequest>({
      query: (body) => ({
        url: 'admin/Brand',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Brand'],
    }),
    getBrandById: builder.query<getBrandByIdResponse, string>({
      query: (id) => ({
        url: `admin/Brand/${id}`,
        method: 'GET',
      }),
      providesTags: ['BrandById'],
    }),
    editBrand: builder.mutation<AddBrandResponse, AddBrandRequest>({
      query: (body) => ({
        url: 'admin/Brand',
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: ['Brand','BrandById'],
    })
  }),
});

export const { useGetPaginatedBrandsQuery, useDeleteBrandsMutation, useAddBrandMutation,useEditBrandMutation, useGetBrandByIdQuery } = brandApi;