import { config } from 'dotenv';
import mongoose from 'mongoose';
import { app } from './app';
config();
const port = process.env.PORT || 8080;
const password = '2GVNQKXRX6mHPkzG';
const database = 'DATN';
const url = `mongodb+srv://tuanakb1:${password}@cluster0.ibm8g.mongodb.net/${database}?retryWrites=true&w=majority`;

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
