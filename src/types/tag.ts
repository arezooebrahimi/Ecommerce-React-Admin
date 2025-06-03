import { Filters } from "./table";

export interface TagItem {
  id: string | number;
  name: string;
  slug: string;
  createdAt: string;
  onEdit?: (id: string) => void;
}


export interface PaginatedTagResponse {
  data: {
    items: TagItem[];
    total: number;
  };
  isSuccess: boolean;
  statusCode: number;
  message: string;
}

export interface PaginatedTagRequest {
  page: number;
  perPage: number;
  sort?: {
    column: keyof TagItem;
    order: 'asc' | 'desc';
  };
  filters?: Filters;
}

export interface DeleteTagsResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
}


export interface AddTagResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
}



export interface getTagByIdResponse {
  data: AddTagRequest;
  isSuccess: boolean;
  statusCode: number;
  message: string;
}

export interface AddTagRequest {
  id?: string;
  name: string;
  slug: string;
  order:number;
  description:string
  seoTitle:string;
  metaDescription:string;
  canonicalUrl:string;
  isIndexed:boolean;
  isFollowed:boolean;
}


