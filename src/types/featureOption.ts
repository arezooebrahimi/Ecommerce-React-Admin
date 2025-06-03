import { Filters } from "./table";

export interface FeatureOptionItem {
  id: string | number;
  name: string;
  slug: string;
  order: number;
  createdAt: string;
  featureName: string;
  onEdit?: (id: string) => void;
}


export interface PaginatedFeatureOptionsResponse {
  data: {
    items: FeatureOptionItem[];
    total: number;
  };
  isSuccess: boolean;
  statusCode: number;
  message: string;
}

export interface PaginatedFeatureOptionsRequest {
  page: number;
  perPage: number;
  sort?: {
    column: keyof FeatureOptionItem;
    order: 'asc' | 'desc';
  };
  filters?: Filters;
}

export interface DeleteFeatureOptionResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
}


export interface AddFeatureOptionResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
}

export interface getFeatureOptionByIdResponse {
  data: AddFeatureOptionRequest;
  isSuccess: boolean;
  statusCode: number;
  message: string;
}

export interface AddFeatureOptionRequest {
  id?: string;
  name: string;
  slug: string;
  description:string;
  order:number
  featureId:string | null
}


