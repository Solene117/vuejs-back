import { Request, Response } from 'express';
import Currency from '../models/Currency';

// Get all currencies
export const getAllCurrencies = async (req: Request, res: Response): Promise<void> => {
  try {
    const currencies = await Currency.find();
    res.status(200).json(currencies);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single currency
export const getCurrencyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const currency = await Currency.findById(req.params.id);
    if (!currency) {
      res.status(404).json({ message: 'Currency not found' });
      return;
    }
    res.status(200).json(currency);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Create a currency
export const createCurrency = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body;
  
  try {
    const currency = await Currency.create({
      name
    });
    res.status(201).json(currency);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Update a currency
export const updateCurrency = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedCurrency = await Currency.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedCurrency) {
      res.status(404).json({ message: 'Currency not found' });
      return;
    }
    
    res.status(200).json(updatedCurrency);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a currency
export const deleteCurrency = async (req: Request, res: Response): Promise<void> => {
  try {
    const currency = await Currency.findByIdAndDelete(req.params.id);
    
    if (!currency) {
      res.status(404).json({ message: 'Currency not found' });
      return;
    }
    
    res.status(200).json({ message: 'Currency deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}; 