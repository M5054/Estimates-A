export interface User {
  id: string;
  email: string;
  name: string;
  businessName?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}