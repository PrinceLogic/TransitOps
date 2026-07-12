import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/transitops');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('TransitOps backend will attempt to connect, but please ensure MongoDB is running.');
    // We do not exit(1) immediately to allow the server to boot up and print error pages or allow diagnostics.
  }
};

export default connectDB;
