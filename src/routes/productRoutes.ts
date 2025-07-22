import express from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, updateStock } from '../controllers/ProductController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Get all products
router.get('/', getAllProducts);

// Get a single product
router.get('/:id', getProductById);

// Create a new product - protected route
router.post('/', auth, createProduct);

// Update a product - protected route
router.put('/:id', auth, updateProduct);

// Delete a product - protected route
router.delete('/:id', auth, deleteProduct);

// Update product stock - protected route
router.patch('/:id/stock', auth, updateStock);

export default router; 