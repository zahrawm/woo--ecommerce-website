"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkStock = exports.getFeaturedProducts = exports.getLowStockProducts = exports.getProductsBySeller = exports.updateStock = exports.searchProducts = exports.getProductsByCategory = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const ProductService = __importStar(require("../services/product_services"));
const AuthService = __importStar(require("../services/auth_services"));
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield ProductService.findAll();
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    }
    catch (error) {
        console.error('Error retrieving products:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve products'
        });
    }
});
exports.getAllProducts = getAllProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: 'Invalid product ID'
            });
            return;
        }
        const product = yield ProductService.findById(id);
        if (product) {
            res.status(200).json({
                success: true,
                data: product
            });
        }
        else {
            res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }
    }
    catch (error) {
        console.error('Error retrieving product:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve product'
        });
    }
});
exports.getProductById = getProductById;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const userId = req.userId;
        const user = yield AuthService.getUserById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
                error: 'User not found'
            });
            return;
        }
        const now = new Date();
        const newProduct = {
            name: name.trim(),
            description: (description === null || description === void 0 ? void 0 : description.trim()) || '',
            price: parseFloat(price),
            category: category.trim(),
            stock: stock || 0,
            imageUrl: (imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.trim()) || '',
            sellerId: userId,
            sellerName: user.username,
            createdAt: now,
            updatedAt: now
        };
        const product = yield ProductService.create(newProduct);
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    }
    catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create product'
        });
    }
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const existingProduct = yield ProductService.findById(id);
        if (!existingProduct) {
            res.status(404).json({
                success: false,
                error: 'Product not found'
            });
            return;
        }
        const userId = req.userId;
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
        const updatedProduct = {
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
        const product = yield ProductService.update(id, updatedProduct);
        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    }
    catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update product'
        });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: 'Invalid product ID'
            });
            return;
        }
        const existingProduct = yield ProductService.findById(id);
        if (!existingProduct) {
            res.status(404).json({
                success: false,
                error: 'Product not found'
            });
            return;
        }
        const userId = req.userId;
        if (existingProduct.sellerId !== userId) {
            res.status(403).json({
                success: false,
                error: 'Not authorized to delete this product'
            });
            return;
        }
        const deleted = yield ProductService.remove(id);
        if (deleted) {
            res.status(200).json({
                success: true,
                message: 'Product deleted successfully'
            });
        }
        else {
            res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }
    }
    catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete product'
        });
    }
});
exports.deleteProduct = deleteProduct;
const getProductsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category } = req.params;
        const products = yield ProductService.findByCategory(category);
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    }
    catch (error) {
        console.error('Error retrieving products by category:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve products by category'
        });
    }
});
exports.getProductsByCategory = getProductsByCategory;
const searchProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query, minPrice, maxPrice, category, sortBy, sortOrder } = req.query;
        const searchParams = {
            query: query,
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
            category: category,
            sortBy: sortBy,
            sortOrder: sortOrder
        };
        const products = yield ProductService.search(searchParams);
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    }
    catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to search products'
        });
    }
});
exports.searchProducts = searchProducts;
const updateStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const existingProduct = yield ProductService.findById(id);
        if (!existingProduct) {
            res.status(404).json({
                success: false,
                error: 'Product not found'
            });
            return;
        }
        const userId = req.userId;
        if (existingProduct.sellerId !== userId) {
            res.status(403).json({
                success: false,
                error: 'Not authorized to update this product'
            });
            return;
        }
        const updatedProduct = yield ProductService.updateStock(id, stock);
        res.status(200).json({
            success: true,
            message: 'Product stock updated successfully',
            data: updatedProduct
        });
    }
    catch (error) {
        console.error('Error updating product stock:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update product stock'
        });
    }
});
exports.updateStock = updateStock;
const getProductsBySeller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sellerId = parseInt(req.params.sellerId);
        if (isNaN(sellerId)) {
            res.status(400).json({
                success: false,
                error: 'Invalid seller ID'
            });
            return;
        }
        const products = yield ProductService.findBySeller(sellerId);
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    }
    catch (error) {
        console.error('Error retrieving products by seller:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve products by seller'
        });
    }
});
exports.getProductsBySeller = getProductsBySeller;
const getLowStockProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const threshold = req.query.threshold ? parseInt(req.query.threshold) : 5;
        const products = yield ProductService.findLowStock(threshold);
        res.status(200).json({
            success: true,
            count: products.length,
            threshold,
            data: products
        });
    }
    catch (error) {
        console.error('Error retrieving low stock products:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve low stock products'
        });
    }
});
exports.getLowStockProducts = getLowStockProducts;
const getFeaturedProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const products = yield ProductService.findFeatured(limit);
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    }
    catch (error) {
        console.error('Error retrieving featured products:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve featured products'
        });
    }
});
exports.getFeaturedProducts = getFeaturedProducts;
const checkStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        const quantity = req.query.quantity ? parseInt(req.query.quantity) : 1;
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: 'Invalid product ID'
            });
            return;
        }
        const inStock = yield ProductService.isInStock(id, quantity);
        const product = yield ProductService.findById(id);
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
    }
    catch (error) {
        console.error('Error checking stock:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to check stock'
        });
    }
});
exports.checkStock = checkStock;
