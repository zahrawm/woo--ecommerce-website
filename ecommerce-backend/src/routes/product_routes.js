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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProductController = __importStar(require("../controllers/product_controllers"));
const auth_middleware_1 = require("../middleware/auth_middleware");
const validation_middleware_1 = require("../middleware/validation_middleware");
const router = (0, express_1.Router)();
router.get('/', ProductController.getAllProducts);
router.get('/search', ProductController.searchProducts);
router.get('/featured', ProductController.getFeaturedProducts);
router.get('/category/:category', ProductController.getProductsByCategory);
router.get('/seller/:sellerId', ProductController.getProductsBySeller);
router.get('/:id', ProductController.getProductById);
router.get('/:id/stock', ProductController.checkStock);
router.post('/', auth_middleware_1.authenticate, validation_middleware_1.validateProduct, ProductController.createProduct);
router.put('/:id', auth_middleware_1.authenticate, ProductController.updateProduct);
router.delete('/:id', auth_middleware_1.authenticate, ProductController.deleteProduct);
router.patch('/:id/stock', auth_middleware_1.authenticate, validation_middleware_1.validateStockUpdate, ProductController.updateStock);
router.get('/admin/low-stock', auth_middleware_1.authenticate, ProductController.getLowStockProducts);
exports.default = router;
