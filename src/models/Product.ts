import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  ref: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  unit: { type: String, required: true },
  billingFrequency: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  currency: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
}, { timestamps: true });

export default mongoose.model('Product', productSchema); 