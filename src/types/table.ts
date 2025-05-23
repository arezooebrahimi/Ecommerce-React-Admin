export type SortOrder = 'asc' | 'desc'; 

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



export interface FilterField {
  key: string;
  label: string;
}

export interface FilterInput {
  field: string;
  mode: FilterMode;
  value: string;
  operator: 'and' | 'or';
}


export interface DeleteDataResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
}