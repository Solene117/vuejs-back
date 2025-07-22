import { Request, Response } from 'express';
import BillingFrequency from '../models/BillingFrequency';

// Get all billing frequencies
export const getAllBillingFrequencies = async (req: Request, res: Response): Promise<void> => {
  try {
    const billingFrequencies = await BillingFrequency.find();
    res.status(200).json(billingFrequencies);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single billing frequency
export const getBillingFrequencyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const billingFrequency = await BillingFrequency.findById(req.params.id);
    if (!billingFrequency) {
      res.status(404).json({ message: 'Billing frequency not found' });
      return;
    }
    res.status(200).json(billingFrequency);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Create a billing frequency
export const createBillingFrequency = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body;
  
  try {
    const billingFrequency = await BillingFrequency.create({
      name
    });
    res.status(201).json(billingFrequency);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Update a billing frequency
export const updateBillingFrequency = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedBillingFrequency = await BillingFrequency.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedBillingFrequency) {
      res.status(404).json({ message: 'Billing frequency not found' });
      return;
    }
    
    res.status(200).json(updatedBillingFrequency);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a billing frequency
export const deleteBillingFrequency = async (req: Request, res: Response): Promise<void> => {
  try {
    const billingFrequency = await BillingFrequency.findByIdAndDelete(req.params.id);
    
    if (!billingFrequency) {
      res.status(404).json({ message: 'Billing frequency not found' });
      return;
    }
    
    res.status(200).json({ message: 'Billing frequency deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}; 