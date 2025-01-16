import mongoose from 'mongoose';
import getEnvVars from '../utils/getEnvVars.js';

const initMongoDB = async () => {
  try {
    const user = getEnvVars('MONGO_USER');
    const password = getEnvVars('MONGO_PASSWORD');
    const db = getEnvVars('MONGO_DB');

    const uri = `mongodb+srv://${user}:${password}@adopt-e.phne2.mongodb.net/${db}?retryWrites=true&w=majority`;

    const connection = await mongoose.connect(uri);

    console.log(`MongoDB is connected: ${connection.connection.host}`);

    mongoose.connection.on('error', err => {
      console.error('MongoDB error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default initMongoDB;
