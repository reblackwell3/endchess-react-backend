// backend/config/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected...' + process.env.MONGO_URI);
  } catch (err) {
    console.error(err.message);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;