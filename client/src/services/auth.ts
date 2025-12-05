import axios from 'axios';
import type { ApiResponse } from '@shared/types/index.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await axios.post<ApiResponse<AuthResponse>>(
    `${API_URL}/api/auth/register`,
    data,
    { withCredentials: true }
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Registration failed');
  }

  return response.data.data;
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await axios.post<ApiResponse<AuthResponse>>(
    `${API_URL}/api/auth/login`,
    data,
    { withCredentials: true }
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Login failed');
  }

  return response.data.data;
};

export const logout = async (): Promise<void> => {
  const response = await axios.post<ApiResponse<{ message: string }>>(
    `${API_URL}/api/auth/logout`,
    {},
    { withCredentials: true }
  );

  if (!response.data.success) {
    throw new Error(response.data.error || 'Logout failed');
  }
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await axios.get<ApiResponse<User>>(
    `${API_URL}/api/auth/me`,
    { withCredentials: true }
  );

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to get user');
  }

  return response.data.data;
};
