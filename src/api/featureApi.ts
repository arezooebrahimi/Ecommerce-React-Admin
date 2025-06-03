import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  PaginatedFeaturesResponse,
  PaginatedFeaturesRequest,
  DeleteFeaturesResponse,
  AddFeatureResponse,
  AddFeatureRequest,
  getFeatureByIdResponse
} from '../types/feature';

export const featureApi = createApi({
  reducerPath: 'featureApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://localhost:44374/',
  }),
  tagTypes: ['Feature','FeatureById'],
  endpoints: (builder) => ({
    getPaginatedFeatures: builder.query<PaginatedFeaturesResponse, PaginatedFeaturesRequest>({
      query: (body) => ({
        url: 'admin/Feature/GetPaginate',
        method: 'POST',
        body,
      }),
      providesTags: ['Feature'],
    }),
    deleteFeatures: builder.mutation<DeleteFeaturesResponse, string[]>({
      query: (ids) => ({
        url: 'admin/Feature',
        method: 'DELETE',
        body: ids,
      }),
      invalidatesTags: ['Feature'],
    }),
    addFeature: builder.mutation<AddFeatureResponse, AddFeatureRequest>({
      query: (body) => ({
        url: 'admin/Feature',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Feature'],
    }),
    getFeatureById: builder.query<getFeatureByIdResponse, string>({
      query: (id) => ({
        url: `admin/Feature/${id}`,
        method: 'GET',
      }),
      providesTags: ['FeatureById'],
    }),
    editFeature: builder.mutation<AddFeatureResponse, AddFeatureRequest>({
      query: (body) => ({
        url: 'admin/Feature',
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: ['Feature','FeatureById'],
    })
  }),
});

export const { useGetPaginatedFeaturesQuery, useDeleteFeaturesMutation, useAddFeatureMutation,useEditFeatureMutation, useGetFeatureByIdQuery } = featureApi;