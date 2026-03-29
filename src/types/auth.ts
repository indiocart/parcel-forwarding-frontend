export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  isVerified: boolean;
  isAdmin: boolean;
}