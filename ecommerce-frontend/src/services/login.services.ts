
import api from './api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  username: string; 
  email: string;
  password: string;
}


export const login = (data: LoginData) => 
  api.post<{ token: string; user: User }>('/api/auth/login', data);

export const register = (data: RegisterData) => 
  api.post<{ token: string; user: User }>('/api/auth/register', data);

export const logout = () => api.post('/api/auth/logout');

export const forgotPassword = (email: string) => 
  api.post('/api/auth/forgot-password', { email });

export const resetPassword = (token: string, password: string) => 
  api.post('/api/auth/reset-password', { token, password });


export const getProfile = () => api.get<User>('/api/auth/profile');

export const updateProfile = (data: Partial<User>) => 
  api.put<User>('/api/auth/profile', data);

export const changePassword = (currentPassword: string, newPassword: string) => 
  api.post('/api/auth/change-password', { currentPassword, newPassword });


export const getAllUsers = () => api.get<{ users: User[] }>('/api/auth/users');

export const deleteUser = (id: number) => api.delete(`/api/auth/users/${id}`);

export const getUserById = (id: number) => 
  api.get<{ user: User }>(`/api/auth/users/${id}`);