import { apiRequest } from "./queryClient";

export interface User {
  id: number;
  email: string;
  name: string;
  department: string;
  badgeNumber: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('auth_token');
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await apiRequest('POST', '/api/auth/login', { email, password });
  const data = await response.json();
  setAuthToken(data.token);
  return data;
};

export const signup = async (signupData: {
  email: string;
  password: string;
  name: string;
  department: string;
  badgeNumber: string;
  signupToken: string;
}): Promise<AuthResponse> => {
  const response = await apiRequest('POST', '/api/auth/signup', signupData);
  const data = await response.json();
  setAuthToken(data.token);
  return data;
};

export const logout = (): void => {
  removeAuthToken();
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiRequest('GET', '/api/auth/me');
  return response.json();
};
