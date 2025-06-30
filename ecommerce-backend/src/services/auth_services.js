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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getAllUsers = exports.verifyToken = exports.changePassword = exports.resetPassword = exports.generatePasswordResetToken = exports.updateUser = exports.getUserById = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = require("../lib/prisma");
let users = [];
let nextUserId = 1;
const resetTokens = new Map();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRY = '24h';
const register = (username_1, email_1, password_1, ...args_1) => __awaiter(void 0, [username_1, email_1, password_1, ...args_1], void 0, function* (username, email, password, role = 'customer') {
    // Check if user already exists in database
    const existingUser = yield prisma_1.prisma.user.findFirst({
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
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    const dbUser = yield prisma_1.prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
            role,
        }
    });
    console.log('New user created:', dbUser);
    const { password: _ } = dbUser, userWithoutPassword = __rest(dbUser, ["password"]);
    return Object.assign(Object.assign({}, userWithoutPassword), { updatedAt: dbUser.createdAt });
});
exports.register = register;
const login = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.prisma.user.findUnique({
        where: { email }
    });
    if (!user) {
        return null;
    }
    const isMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        return null;
    }
    const payload = {
        userId: user.id,
        username: user.username,
        email: user.email,
        role: user.role
    };
    const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
    const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
    return {
        token,
        user: Object.assign(Object.assign({}, userWithoutPassword), { updatedAt: user.createdAt })
    };
});
exports.login = login;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = users.find((u) => u.id === id);
    if (!user) {
        return null;
    }
    const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
    return userWithoutPassword;
});
exports.getUserById = getUserById;
const updateUser = (id, updates) => __awaiter(void 0, void 0, void 0, function* () {
    const userIndex = users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
        return null;
    }
    users[userIndex] = Object.assign(Object.assign(Object.assign({}, users[userIndex]), updates), { updatedAt: new Date() });
    const _a = users[userIndex], { password: _ } = _a, userWithoutPassword = __rest(_a, ["password"]);
    return userWithoutPassword;
});
exports.updateUser = updateUser;
const generatePasswordResetToken = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = users.find((u) => u.email === email);
    if (!user) {
        return null;
    }
    const token = crypto_1.default.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour from now
    resetTokens.set(token, { userId: user.id, expires });
    return { token };
});
exports.generatePasswordResetToken = generatePasswordResetToken;
const resetPassword = (token, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
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
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, salt);
    users[userIndex].password = hashedPassword;
    users[userIndex].updatedAt = new Date();
    resetTokens.delete(token);
    return true;
});
exports.resetPassword = resetPassword;
const changePassword = (userId, currentPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = users.find((u) => u.id === userId);
    if (!user) {
        return false;
    }
    const isMatch = yield bcrypt_1.default.compare(currentPassword, user.password);
    if (!isMatch) {
        return false;
    }
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, salt);
    const userIndex = users.findIndex((u) => u.id === userId);
    users[userIndex].password = hashedPassword;
    users[userIndex].updatedAt = new Date();
    return true;
});
exports.changePassword = changePassword;
const verifyToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        return decoded;
    }
    catch (error) {
        return null;
    }
};
exports.verifyToken = verifyToken;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return users.map(user => {
        const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
        return userWithoutPassword;
    });
});
exports.getAllUsers = getAllUsers;
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const userIndex = users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
        return false;
    }
    users.splice(userIndex, 1);
    return true;
});
exports.deleteUser = deleteUser;
