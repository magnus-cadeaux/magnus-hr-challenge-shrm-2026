/**
 * HTTP / remote API surface reserved for Sprint 1+.
 * Services should compose TanStack Query hooks against these contracts.
 */

export type ApiError = {
  message: string;
  code?: string;
  status?: number;
};

export type ApiResponse<T> = {
  data: T;
  error: null;
} | {
  data: null;
  error: ApiError;
};

export function createApiError(
  message: string,
  options?: { code?: string; status?: number },
): ApiError {
  return {
    message,
    code: options?.code,
    status: options?.status,
  };
}
