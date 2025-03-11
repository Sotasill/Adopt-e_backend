import mongoose from 'mongoose';
import 'dotenv/config';

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env file');
}

export const connectDb = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB is already connected');
      return;
    }

    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected');
});

process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    console.error('Error during MongoDB connection closure:', error);
    process.exit(1);
  }
});
