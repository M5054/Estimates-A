import { AuthError } from './types';

export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  EMAIL_IN_USE: 'Email already in use',
  WEAK_PASSWORD: 'Password is too weak',
  NETWORK_ERROR: 'Network error occurred',
  UNKNOWN_ERROR: 'An unknown error occurred'
} as const;

export const handleAuthError = (error: AuthError): never => {
  console.error('[Auth Error]:', error);

  const errorCode = error.code || 'UNKNOWN_ERROR';
  const errorMessage = AUTH_ERROR_MESSAGES[errorCode as keyof typeof AUTH_ERROR_MESSAGES] 
    || error.message 
    || AUTH_ERROR_MESSAGES.UNKNOWN_ERROR;

  throw {
    message: errorMessage,
    code: errorCode,
    details: error
  };
};