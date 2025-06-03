import { Filters } from "./table";

export interface BrandItem {
  id: string | number;
  name: string;
  description: string;
  onEdit?: (id: string) => void;
}


export interface PaginatedBrandResponse {
  data: {
    items: BrandItem[];
    total: number;
  };
  isSuccess: boolean;
  statusCode: number;
  message: string;
}

export interface PaginatedBrandRequest {
  page: number;
  perPage: number;
  sort?: {
    column: keyof BrandItem;
    order: 'asc' | 'desc';
  };
  filters?: Filters;
}

export interface DeleteBrandsResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
}


export interface AddBrandResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
}



export interface getBrandByIdResponse {
  data: AddBrandRequest;
  isSuccess: boolean;
  statusCode: number;
  message: string;
}

export interface AddBrandRequest {
  id?: string;
  name: string;
  description: string;
}


