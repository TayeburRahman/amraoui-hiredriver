import mongoose from 'mongoose';
import { app } from '../src/app';
import config from '../src/config/index';

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }
  try {
    if (!config.database_url) {
      throw new Error('DATABASE_URL is not defined');
    }
    await mongoose.connect(config.database_url as string);
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

// Vercel serverless function entrypoint
export default async (req: any, res: any) => {
  await connectDB();
  return app(req, res);
};
