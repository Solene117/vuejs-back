import mongoose from 'mongoose';

const currencySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true,
    unique: true
  },
}, { timestamps: true });

export default mongoose.model('Currency', currencySchema); 