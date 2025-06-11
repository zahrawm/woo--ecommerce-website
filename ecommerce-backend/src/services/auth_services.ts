import { User } from '../utilis/users';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { prisma } from '../lib/prisma';

let users: User[] = [];
let nextUserId = 1;



const resetTokens = new Map<string, { userId: number; expires: Date }>();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRY = '24h';


export const register = async (
  username: string,
  email: string,
  password: string,
  role: 'customer' | 'seller' | 'admin' = 'customer'
): Promise<Omit<User, 'password'> | null> => {
  // Check if user already exists in database
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { username },
        { email }
      ]
    }
  });
  
  if (existingUser) {
    return null;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
 
  const dbUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      role,
    }
  });
  
  console.log('New user created:', dbUser);
  
  const { password: _, ...userWithoutPassword } = dbUser;
  return { ...userWithoutPassword, updatedAt: dbUser.createdAt };
};

export const login = async (
  email: string,
  password: string
): Promise<{ token: string; user: Omit<User, 'password'> } | null> => {
  const user = await prisma.user.findUnique({
    where: { email }
  });
  
  if (!user) {
    return null;
  }
  
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return null;
  }

  const payload = {
    userId: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  };
  
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
  
  const { password: _, ...userWithoutPassword } = user;
  
  return {
    token,
    user: { ...userWithoutPassword, updatedAt: user.createdAt }
  };
};


export const getUserById = async (id: number): Promise<Omit<User, 'password'> | null> => {
  const user = users.find((u) => u.id === id);
  
  if (!user) {
    return null;
  }
  
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const updateUser = async (
  id: number,
  updates: Partial<Pick<User, 'firstName' | 'lastName' | 'phone' | 'address'>>
): Promise<Omit<User, 'password'> | null> => {
  const userIndex = users.findIndex((u) => u.id === id);
  
  if (userIndex === -1) {
    return null;
  }
  
  users[userIndex] = {
    ...users[userIndex],
    ...updates,
    updatedAt: new Date()
  };
  
  const { password: _, ...userWithoutPassword } = users[userIndex];
  return userWithoutPassword;
};


export const generatePasswordResetToken = async (
  email: string
): Promise<{ token: string } | null> => {
  const user = users.find((u) => u.email === email);
  if (!user) {
    return null;
  }
  
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 3600000); // 1 hour from now
  
  resetTokens.set(token, { userId: user.id, expires });
  
  return { token };
};


export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<boolean> => {
  const tokenData = resetTokens.get(token);
  
  if (!tokenData || tokenData.expires < new Date()) {
    resetTokens.delete(token);
    return false;
  }
  
  const userIndex = users.findIndex((u) => u.id === tokenData.userId);
  if (userIndex === -1) {
    resetTokens.delete(token);
    return false;
  }
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  
  users[userIndex].password = hashedPassword;
  users[userIndex].updatedAt = new Date();
  
  resetTokens.delete(token);
  return true;
};


export const changePassword = async (
  userId: number,
  currentPassword: string,
  newPassword: string
): Promise<boolean> => {
  const user = users.find((u) => u.id === userId);
  if (!user) {
    return false;
  }
  
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return false;
  }
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  
  const userIndex = users.findIndex((u) => u.id === userId);
  users[userIndex].password = hashedPassword;
  users[userIndex].updatedAt = new Date();
  
  return true;
};


export const verifyToken = (token: string): { userId: number; role: string } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    return decoded;
  } catch (error) {
    return null;
  }
};


export const getAllUsers = async (): Promise<Omit<User, 'password'>[]> => {
  return users.map(user => {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
};


export const deleteUser = async (id: number): Promise<boolean> => {
  const userIndex = users.findIndex((u) => u.id === id);
  
  if (userIndex === -1) {
    return false;
  }
  
  users.splice(userIndex, 1);
  return true;
};