import { Product } from '../utilis/products';


let products: Product[] = [];
let nextId = 1;

export interface SearchParams {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  sortBy?: 'price' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}


export const findAll = async (): Promise<Product[]> => {
  return [...products];
};


export const findById = async (id: number): Promise<Product | undefined> => {
  return products.find(product => product.id === id);
};

export const create = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const newProduct: Product = {
    id: nextId++,
    ...product
  };
  
  products.push(newProduct);
  return newProduct;
};


export const update = async (id: number, updatedProduct: Product): Promise<Product | null> => {
  const index = products.findIndex(product => product.id === id);
  
  if (index === -1) {
    return null;
  }
  
  products[index] = updatedProduct;
  return updatedProduct;
};

export const remove = async (id: number): Promise<boolean> => {
  const initialLength = products.length;
  products = products.filter(product => product.id !== id);
  
  return products.length < initialLength;
};


export const findByCategory = async (category: string): Promise<Product[]> => {
  return products.filter(product => 
    product.category.toLowerCase() === category.toLowerCase()
  );
};


export const search = async (params: SearchParams): Promise<Product[]> => {
  let filteredProducts = [...products];

 
  if (params.query && params.query.trim()) {
    const query = params.query.toLowerCase().trim();
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  }

  
  if (params.minPrice !== undefined) {
    filteredProducts = filteredProducts.filter(product =>
      product.price >= params.minPrice!
    );
  }

  if (params.maxPrice !== undefined) {
    filteredProducts = filteredProducts.filter(product =>
      product.price <= params.maxPrice!
    );
  }

  
  if (params.category && params.category.trim()) {
    filteredProducts = filteredProducts.filter(product =>
      product.category.toLowerCase() === params.category!.toLowerCase()
    );
  }

  
  if (params.sortBy) {
    const sortOrder = params.sortOrder === 'desc' ? -1 : 1;
    
    filteredProducts.sort((a, b) => {
      let comparison = 0;
      
      switch (params.sortBy) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'createdAt':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        default:
          comparison = 0;
      }
      
      return comparison * sortOrder;
    });
  }

  return filteredProducts;
};


export const updateStock = async (id: number, stock: number): Promise<Product | null> => {
  const product = await findById(id);
  
  if (!product) {
    return null;
  }

  const updatedProduct: Product = {
    ...product,
    stock,
    updatedAt: new Date()
  };

  return await update(id, updatedProduct);
};


export const findBySeller = async (sellerId: number): Promise<Product[]> => {
  return products.filter(product => product.sellerId === sellerId);
};


export const findLowStock = async (threshold: number = 5): Promise<Product[]> => {
  return products.filter(product => product.stock <= threshold);
};

/**
 * Get products sorted by price
 * @param ascending Sort order (true for ascending, false for descending)
 */
export const findSortedByPrice = async (ascending: boolean = true): Promise<Product[]> => {
  return [...products].sort((a, b) => 
    ascending ? a.price - b.price : b.price - a.price
  );
};

/**
 * Get featured/popular products
 * Returns products with stock > 0 sorted by creation date
 * @param limit Maximum number of products to return
 */
export const findFeatured = async (limit: number = 10): Promise<Product[]> => {
  return products
    .filter(product => product.stock > 0)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
};

/**
 * Reduce stock when product is purchased
 * @param id Product ID
 * @param quantity Quantity purchased
 */
export const reduceStock = async (id: number, quantity: number): Promise<Product | null> => {
  const product = await findById(id);
  
  if (!product) {
    return null;
  }

  if (product.stock < quantity) {
    throw new Error('Insufficient stock');
  }

  const newStock = product.stock - quantity;
  return await updateStock(id, newStock);
};

/**
 * Check if product is in stock
 * @param id Product ID
 * @param quantity Required quantity (default: 1)
 */
export const isInStock = async (id: number, quantity: number = 1): Promise<boolean> => {
  const product = await findById(id);
  return product ? product.stock >= quantity : false;
};

/**
 * Get product statistics
 */
export const getStats = async () => {
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
  const categoryCounts = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const outOfStock = products.filter(product => product.stock === 0).length;
  const lowStock = products.filter(product => product.stock > 0 && product.stock <= 5).length;
  
  return {
    totalProducts,
    totalValue,
    categoryCounts,
    outOfStock,
    lowStock,
    avgPrice: totalProducts > 0 ? products.reduce((sum, p) => sum + p.price, 0) / totalProducts : 0
  };
};

/**
 * Bulk update products
 * @param updates Array of product updates
 */
export const bulkUpdate = async (updates: Array<{ id: number; data: Partial<Product> }>): Promise<Product[]> => {
  const updatedProducts: Product[] = [];
  
  for (const { id, data } of updates) {
    const existingProduct = await findById(id);
    if (existingProduct) {
      const updatedProduct: Product = {
        ...existingProduct,
        ...data,
        id: existingProduct.id, // Ensure ID doesn't change
        sellerId: existingProduct.sellerId, // Ensure sellerId doesn't change
        createdAt: existingProduct.createdAt, // Ensure createdAt doesn't change
        updatedAt: new Date()
      };
      
      const result = await update(id, updatedProduct);
      if (result) {
        updatedProducts.push(result);
      }
    }
  }
  
  return updatedProducts;
};

/**
 * Get products by multiple categories
 * @param categories Array of category names
 */
export const findByCategories = async (categories: string[]): Promise<Product[]> => {
  const lowerCategories = categories.map(c => c.toLowerCase());
  return products.filter(product => 
    lowerCategories.includes(product.category.toLowerCase())
  );
};

/**
 * Find duplicate products (by name and seller)
 */
export const findDuplicates = async (): Promise<Product[][]> => {
  const duplicates: Product[][] = [];
  const seen = new Map<string, Product[]>();
  
  products.forEach(product => {
    const key = `${product.name.toLowerCase()}-${product.sellerId}`;
    if (!seen.has(key)) {
      seen.set(key, []);
    }
    seen.get(key)!.push(product);
  });
  
  seen.forEach(productGroup => {
    if (productGroup.length > 1) {
      duplicates.push(productGroup);
    }
  });
  
  return duplicates;
};