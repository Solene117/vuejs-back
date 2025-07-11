import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('✅ MongoDB connecté');
  } catch (err: any) {
    console.error('❌ Erreur de connexion MongoDB :', err.message);
    process.exit(1);
  }
};
