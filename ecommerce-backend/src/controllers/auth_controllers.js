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
exports.logout = exports.changePassword = exports.resetPassword = exports.forgotPassword = exports.updateProfile = exports.getProfile = exports.login = exports.register = void 0;
const AuthService = __importStar(require("../services/auth_services"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password, role = 'customer' } = req.body;
        if (!username || !email || !password) {
            res.status(400).json({ error: 'Username, email, and password are required' });
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ error: 'Invalid email format' });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({ error: 'Password must be at least 6 characters long' });
            return;
        }
        const validRoles = ['customer', 'seller', 'admin'];
        if (!validRoles.includes(role)) {
            res.status(400).json({ error: 'Invalid role. Must be customer, seller, or admin' });
            return;
        }
        const user = yield AuthService.register(username, email, password, role);
        if (user) {
            res.status(201).json({ message: 'User registered successfully', user });
        }
        else {
            res.status(409).json({ error: 'Username or email already exists' });
        }
    }
    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }
        const result = yield AuthService.login(email, password);
        if (result) {
            res.status(200).json({
                message: 'Login successful',
                token: result.token,
                user: result.user
            });
        }
        else {
            console.log('Invalid credentials for email');
            res.status(401).json({ error: 'Invalid credentials' });
        }
    }
    catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
});
exports.login = login;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const user = yield AuthService.getUserById(userId);
        if (user) {
            res.status(200).json({ user });
        }
        else {
            res.status(404).json({ error: 'User not found' });
        }
    }
    catch (error) {
        console.error('Error getting user profile:', error);
        res.status(500).json({ error: 'Failed to get user profile' });
    }
});
exports.getProfile = getProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { firstName, lastName, phone, address } = req.body;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const updatedUser = yield AuthService.updateUser(userId, {
            firstName,
            lastName,
            phone,
            address
        });
        if (updatedUser) {
            res.status(200).json({
                message: 'Profile updated successfully',
                user: updatedUser
            });
        }
        else {
            res.status(404).json({ error: 'User not found' });
        }
    }
    catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});
exports.updateProfile = updateProfile;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ error: 'Email is required' });
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ error: 'Invalid email format' });
            return;
        }
        const result = yield AuthService.generatePasswordResetToken(email);
        if (result) {
            res.status(200).json({
                message: 'Password reset token generated successfully',
                // In a real app, you'd send this via email instead of returning it
                token: result.token
            });
        }
        else {
            res.status(404).json({ error: 'Email not found' });
        }
    }
    catch (error) {
        console.error('Error in forgot password:', error);
        res.status(500).json({ error: 'Failed to process forgot password request' });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            res.status(400).json({ error: 'Token and new password are required' });
            return;
        }
        if (newPassword.length < 6) {
            res.status(400).json({ error: 'Password must be at least 6 characters long' });
            return;
        }
        const result = yield AuthService.resetPassword(token, newPassword);
        if (result) {
            res.status(200).json({ message: 'Password reset successfully' });
        }
        else {
            res.status(400).json({ error: 'Invalid or expired token' });
        }
    }
    catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Failed to reset password' });
    }
});
exports.resetPassword = resetPassword;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            res.status(400).json({ error: 'Current password and new password are required' });
            return;
        }
        if (newPassword.length < 6) {
            res.status(400).json({ error: 'New password must be at least 6 characters long' });
            return;
        }
        const result = yield AuthService.changePassword(userId, currentPassword, newPassword);
        if (result) {
            res.status(200).json({ message: 'Password changed successfully' });
        }
        else {
            res.status(400).json({ error: 'Current password is incorrect' });
        }
    }
    catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'Failed to change password' });
    }
});
exports.changePassword = changePassword;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (error) {
        console.error('Error logging out:', error);
        res.status(500).json({ error: 'Failed to logout' });
    }
});
exports.logout = logout;
