export class APIError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const handleAPIError = (error: any): never => {
  console.error('[API Error]:', error);
  
  const message = error?.message || 'An unexpected error occurred';
  const code = error?.code || 'UNKNOWN_ERROR';
  
  throw new APIError(message, code, error?.details);
};

export const parseJSONSafely = <T>(jsonString: string, fallback: T): T => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return fallback;
  }
};