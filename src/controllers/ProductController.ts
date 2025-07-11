import { Request, Response } from 'express';
import Product from '../models/Product';
import Category from '../models/Category';

// Get all products
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single product
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Create a product
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  const { ref, name, category, unit, billingFrequency, unitPrice, currency } = req.body;
  
  try {
    // Vérifier si la catégorie existe
    let categoryExists = await Category.findOne({ name: category });
    
    // Si la catégorie n'existe pas, la créer
    if (!categoryExists) {
      categoryExists = await Category.create({
        name: category,
        description: ''
      });
    }
    
    const product = await Product.create({
      ref,
      name,
      category,
      unit,
      billingFrequency,
      unitPrice,
      currency
    });
    res.status(201).json(product);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Update a product
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    // Si la catégorie est mise à jour, vérifier qu'elle existe
    if (req.body.category) {
      let categoryExists = await Category.findOne({ name: req.body.category });
      
      // Si la catégorie n'existe pas, la créer
      if (!categoryExists) {
        await Category.create({
          name: req.body.category,
          description: ''
        });
      }
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json(updatedProduct);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a product
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}; 