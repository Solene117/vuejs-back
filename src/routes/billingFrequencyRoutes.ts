import express from 'express';
import { 
  getAllBillingFrequencies, 
  getBillingFrequencyById, 
  createBillingFrequency, 
  updateBillingFrequency, 
  deleteBillingFrequency 
} from '../controllers/BillingFrequencyController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Get all billing frequencies
router.get('/', getAllBillingFrequencies);

// Get a single billing frequency
router.get('/:id', getBillingFrequencyById);

// Create a new billing frequency - protected route
router.post('/', auth, createBillingFrequency);

// Update a billing frequency - protected route
router.put('/:id', auth, updateBillingFrequency);

// Delete a billing frequency - protected route
router.delete('/:id', auth, deleteBillingFrequency);

export default router; 