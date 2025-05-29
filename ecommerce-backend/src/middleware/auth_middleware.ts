import { Request, Response, NextFunction } from 'express';
import * as AuthService from '../services/auth_services';
import * as ProductService from '../services/product_services';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req?.headers?.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }
  
  const token = authHeader.split(' ')[1];
  
  const decoded = AuthService.verifyToken(token);
  if (!decoded) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }
  
  (req as any).userId = decoded.userId;
  (req as any).userRole = decoded.role;
  
  next();
};

export const isProductSeller = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const productId = parseInt(req.params.id);
    const userId = (req as any).userId;
    
    if (isNaN(productId)) {
      res.status(400).json({ error: 'Invalid product ID' });
      return;
    }
    
    const product = await ProductService.findById(productId);
    
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    
    const user = await AuthService.getUserById(userId);
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (product.sellerId !== userId) {
      res.status(403).json({ error: 'You are not authorized to modify this product' });
      return;
    }
    
    next();
  } catch (error) {
    console.error('Error in isProductSeller middleware:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const requireRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).userId;
      const userRole = (req as any).userRole;
      
      if (!userRole || !roles.includes(userRole)) {
        res.status(403).json({ error: 'Insufficient permissions' });
        return;
      }
      
      next();
    } catch (error) {
      console.error('Error in requireRole middleware:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
};

export const requireAdmin = requireRole(['admin']);
export const requireSeller = requireRole(['seller', 'admin']);
export const canPurchase = requireRole(['customer', 'seller', 'admin']);

export const validateStock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId, quantity } = req.body;
    
    if (!productId || !quantity) {
      res.status(400).json({ error: 'Product ID and quantity are required' });
      return;
    }
    
    if (quantity <= 0) {
      res.status(400).json({ error: 'Quantity must be greater than 0' });
      return;
    }
    
    const isAvailable = await ProductService.isInStock(productId, quantity);
    
    if (!isAvailable) {
      res.status(400).json({ error: 'Insufficient stock' });
      return;
    }
    
    next();
  } catch (error) {
    console.error('Error in validateStock middleware:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const rateLimitSensitive = (maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) => {
  const attempts = new Map<string, { count: number; resetTime: number }>();
  
  return (req: Request, res: Response, next: NextFunction): void => {
    const identifier = req.ip || 'unknown';
    const now = Date.now();
    
    const userAttempts = attempts.get(identifier);
    
    if (!userAttempts || now > userAttempts.resetTime) {
      attempts.set(identifier, { count: 1, resetTime: now + windowMs });
      next();
      return;
    }
    
    if (userAttempts.count >= maxAttempts) {
      res.status(429).json({ 
        error: 'Too many attempts. Please try again later.',
        retryAfter: Math.ceil((userAttempts.resetTime - now) / 1000)
      });
      return;
    }
    
    userAttempts.count++;
    next();
  };
};

export const isOwner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const targetUserId = parseInt(req.params.userId || req.params.id);
    const currentUserId = (req as any).userId;
    const userRole = (req as any).userRole;
    
    if (isNaN(targetUserId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }
    
    if (targetUserId !== currentUserId && userRole !== 'admin') {
      res.status(403).json({ error: 'You can only access your own data' });
      return;
    }
    
    next();
  } catch (error) {
    console.error('Error in isOwner middleware:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req?.headers?.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next();
    return;
  }
  
  const token = authHeader.split(' ')[1];
  const decoded = AuthService.verifyToken(token);
  
  if (decoded) {
    (req as any).userId = decoded.userId;
    (req as any).userRole = decoded.role;
  }
  
  next();
};