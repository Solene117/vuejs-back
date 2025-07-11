import express from 'express';
import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../controllers/CategoryController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Get all categories
router.get('/', getAllCategories);

// Get a single category
router.get('/:id', getCategoryById);

// Create a new category - protected route
router.post('/', auth, createCategory);

// Update a category - protected route
router.put('/:id', auth, updateCategory);

// Delete a category - protected route
router.delete('/:id', auth, deleteCategory);

export default router; 