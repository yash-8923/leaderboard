import User from '../models/User.js';
import mongoose from 'mongoose';

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ totalPoints: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      error: 'Failed to fetch users',
      message: error.message 
    });
  }
};

// Create new user
export const createUser = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    if (name.length > 50) {
      return res.status(400).json({ error: 'Name must be less than 50 characters' });
    }
    
    // Check if user already exists (case-insensitive)
    const existingUser = await User.findOne({ 
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
    });
    
    if (existingUser) {
      return res.status(409).json({ error: 'User with this name already exists' });
    }
    
    const newUser = new User({ name: name.trim() });
    await newUser.save();
    
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({ error: 'User with this name already exists' });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    
    res.status(500).json({ 
      error: 'Failed to create user',
      message: error.message 
    });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }
    
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user',
      message: error.message 
    });
  }
};