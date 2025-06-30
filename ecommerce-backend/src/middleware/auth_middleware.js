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
exports.optionalAuth = exports.isOwner = exports.rateLimitSensitive = exports.validateStock = exports.canPurchase = exports.requireSeller = exports.requireAdmin = exports.requireRole = exports.isProductSeller = exports.authenticate = void 0;
const AuthService = __importStar(require("../services/auth_services"));
const ProductService = __importStar(require("../services/product_services"));
const authenticate = (req, res, next) => {
    var _a;
    const authHeader = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
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
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
};
exports.authenticate = authenticate;
const isProductSeller = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = parseInt(req.params.id);
        const userId = req.userId;
        if (isNaN(productId)) {
            res.status(400).json({ error: 'Invalid product ID' });
            return;
        }
        const product = yield ProductService.findById(productId);
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        const user = yield AuthService.getUserById(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        if (product.sellerId !== userId) {
            res.status(403).json({ error: 'You are not authorized to modify this product' });
            return;
        }
        next();
    }
    catch (error) {
        console.error('Error in isProductSeller middleware:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.isProductSeller = isProductSeller;
const requireRole = (roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.userId;
            const userRole = req.userRole;
            if (!userRole || !roles.includes(userRole)) {
                res.status(403).json({ error: 'Insufficient permissions' });
                return;
            }
            next();
        }
        catch (error) {
            console.error('Error in requireRole middleware:', error);
            res.status(500).json({ error: 'Server error' });
        }
    });
};
exports.requireRole = requireRole;
exports.requireAdmin = (0, exports.requireRole)(['admin']);
exports.requireSeller = (0, exports.requireRole)(['seller', 'admin']);
exports.canPurchase = (0, exports.requireRole)(['customer', 'seller', 'admin']);
const validateStock = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const isAvailable = yield ProductService.isInStock(productId, quantity);
        if (!isAvailable) {
            res.status(400).json({ error: 'Insufficient stock' });
            return;
        }
        next();
    }
    catch (error) {
        console.error('Error in validateStock middleware:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.validateStock = validateStock;
const rateLimitSensitive = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
    const attempts = new Map();
    return (req, res, next) => {
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
exports.rateLimitSensitive = rateLimitSensitive;
const isOwner = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const targetUserId = parseInt(req.params.userId || req.params.id);
        const currentUserId = req.userId;
        const userRole = req.userRole;
        if (isNaN(targetUserId)) {
            res.status(400).json({ error: 'Invalid user ID' });
            return;
        }
        if (targetUserId !== currentUserId && userRole !== 'admin') {
            res.status(403).json({ error: 'You can only access your own data' });
            return;
        }
        next();
    }
    catch (error) {
        console.error('Error in isOwner middleware:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.isOwner = isOwner;
const optionalAuth = (req, res, next) => {
    var _a;
    const authHeader = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        next();
        return;
    }
    const token = authHeader.split(' ')[1];
    const decoded = AuthService.verifyToken(token);
    if (decoded) {
        req.userId = decoded.userId;
        req.userRole = decoded.role;
    }
    next();
};
exports.optionalAuth = optionalAuth;
