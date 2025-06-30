"use strict";
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
exports.findDuplicates = exports.findByCategories = exports.bulkUpdate = exports.getStats = exports.isInStock = exports.reduceStock = exports.findFeatured = exports.findSortedByPrice = exports.findLowStock = exports.findBySeller = exports.updateStock = exports.search = exports.findByCategory = exports.remove = exports.update = exports.create = exports.findById = exports.findAll = void 0;
let products = [];
let nextId = 1;
const findAll = () => __awaiter(void 0, void 0, void 0, function* () {
    return [...products];
});
exports.findAll = findAll;
const findById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return products.find(product => product.id === id);
});
exports.findById = findById;
const create = (product) => __awaiter(void 0, void 0, void 0, function* () {
    const newProduct = Object.assign({ id: nextId++ }, product);
    products.push(newProduct);
    return newProduct;
});
exports.create = create;
const update = (id, updatedProduct) => __awaiter(void 0, void 0, void 0, function* () {
    const index = products.findIndex(product => product.id === id);
    if (index === -1) {
        return null;
    }
    products[index] = updatedProduct;
    return updatedProduct;
});
exports.update = update;
const remove = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const initialLength = products.length;
    products = products.filter(product => product.id !== id);
    return products.length < initialLength;
});
exports.remove = remove;
const findByCategory = (category) => __awaiter(void 0, void 0, void 0, function* () {
    return products.filter(product => product.category.toLowerCase() === category.toLowerCase());
});
exports.findByCategory = findByCategory;
const search = (params) => __awaiter(void 0, void 0, void 0, function* () {
    let filteredProducts = [...products];
    if (params.query && params.query.trim()) {
        const query = params.query.toLowerCase().trim();
        filteredProducts = filteredProducts.filter(product => product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query));
    }
    if (params.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(product => product.price >= params.minPrice);
    }
    if (params.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(product => product.price <= params.maxPrice);
    }
    if (params.category && params.category.trim()) {
        filteredProducts = filteredProducts.filter(product => product.category.toLowerCase() === params.category.toLowerCase());
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
});
exports.search = search;
const updateStock = (id, stock) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield (0, exports.findById)(id);
    if (!product) {
        return null;
    }
    const updatedProduct = Object.assign(Object.assign({}, product), { stock, updatedAt: new Date() });
    return yield (0, exports.update)(id, updatedProduct);
});
exports.updateStock = updateStock;
const findBySeller = (sellerId) => __awaiter(void 0, void 0, void 0, function* () {
    return products.filter(product => product.sellerId === sellerId);
});
exports.findBySeller = findBySeller;
const findLowStock = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (threshold = 5) {
    return products.filter(product => product.stock <= threshold);
});
exports.findLowStock = findLowStock;
const findSortedByPrice = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (ascending = true) {
    return [...products].sort((a, b) => ascending ? a.price - b.price : b.price - a.price);
});
exports.findSortedByPrice = findSortedByPrice;
const findFeatured = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (limit = 10) {
    return products
        .filter(product => product.stock > 0)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, limit);
});
exports.findFeatured = findFeatured;
const reduceStock = (id, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield (0, exports.findById)(id);
    if (!product) {
        return null;
    }
    if (product.stock < quantity) {
        throw new Error('Insufficient stock');
    }
    const newStock = product.stock - quantity;
    return yield (0, exports.updateStock)(id, newStock);
});
exports.reduceStock = reduceStock;
const isInStock = (id_1, ...args_1) => __awaiter(void 0, [id_1, ...args_1], void 0, function* (id, quantity = 1) {
    const product = yield (0, exports.findById)(id);
    return product ? product.stock >= quantity : false;
});
exports.isInStock = isInStock;
const getStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
    const categoryCounts = products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
    }, {});
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
});
exports.getStats = getStats;
const bulkUpdate = (updates) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedProducts = [];
    for (const { id, data } of updates) {
        const existingProduct = yield (0, exports.findById)(id);
        if (existingProduct) {
            const updatedProduct = Object.assign(Object.assign(Object.assign({}, existingProduct), data), { id: existingProduct.id, sellerId: existingProduct.sellerId, createdAt: existingProduct.createdAt, updatedAt: new Date() });
            const result = yield (0, exports.update)(id, updatedProduct);
            if (result) {
                updatedProducts.push(result);
            }
        }
    }
    return updatedProducts;
});
exports.bulkUpdate = bulkUpdate;
const findByCategories = (categories) => __awaiter(void 0, void 0, void 0, function* () {
    const lowerCategories = categories.map(c => c.toLowerCase());
    return products.filter(product => lowerCategories.includes(product.category.toLowerCase()));
});
exports.findByCategories = findByCategories;
const findDuplicates = () => __awaiter(void 0, void 0, void 0, function* () {
    const duplicates = [];
    const seen = new Map();
    products.forEach(product => {
        const key = `${product.name.toLowerCase()}-${product.sellerId}`;
        if (!seen.has(key)) {
            seen.set(key, []);
        }
        seen.get(key).push(product);
    });
    seen.forEach(productGroup => {
        if (productGroup.length > 1) {
            duplicates.push(productGroup);
        }
    });
    return duplicates;
});
exports.findDuplicates = findDuplicates;
