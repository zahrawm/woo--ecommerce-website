import { Router } from 'express';
import * as ProductController from '../controllers/product_controllers';
import { authenticate } from '../middleware/auth_middleware';
import { validateProduct, validateStockUpdate } from '../middleware/validation_middleware';

const router = Router();


router.get('/', ProductController.getAllProducts);
router.get('/search', ProductController.searchProducts);
router.get('/featured', ProductController.getFeaturedProducts);
router.get('/category/:category', ProductController.getProductsByCategory);
router.get('/seller/:sellerId', ProductController.getProductsBySeller);
router.get('/:id', ProductController.getProductById);
router.get('/:id/stock', ProductController.checkStock);

router.post('/', authenticate, validateProduct, ProductController.createProduct);
router.put('/:id', authenticate, ProductController.updateProduct);
router.delete('/:id', authenticate, ProductController.deleteProduct);
router.patch('/:id/stock', authenticate, validateStockUpdate, ProductController.updateStock);


router.get('/admin/low-stock', authenticate, ProductController.getLowStockProducts);

export default router;