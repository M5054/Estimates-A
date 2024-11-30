export interface RetryOptions {
  attempts: number;
  delay: number;
  backoff: number;
}

export interface QueryOptions {
  context: string;
  errorMessage?: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: any;
}