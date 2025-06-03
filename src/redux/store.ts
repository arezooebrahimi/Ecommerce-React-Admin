import { configureStore } from '@reduxjs/toolkit';
import { categoryApi } from '../api/categoryApi';
import { mediaApi } from '../api/mediaApi';
import { featureApi } from '../api/featureApi';
import { featureOptionApi } from '../api/featureOptionApi';
import { tagApi } from '../api/tagApi';
import { brandApi } from '../api/brandApi';
import { productApi } from '../api/productApi';
import { productReviewApi } from '../api/productReviewApi';

export const store = configureStore({
  reducer: {
    [categoryApi.reducerPath]: categoryApi.reducer,
    [mediaApi.reducerPath]: mediaApi.reducer,
    [featureApi.reducerPath] : featureApi.reducer,
    [featureOptionApi.reducerPath] : featureOptionApi.reducer,
    [tagApi.reducerPath] : tagApi.reducer,
    [brandApi.reducerPath] : brandApi.reducer,
    [productApi.reducerPath] : productApi.reducer,
    [productReviewApi.reducerPath] : productReviewApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(categoryApi.middleware, mediaApi.middleware,featureApi.middleware,featureOptionApi.middleware,tagApi.middleware,brandApi.middleware,productApi.middleware,productReviewApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;