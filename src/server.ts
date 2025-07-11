import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

// Import routes
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
