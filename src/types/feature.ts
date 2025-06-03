import { Filters } from "./table";

export interface FeatureItem {
  id: string | number;
  name: string;
  slug: string;
  isFilter: boolean;
  optionsName: string[];
  createdAt: string;
  onEdit?: (id: string) => void;
}


export interface PaginatedFeaturesResponse {
  data: {
    items: FeatureItem[];
    total: number;
  };
  isSuccess: boolean;
  statusCode: number;
  message: string;
}

export interface PaginatedFeaturesRequest {
  page: number;
  perPage: number;
  sort?: {
    column: keyof FeatureItem;
    order: 'asc' | 'desc';
  };
  filters?: Filters;
}

export interface DeleteFeaturesResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
}


export interface AddFeatureResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
}



export interface getFeatureByIdResponse {
  data: AddFeatureRequest;
  isSuccess: boolean;
  statusCode: number;
  message: string;
}

export interface AddFeatureRequest {
  id?: string;
  name: string;
  slug: string;
  isFilter: boolean;
}


