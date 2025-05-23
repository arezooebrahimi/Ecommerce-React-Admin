export interface CategoryItem {
  id: string | number;
  name: string;
  slug: string;
  parentName: string | null;
  createdAt: string;
}

export type FilterMode = 'equals' | 'contains' | 'startsWith' | 'endsWith';

export interface FilterModeConfig {
  mode: FilterMode;
  value: string;
}

export interface FilterConfig {
  operator: 'and' | 'or';
  filterModes: FilterModeConfig[];
}

export interface Filters {
  [key: string]: FilterConfig;
}

export interface PaginatedCategoriesResponse {
  data: {
    items: CategoryItem[];
    total: number;
  };
  isSuccess: boolean;
  statusCode: number;
  message: string;
}

export interface PaginatedCategoriesRequest {
  page: number;
  perPage: number;
  sort?: {
    column: keyof CategoryItem;
    order: 'asc' | 'desc';
  };
  filters?: Filters;
}

export type SortOrder = 'asc' | 'desc';

export interface DeleteCategoriesResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
}



