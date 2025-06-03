import { Filters } from "./table";

export interface ProductItem {
  id: string | number;
  name: string;
  slug: string;
  status:number;
  createdAt: string;
  onEdit?: (id: string) => void;
}
export interface PaginatedProductsResponse {
  data: {
    items: ProductItem[];
    total: number;
  };
  isSuccess: boolean;
  statusCode: number;
  message: string;
}

export interface PaginatedProductsRequest {
  page: number;
  perPage: number;
  sort?: {
    column: keyof ProductItem;
    order: 'asc' | 'desc';
  };
  filters?: Filters;
}

export interface DeleteProductsResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
}


export interface AddProductResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
}


interface Media {
  mediaId: string;
  categoryId?: string;
  isPrimary: boolean;
  altText?: string;
  caption?: string;
  title?: string;
}

export interface getProductByIdResponse {
  data: AddProductRequest;
  isSuccess: boolean;
  statusCode: number;
  message: string;
}

export interface AddProductRequest {
  id?: string;
  name: string;
  slug: string;
  description: string | null;
  seoTitle: string | null;
  metaDescription: string | null;
  isIndexed: boolean;
  isFollowed: boolean;
  canonicalUrl: string | null;
  medias: Media[];
}