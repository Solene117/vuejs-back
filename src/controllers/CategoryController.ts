import { Request, Response } from 'express';
import Category from '../models/Category';

// Get all categories
export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single category
export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Create a category
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Update a category
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.status(200).json(updatedCategory);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a category
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}; 