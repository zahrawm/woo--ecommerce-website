
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
  api.post<{ token: string; user: User }>('/auth/login', data);

export const register = (data: RegisterData) => 
  api.post<{ token: string; user: User }>('/auth/register', data);

export const logout = () => api.post('/auth/logout');

export const forgotPassword = (email: string) => 
  api.post('/auth/forgot-password', { email });

export const resetPassword = (token: string, password: string) => 
  api.post('/auth/reset-password', { token, password });


export const getProfile = () => api.get<User>('/auth/profile');

export const updateProfile = (data: Partial<User>) => 
  api.put<User>('/auth/profile', data);

export const changePassword = (currentPassword: string, newPassword: string) => 
  api.post('/auth/change-password', { currentPassword, newPassword });


export const getAllUsers = () => api.get<{ users: User[] }>('/auth/users');

export const deleteUser = (id: number) => api.delete(`/auth/users/${id}`);

export const getUserById = (id: number) => api.get<{ user: User }>(`/auth/users/${id}`);