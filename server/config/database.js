import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    // Ensure the connection string includes the database name
    let mongoUri = process.env.MONGODB_URI;
    
    // If the URI doesn't specify a database, add 'leaderboard'
    if (!mongoUri.includes('mongodb.net/') || mongoUri.includes('mongodb.net/?')) {
      mongoUri = mongoUri.replace('mongodb.net/', 'mongodb.net/leaderboard');
    } else if (!mongoUri.includes('/leaderboard')) {
      // Replace any existing database name with 'leaderboard'
      mongoUri = mongoUri.replace(/\/[^?]+/, '/leaderboard');
    }
    
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;