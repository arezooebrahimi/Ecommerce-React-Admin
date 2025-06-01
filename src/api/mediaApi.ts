import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { MediaResponse, MediaRequest, UploadMediaResponse,DeleteMediaResponse, MediaItem} from '../types/media';



export const mediaApi = createApi({
  reducerPath: 'mediaApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://localhost:44344/',
  }),
  endpoints: (builder) => ({
    getMedia: builder.mutation<MediaResponse, MediaRequest>({
      query: (body) => ({
        url: 'file_manager/Media',
        method: 'POST',
        body,
      }),
    }),
    uploadMedia: builder.mutation<UploadMediaResponse, FormData>({
      query: (formData) => ({
        url: 'file_manager/media/upload',
        method: 'POST',
        body: formData,
      }),
    }),
    deleteMedia: builder.mutation<DeleteMediaResponse, string[]>({
      query: (ids) => ({
        url: 'file_manager/media',
        method: 'DELETE',
        body: ids,
      }),
    }),
    getMediaById: builder.mutation<{ data: MediaItem, isSuccess: boolean, statusCode: number, message: string }, string>({
      query: (id) => ({
        url: `file_manager/media/${id}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetMediaMutation, useUploadMediaMutation, useDeleteMediaMutation, useGetMediaByIdMutation } = mediaApi;