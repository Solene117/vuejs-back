import { Request, Response } from 'express';
import Unit from '../models/Unit';

// Get all units
export const getAllUnits = async (req: Request, res: Response): Promise<void> => {
  try {
    const units = await Unit.find();
    res.status(200).json(units);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single unit
export const getUnitById = async (req: Request, res: Response): Promise<void> => {
  try {
    const unit = await Unit.findById(req.params.id);
    if (!unit) {
      res.status(404).json({ message: 'Unit not found' });
      return;
    }
    res.status(200).json(unit);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Create a unit
export const createUnit = async (req: Request, res: Response): Promise<void> => {
  const { code, name, symbol } = req.body;
  
  try {
    const unit = await Unit.create({
      name
    });
    res.status(201).json(unit);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Update a unit
export const updateUnit = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedUnit = await Unit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedUnit) {
      res.status(404).json({ message: 'Unit not found' });
      return;
    }
    
    res.status(200).json(updatedUnit);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a unit
export const deleteUnit = async (req: Request, res: Response): Promise<void> => {
  try {
    const unit = await Unit.findByIdAndDelete(req.params.id);
    
    if (!unit) {
      res.status(404).json({ message: 'Unit not found' });
      return;
    }
    
    res.status(200).json({ message: 'Unit deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}; 