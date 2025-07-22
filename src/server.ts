import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

// Import routes
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import orderRoutes from './routes/ordersRoutes';
import billingFrequencyRoutes from './routes/billingFrequencyRoutes';
import currencyRoutes from './routes/currencyRoutes';
import unitRoutes from './routes/unitRoutes';

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('CRM backend is running ✅');
});

// User routes
app.use('/api/users', userRoutes);

// Product routes
app.use('/api/products', productRoutes);

// Category routes
app.use('/api/categories', categoryRoutes);

// Order routes
app.use('/api/orders', orderRoutes);

// BillingFrequency routes
app.use('/api/billing-frequencies', billingFrequencyRoutes);

// Currency routes
app.use('/api/currencies', currencyRoutes);

// Unit routes
app.use('/api/units', unitRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
