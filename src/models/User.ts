import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  postalCode: String,
  country: String,
})


const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  lastname: { type: String, required: true },
  firstname: { type: String, required: true },
  password: { type: String, required: true }, 
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  billingAddress: addressSchema,
});

export default mongoose.model('User', userSchema);
