import { configureStore } from '@reduxjs/toolkit';
import { categoryApi } from '../api/categoryApi';
import { mediaApi } from '../api/mediaApi';

export const store = configureStore({
  reducer: {
      [categoryApi.reducerPath]: categoryApi.reducer,
      [mediaApi.reducerPath]: mediaApi.reducer,
    },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(categoryApi.middleware,mediaApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;