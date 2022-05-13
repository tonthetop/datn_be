import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { app } from './app';

const port = process.env.PORT || 8080;
const url = process.env.MONGODB_URL || 'http://localhost:27017';
console.log(url);

const gracefulExit = () => {
  mongoose.connection.close(() => {
    console.log('Mongoose disconnected on app termination');

    process.exit(0);
  });
};

const start = async () => {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(url);
  console.log('MongoDB connected');

  app.listen(port, () => {
    console.log(`Listen on port ${port}`);
  });
  process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);
};

start();
