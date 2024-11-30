import { z } from 'zod';

export const emailSchema = z
  .string()
  .email('Invalid email address')
  .min(1, 'Email is required');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  );

export const phoneSchema = z
  .string()
  .regex(
    /^\+?[1-9]\d{1,14}$/,
    'Invalid phone number format. Please use international format (e.g., +1234567890)'
  );

export const validateEmail = (email: string): string | null => {
  try {
    emailSchema.parse(email);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0].message;
    }
    return 'Invalid email';
  }
};

export const validatePassword = (password: string): string | null => {
  try {
    passwordSchema.parse(password);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0].message;
    }
    return 'Invalid password';
  }
};

export const validatePhone = (phone: string): string | null => {
  try {
    phoneSchema.parse(phone);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0].message;
    }
    return 'Invalid phone number';
  }
};