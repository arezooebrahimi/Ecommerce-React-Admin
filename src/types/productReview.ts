import { Filters } from "./table";

export interface ProductReviewItem {
  id: string | number;
  name?: string;
  isUser: boolean;
  title: string;
  reviewText: string;
  rating: number;
  productName: string;
  createdAt: string;
  isApproved: boolean;
  onEdit?: (id: string) => void;
}
export interface PaginatedProductReviewsResponse {
  data: {
    items: ProductReviewItem[];
    total: number;
  };
  isSuccess: boolean;
  statusCode: number;
  message: string;
}

export interface PaginatedProductReviewsRequest {
  page: number;
  perPage: number;
  sort?: {
    column: keyof ProductReviewItem;
    order: 'asc' | 'desc';
  };
  filters?: Filters;
}

export interface DeleteProductReviewsResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
}


export interface AddProductReviewResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
}


export interface getProductReviewByIdResponse {
  data: AddProductReviewRequest;
  isSuccess: boolean;
  statusCode: number;
  message: string;
}

export interface AddProductReviewRequest {
  id?: string;
  title: string;
  reviewText: string;
  rating: number;
  productId: string;
}

