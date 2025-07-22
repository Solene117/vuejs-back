import mongoose from 'mongoose';

const currencySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
}, { timestamps: true });

export default mongoose.model('Currency', currencySchema); 