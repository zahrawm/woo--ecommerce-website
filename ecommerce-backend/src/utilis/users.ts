export interface User {
  id: number;
  username: string;
  email: string;
  password: string; 
  role: 'customer' | 'seller' | 'admin';
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}