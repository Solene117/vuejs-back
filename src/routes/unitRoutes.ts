import express from 'express';
import { 
  getAllUnits, 
  getUnitById, 
  createUnit, 
  updateUnit, 
  deleteUnit 
} from '../controllers/UnitController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Get all units
router.get('/', getAllUnits);

// Get a single unit
router.get('/:id', getUnitById);

// Create a new unit - protected route
router.post('/', auth, createUnit);

// Update a unit - protected route
router.put('/:id', auth, updateUnit);

// Delete a unit - protected route
router.delete('/:id', auth, deleteUnit);

export default router; 