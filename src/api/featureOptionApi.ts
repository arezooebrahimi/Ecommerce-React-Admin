import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AddFeatureOptionRequest, AddFeatureOptionResponse, DeleteFeatureOptionResponse, getFeatureOptionByIdResponse, PaginatedFeatureOptionsRequest, PaginatedFeatureOptionsResponse } from '../types/featureOption';

export const featureOptionApi = createApi({
    reducerPath: 'featureOptionApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://localhost:44374/',
    }),
    tagTypes: ['FeatureOption', 'FeatureOptionById'],
    endpoints: (builder) => ({
        getPaginatedFeatureOptions: builder.query<PaginatedFeatureOptionsResponse, PaginatedFeatureOptionsRequest>({
            query: (body) => ({
                url: 'admin/FeatureOption/GetPaginate',
                method: 'POST',
                body,
            }),
            providesTags: ['FeatureOption'],
        }),
        deleteFeatureOptions: builder.mutation<DeleteFeatureOptionResponse, string[]>({
            query: (ids) => ({
                url: 'admin/FeatureOption',
                method: 'DELETE',
                body: ids,
            }),
            invalidatesTags: ['FeatureOption'],
        }),
        addFeatureOption: builder.mutation<AddFeatureOptionResponse, AddFeatureOptionRequest>({
            query: (body) => ({
                url: 'admin/FeatureOption',
                method: 'POST',
                body: body,
            }),
            invalidatesTags: ['FeatureOption'],
        }),
        getFeatureOptionById: builder.query<getFeatureOptionByIdResponse, string>({
            query: (id) => ({
                url: `admin/FeatureOption/${id}`,
                method: 'GET',
            }),
            providesTags: ['FeatureOptionById'],
        }),
        editFeatureOption: builder.mutation<AddFeatureOptionResponse, AddFeatureOptionRequest>({
            query: (body) => ({
                url: 'admin/FeatureOption',
                method: 'PUT',
                body: body,
            }),
            invalidatesTags: ['FeatureOption', 'FeatureOptionById'],
        })
    }),
});

export const { useGetPaginatedFeatureOptionsQuery, useDeleteFeatureOptionsMutation, useAddFeatureOptionMutation, useEditFeatureOptionMutation, useGetFeatureOptionByIdQuery } = featureOptionApi;