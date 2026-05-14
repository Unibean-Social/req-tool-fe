/** Metadata phân trang danh sách (nếu API trả kèm). */
export interface ListPageMetadata {
  pageNumber?: number;
  totalPages?: number;
  totalItems?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export interface ApiResponse<T, TMetadata = unknown> {
  isSuccess: boolean;
  message: string;
  data: T;
  metadata?: TMetadata;
}

export interface ApiErrorShape {
  code?: number;
  message: string;
  status: boolean;
  data?: unknown;
}

export interface RequestParams {
  [key: string]: string | number | boolean | undefined | null | string[];
}
