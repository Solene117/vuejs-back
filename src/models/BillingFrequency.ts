import mongoose from 'mongoose';

const billingFrequencySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
}, { timestamps: true });

export default mongoose.model('BillingFrequency', billingFrequencySchema); 