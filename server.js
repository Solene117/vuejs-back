const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connexion à la BDD
const connectDB = require('./config/db');
connectDB();

// Routes
app.get('/', (req, res) => {
  res.send('CRM backend is running ✅');
});

// Exemple de route utilisateur
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
