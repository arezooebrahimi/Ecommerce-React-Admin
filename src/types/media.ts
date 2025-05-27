export interface MediaFormat {
    fileName: string;
    filePath: string;
    format: string;
    ext: string;
    width: number;
    height: number;
}

export interface MediaItem {
    id: string;
    fileName: string;
    filePath: string;
    mimeType: string;
    size: number;
    createdAt: string;
    formats: MediaFormat[];
}

export interface MediaResponse {
    data: {
        items: MediaItem[];
        total: number;
    };
    isSuccess: boolean;
    statusCode: number;
    message: string;
}

export interface MediaRequest {
    limit: number;
    offset: number;
    filter: string;
}

export interface UploadMediaResponse {
    data: string[];
    isSuccess: boolean;
    statusCode: number;
    message: string;
}


export interface DeleteMediaResponse {
    isSuccess: boolean;
    statusCode: number;
    message: string;
}