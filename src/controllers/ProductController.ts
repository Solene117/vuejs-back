import { Request, Response } from 'express';
import Product from '../models/Product';
import Category from '../models/Category';
import Unit from '../models/Unit';
import BillingFrequency from '../models/BillingFrequency';
import Currency from '../models/Currency';

// Get all products
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 0; // 0 signifie "pas de limite"
    
    const products = await Product.find()
      .populate('category')
      .populate('unit')
      .populate('billingFrequency')
      .populate('currency')
      .limit(limit);
    
    res.status(200).json(products);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single product
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category')
      .populate('unit')
      .populate('billingFrequency')
      .populate('currency');
      
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(200).json(product);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Create a product
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  const { ref, name, category, unit, billingFrequency, unitPrice, currency, stock = 0 } = req.body;
  
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
    
    // Vérifier si les références existent
    const unitExists = await Unit.findOne({ name: unit });
    if (!unitExists) {
      res.status(400).json({ message: `Unit "${unit}" not found` });
      return;
    }
    
    const billingFrequencyExists = await BillingFrequency.findOne({ name: billingFrequency });
    if (!billingFrequencyExists) {
      res.status(400).json({ message: `Billing frequency "${billingFrequency}" not found` });
      return;
    }
    
    const currencyExists = await Currency.findOne({ name: currency });
    if (!currencyExists) {
      res.status(400).json({ message: `Currency "${currency}" not found` });
      return;
    }
    
    const product = await Product.create({
      ref,
      name,
      category,
      unit: unitExists.name,
      billingFrequency: billingFrequencyExists.name,
      unitPrice,
      currency: currencyExists.name,
      stock
    });
    
    // Récupérer le produit avec les références peuplées
    const populatedProduct = await Product.findById(product._id)
      .populate('category')
      .populate('unit')
      .populate('billingFrequency')
      .populate('currency');
      
    res.status(201).json(populatedProduct);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Update a product
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const { unitName, billingFrequencyName, currencyName, ...otherData } = req.body;
  const updateData = { ...otherData };
  
  try {
    // Si la catégorie est mise à jour, vérifier qu'elle existe
    if (otherData.category) {
      let categoryExists = await Category.findOne({ name: otherData.category });
      
      // Si la catégorie n'existe pas, la créer
      if (!categoryExists) {
        await Category.create({
          name: otherData.category,
          description: ''
        });
      }
    }
    
    // Vérifier et mettre à jour les références si elles sont fournies
    if (unitName) {
      const unitExists = await Unit.findOne({ name: unitName });
      if (!unitExists) {
        res.status(400).json({ message: `Unit "${unitName}" not found` });
        return;
      }
      updateData.unit = unitExists.name;
    }
    
    if (billingFrequencyName) {
      const billingFrequencyExists = await BillingFrequency.findOne({ name: billingFrequencyName });
      if (!billingFrequencyExists) {
        res.status(400).json({ message: `Billing frequency "${billingFrequencyName}" not found` });
        return;
      }
      updateData.billingFrequency = billingFrequencyExists.name;
    }
    
    if (currencyName) {
      const currencyExists = await Currency.findOne({ name: currencyName });
      if (!currencyExists) {
        res.status(400).json({ message: `Currency "${currencyName}" not found` });
        return;
      }
      updateData.currency = currencyExists.name;
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('category')
    .populate('unit')
    .populate('billingFrequency')
    .populate('currency');
    
    if (!updatedProduct) {
      res.status(404).json({ message: 'Product not found' });
      return;
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
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Update stock
export const updateStock = async (req: Request, res: Response): Promise<void> => {
  const { stock } = req.body;
  
  if (stock === undefined) {
    res.status(400).json({ message: 'Stock value is required' });
    return;
  }
  
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    
    product.stock = stock;
    await product.save();
    
    res.status(200).json(product);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}; 