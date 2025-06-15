import { Router } from 'express';
import * as AuthController from '../controllers/auth_controllers';
import { 
  authenticate, 
  rateLimitSensitive, 
  isOwner,
  requireAdmin 
} from '../middleware/auth_middleware';

const router = Router();


router.post('/register', AuthController.register);
router.post('/login',  AuthController.login);
router.post('/forgot-password',  AuthController.forgotPassword);
router.post('/reset-password',  AuthController.resetPassword);


router.get('/profile', authenticate, AuthController.getProfile);
router.put('/profile', authenticate, AuthController.updateProfile);
router.post('/change-password', authenticate, AuthController.changePassword);
router.post('/logout', authenticate, AuthController.logout);

router.get('/users', authenticate, requireAdmin, async (req, res) => {
  try {
    const users = await require('../services/auth_services').getAllUsers();
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.delete('/users/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }
    
    const deleted = await require('../services/auth_services').deleteUser(userId);
    
    if (deleted) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});


router.get('/users/:id', authenticate, isOwner, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }
    
    const user = await require('../services/auth_services').getUserById(userId);
    
    if (user) {
      res.status(200).json({ user });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;