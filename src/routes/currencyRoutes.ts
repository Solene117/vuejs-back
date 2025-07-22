import express from 'express';
import { 
  getAllCurrencies, 
  getCurrencyById, 
  createCurrency, 
  updateCurrency, 
  deleteCurrency 
} from '../controllers/CurrencyController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Get all currencies
router.get('/', getAllCurrencies);

// Get a single currency
router.get('/:id', getCurrencyById);

// Create a new currency - protected route
router.post('/', auth, createCurrency);

// Update a currency - protected route
router.put('/:id', auth, updateCurrency);

// Delete a currency - protected route
router.delete('/:id', auth, deleteCurrency);

export default router; 