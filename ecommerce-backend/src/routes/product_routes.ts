import { Router } from 'express';
import * as ProductController from '../controllers/product_controllers';
import { authenticateToken } from '../middleware/auth_middleware';
import { validateProduct, validateStockUpdate } from '../middleware/validation_middleware';

const router = Router();


router.get('/', ProductController.getAllProducts);


router.get('/search', ProductController.searchProducts);


router.get('/featured', ProductController.getFeaturedProducts);


router.get('/category/:category', ProductController.getProductsByCategory);


router.get('/seller/:sellerId', ProductController.getProductsBySeller);


router.get('/:id', ProductController.getProductById);


router.get('/:id/stock', ProductController.checkStock);


router.post('/', authenticateToken, validateProduct, ProductController.createProduct);

router.put('/:id', authenticateToken, ProductController.updateProduct);

router.delete('/:id', authenticateToken, ProductController.deleteProduct);

router.patch('/:id/stock', authenticateToken, validateStockUpdate, ProductController.updateStock);


router.get('/admin/low-stock', authenticateToken, ProductController.getLowStockProducts);

export default router;