"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationError = exports.sanitizeInput = exports.validatePagination = exports.validateCategory = exports.validateSellerId = exports.validateProductId = exports.validateSearchParams = exports.validateStockUpdate = exports.validateProduct = void 0;
const validateProduct = (req, res, next) => {
    const { name, price, category, stock, description, imageUrl } = req.body;
    const errors = [];
    if (!name) {
        errors.push('Product name is required');
    }
    else if (typeof name !== 'string') {
        errors.push('Product name must be a string');
    }
    else if (name.trim().length < 2) {
        errors.push('Product name must be at least 2 characters long');
    }
    else if (name.trim().length > 200) {
        errors.push('Product name must not exceed 200 characters');
    }
    if (price === undefined || price === null) {
        errors.push('Product price is required');
    }
    else if (typeof price !== 'number' && typeof price !== 'string') {
        errors.push('Product price must be a number');
    }
    else {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        if (isNaN(numPrice)) {
            errors.push('Product price must be a valid number');
        }
        else if (numPrice <= 0) {
            errors.push('Product price must be greater than 0');
        }
        else if (numPrice > 999999.99) {
            errors.push('Product price cannot exceed 999,999.99');
        }
    }
    if (!category) {
        errors.push('Product category is required');
    }
    else if (typeof category !== 'string') {
        errors.push('Product category must be a string');
    }
    else if (category.trim().length < 2) {
        errors.push('Product category must be at least 2 characters long');
    }
    else if (category.trim().length > 50) {
        errors.push('Product category must not exceed 50 characters');
    }
    if (stock !== undefined && stock !== null) {
        if (typeof stock !== 'number' && typeof stock !== 'string') {
            errors.push('Product stock must be a number');
        }
        else {
            const numStock = typeof stock === 'string' ? parseInt(stock, 10) : stock;
            if (isNaN(numStock)) {
                errors.push('Product stock must be a valid number');
            }
            else if (numStock < 0) {
                errors.push('Product stock cannot be negative');
            }
            else if (numStock > 999999) {
                errors.push('Product stock cannot exceed 999,999');
            }
        }
    }
    if (description !== undefined && description !== null) {
        if (typeof description !== 'string') {
            errors.push('Product description must be a string');
        }
        else if (description.trim().length > 1000) {
            errors.push('Product description must not exceed 1000 characters');
        }
    }
    if (imageUrl !== undefined && imageUrl !== null) {
        if (typeof imageUrl !== 'string') {
            errors.push('Product image URL must be a string');
        }
        else if (imageUrl.trim().length > 500) {
            errors.push('Product image URL must not exceed 500 characters');
        }
        else if (imageUrl.trim() && !isValidUrl(imageUrl.trim())) {
            errors.push('Product image URL must be a valid URL');
        }
    }
    if (errors.length > 0) {
        res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors
        });
        return;
    }
    next();
};
exports.validateProduct = validateProduct;
const validateStockUpdate = (req, res, next) => {
    const { stock } = req.body;
    const errors = [];
    if (stock === undefined || stock === null) {
        errors.push('Stock value is required');
    }
    else if (typeof stock !== 'number' && typeof stock !== 'string') {
        errors.push('Stock must be a number');
    }
    else {
        const numStock = typeof stock === 'string' ? parseInt(stock, 10) : stock;
        if (isNaN(numStock)) {
            errors.push('Stock must be a valid number');
        }
        else if (numStock < 0) {
            errors.push('Stock cannot be negative');
        }
        else if (numStock > 999999) {
            errors.push('Stock cannot exceed 999,999');
        }
    }
    if (errors.length > 0) {
        res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors
        });
        return;
    }
    next();
};
exports.validateStockUpdate = validateStockUpdate;
const validateSearchParams = (req, res, next) => {
    const { minPrice, maxPrice, sortBy, sortOrder } = req.query;
    const errors = [];
    if (minPrice !== undefined) {
        const numMinPrice = parseFloat(minPrice);
        if (isNaN(numMinPrice)) {
            errors.push('minPrice must be a valid number');
        }
        else if (numMinPrice < 0) {
            errors.push('minPrice cannot be negative');
        }
    }
    if (maxPrice !== undefined) {
        const numMaxPrice = parseFloat(maxPrice);
        if (isNaN(numMaxPrice)) {
            errors.push('maxPrice must be a valid number');
        }
        else if (numMaxPrice < 0) {
            errors.push('maxPrice cannot be negative');
        }
    }
    if (minPrice !== undefined && maxPrice !== undefined) {
        const numMinPrice = parseFloat(minPrice);
        const numMaxPrice = parseFloat(maxPrice);
        if (!isNaN(numMinPrice) && !isNaN(numMaxPrice) && numMinPrice > numMaxPrice) {
            errors.push('minPrice cannot be greater than maxPrice');
        }
    }
    if (sortBy !== undefined) {
        const validSortBy = ['price', 'name', 'createdAt'];
        if (!validSortBy.includes(sortBy)) {
            errors.push(`sortBy must be one of: ${validSortBy.join(', ')}`);
        }
    }
    if (sortOrder !== undefined) {
        const validSortOrder = ['asc', 'desc'];
        if (!validSortOrder.includes(sortOrder)) {
            errors.push(`sortOrder must be one of: ${validSortOrder.join(', ')}`);
        }
    }
    if (errors.length > 0) {
        res.status(400).json({
            success: false,
            error: 'Invalid search parameters',
            details: errors
        });
        return;
    }
    next();
};
exports.validateSearchParams = validateSearchParams;
const validateProductId = (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({
            success: false,
            error: 'Product ID is required'
        });
        return;
    }
    const numId = parseInt(id, 10);
    if (isNaN(numId) || numId <= 0) {
        res.status(400).json({
            success: false,
            error: 'Product ID must be a valid positive number'
        });
        return;
    }
    next();
};
exports.validateProductId = validateProductId;
const validateSellerId = (req, res, next) => {
    const { sellerId } = req.params;
    if (!sellerId) {
        res.status(400).json({
            success: false,
            error: 'Seller ID is required'
        });
        return;
    }
    const numSellerId = parseInt(sellerId, 10);
    if (isNaN(numSellerId) || numSellerId <= 0) {
        res.status(400).json({
            success: false,
            error: 'Seller ID must be a valid positive number'
        });
        return;
    }
    next();
};
exports.validateSellerId = validateSellerId;
const validateCategory = (req, res, next) => {
    const { category } = req.params;
    if (!category) {
        res.status(400).json({
            success: false,
            error: 'Category is required'
        });
        return;
    }
    if (typeof category !== 'string' || category.trim().length < 2) {
        res.status(400).json({
            success: false,
            error: 'Category must be at least 2 characters long'
        });
        return;
    }
    next();
};
exports.validateCategory = validateCategory;
const validatePagination = (req, res, next) => {
    const { page, limit } = req.query;
    const errors = [];
    if (page !== undefined) {
        const numPage = parseInt(page, 10);
        if (isNaN(numPage) || numPage < 1) {
            errors.push('Page must be a positive number starting from 1');
        }
        else if (numPage > 1000) {
            errors.push('Page number cannot exceed 1000');
        }
    }
    if (limit !== undefined) {
        const numLimit = parseInt(limit, 10);
        if (isNaN(numLimit) || numLimit < 1) {
            errors.push('Limit must be a positive number');
        }
        else if (numLimit > 100) {
            errors.push('Limit cannot exceed 100 items per page');
        }
    }
    if (errors.length > 0) {
        res.status(400).json({
            success: false,
            error: 'Invalid pagination parameters',
            details: errors
        });
        return;
    }
    next();
};
exports.validatePagination = validatePagination;
const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    }
    catch (_a) {
        return false;
    }
};
const sanitizeInput = (req, res, next) => {
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].trim();
                req.body[key] = req.body[key].replace(/[<>]/g, '');
            }
        });
    }
    if (req.query) {
        Object.keys(req.query).forEach(key => {
            if (typeof req.query[key] === 'string') {
                req.query[key] = req.query[key].trim();
            }
        });
    }
    next();
};
exports.sanitizeInput = sanitizeInput;
const handleValidationError = (error, req, res, next) => {
    if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map((err) => err.message);
        res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors
        });
        return;
    }
    next(error);
};
exports.handleValidationError = handleValidationError;
