import { Request, Response } from 'express';
import * as ProductService from '../services/product_services';
import * as AuthService from '../services/auth_services';
import { Product } from '../utilis/products';

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await ProductService.findAll();
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error retrieving products:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to retrieve products' 
    });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ 
        success: false,
        error: 'Invalid product ID' 
      });
      return;
    }
    
    const product = await ProductService.findById(id);
    
    if (product) {
      res.status(200).json({
        success: true,
        data: product
      });
    } else {
      res.status(404).json({ 
        success: false,
        error: 'Product not found' 
      });
    }
  } catch (error) {
    console.error('Error retrieving product:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to retrieve product' 
    });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, category, stock, imageUrl } = req.body;
    
    
    if (!name || !price || !category) {
      res.status(400).json({ 
        success: false,
        error: 'Name, price, and category are required' 
      });
      return;
    }

    if (price <= 0) {
      res.status(400).json({ 
        success: false,
        error: 'Price must be greater than 0' 
      });
      return;
    }

    if (stock !== undefined && stock < 0) {
      res.status(400).json({ 
        success: false,
        error: 'Stock cannot be negative' 
      });
      return;
    }
   
    const userId = (req as any).userId;
    const user = await AuthService.getUserById(userId);
    
    if (!user) {
      res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
      return;
    }
    
    const now = new Date();
    const newProduct: Omit<Product, 'id'> = {
      name: name.trim(),
      description: description?.trim() || '',
      price: parseFloat(price),
      category: category.trim(),
      stock: stock || 0,
      imageUrl: imageUrl?.trim() || '',
      sellerId: userId,
      sellerName: user.username,
      createdAt: now,
      updatedAt: now
    };
    
    const product = await ProductService.create(newProduct);
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create product' 
    });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ 
        success: false,
        error: 'Invalid product ID' 
      });
      return;
    }
    
    const { name, description, price, category, stock, imageUrl } = req.body;
    
    const existingProduct = await ProductService.findById(id);
    
    if (!existingProduct) {
      res.status(404).json({ 
        success: false,
        error: 'Product not found' 
      });
      return;
    }

    
    const userId = (req as any).userId;
    if (existingProduct.sellerId !== userId) {
      res.status(403).json({ 
        success: false,
        error: 'Not authorized to update this product' 
      });
      return;
    }

    
    if (price !== undefined && price <= 0) {
      res.status(400).json({ 
        success: false,
        error: 'Price must be greater than 0' 
      });
      return;
    }

    if (stock !== undefined && stock < 0) {
      res.status(400).json({ 
        success: false,
        error: 'Stock cannot be negative' 
      });
      return;
    }
    
    const updatedProduct: Product = {
      id,
      name: name !== undefined ? name.trim() : existingProduct.name,
      description: description !== undefined ? description.trim() : existingProduct.description,
      price: price !== undefined ? parseFloat(price) : existingProduct.price,
      category: category !== undefined ? category.trim() : existingProduct.category,
      stock: stock !== undefined ? stock : existingProduct.stock,
      imageUrl: imageUrl !== undefined ? imageUrl.trim() : existingProduct.imageUrl,
      sellerId: existingProduct.sellerId,
      sellerName: existingProduct.sellerName,
      createdAt: existingProduct.createdAt,
      updatedAt: new Date()
    };
    
    const product = await ProductService.update(id, updatedProduct);
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update product' 
    });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      res.status(400).json({ 
        success: false,
        error: 'Invalid product ID' 
      });
      return;
    }
    
    const existingProduct = await ProductService.findById(id);
    
    if (!existingProduct) {
      res.status(404).json({ 
        success: false,
        error: 'Product not found' 
      });
      return;
    }

    
    const userId = (req as any).userId;
    if (existingProduct.sellerId !== userId) {
      res.status(403).json({ 
        success: false,
        error: 'Not authorized to delete this product' 
      });
      return;
    }
   
    const deleted = await ProductService.remove(id);
    
    if (deleted) {
      res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
      });
    } else {
      res.status(404).json({ 
        success: false,
        error: 'Product not found' 
      });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete product' 
    });
  }
};

export const getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.params;
    const products = await ProductService.findByCategory(category);
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error retrieving products by category:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to retrieve products by category' 
    });
  }
};

export const searchProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, minPrice, maxPrice, category, sortBy, sortOrder } = req.query;
    const searchParams = {
      query: query as string,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      category: category as string,
      sortBy: sortBy as 'price' | 'name' | 'createdAt' | undefined,
      sortOrder: sortOrder as 'asc' | 'desc' | undefined
    };
    
    const products = await ProductService.search(searchParams);
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to search products' 
    });
  }
};

export const updateStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const { stock } = req.body;
    
    if (isNaN(id)) {
      res.status(400).json({ 
        success: false,
        error: 'Invalid product ID' 
      });
      return;
    }

    if (stock === undefined || stock < 0) {
      res.status(400).json({ 
        success: false,
        error: 'Stock cannot be negative and is required' 
      });
      return;
    }

    const existingProduct = await ProductService.findById(id);
    
    if (!existingProduct) {
      res.status(404).json({ 
        success: false,
        error: 'Product not found' 
      });
      return;
    }

   
    const userId = (req as any).userId;
    if (existingProduct.sellerId !== userId) {
      res.status(403).json({ 
        success: false,
        error: 'Not authorized to update this product' 
      });
      return;
    }

    const updatedProduct = await ProductService.updateStock(id, stock);
    res.status(200).json({
      success: true,
      message: 'Product stock updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product stock:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update product stock' 
    });
  }
};

export const getProductsBySeller = async (req: Request, res: Response): Promise<void> => {
  try {
    const sellerId = parseInt(req.params.sellerId);
    
    if (isNaN(sellerId)) {
      res.status(400).json({ 
        success: false,
        error: 'Invalid seller ID' 
      });
      return;
    }

    const products = await ProductService.findBySeller(sellerId);
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error retrieving products by seller:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to retrieve products by seller' 
    });
  }
};

export const getLowStockProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const threshold = req.query.threshold ? parseInt(req.query.threshold as string) : 5;
    const products = await ProductService.findLowStock(threshold);
    
    res.status(200).json({
      success: true,
      count: products.length,
      threshold,
      data: products
    });
  } catch (error) {
    console.error('Error retrieving low stock products:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to retrieve low stock products' 
    });
  }
};

export const getFeaturedProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const products = await ProductService.findFeatured(limit);
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error retrieving featured products:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to retrieve featured products' 
    });
  }
};

export const checkStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const quantity = req.query.quantity ? parseInt(req.query.quantity as string) : 1;
    
    if (isNaN(id)) {
      res.status(400).json({ 
        success: false,
        error: 'Invalid product ID' 
      });
      return;
    }

    const inStock = await ProductService.isInStock(id, quantity);
    const product = await ProductService.findById(id);
    
    if (!product) {
      res.status(404).json({ 
        success: false,
        error: 'Product not found' 
      });
      return;
    }

    res.status(200).json({
      success: true,
      inStock,
      availableStock: product.stock,
      requestedQuantity: quantity
    });
  } catch (error) {
    console.error('Error checking stock:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to check stock' 
    });
  }
};