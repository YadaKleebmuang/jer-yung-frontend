export interface ApiResponse<T> {
  content: T;
  error: string | null;
  status: number;
}

export interface ApiErrorResponse {
  content?: null;
  error?: string | null;
  message?: string;
  status: number;
  timestamp?: string;
}

export interface PaginatedContent<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export type PaginatedApiResponse<T> =
  ApiResponse<PaginatedContent<T>>;
