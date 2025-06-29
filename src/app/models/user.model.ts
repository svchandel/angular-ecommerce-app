export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
  avatar: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface EmailAvailabilityRequest {
  email: string;
}

export interface EmailAvailabilityResponse {
  isAvailable: boolean;
} 