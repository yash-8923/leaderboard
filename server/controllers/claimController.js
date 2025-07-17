import User from '../models/User.js';
import ClaimHistory from '../models/ClaimHistory.js';
import mongoose from 'mongoose';

// Claim points for a user
export const claimPoints = async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    await session.startTransaction();
    
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }
    
    // Check if user exists
    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Generate random points (1-10)
    const awardedPoints = Math.floor(Math.random() * 10) + 1;
    
    // Update user's total points using atomic operation
    await User.findByIdAndUpdate(
      userId,
      { $inc: { totalPoints: awardedPoints } },
      { session, new: true }
    );
    
    // Log claim to history
    const claimRecord = new ClaimHistory({
      userId,
      points: awardedPoints
    });
    await claimRecord.save({ session });
    
    // Get updated leaderboard
    const leaderboard = await User.find({})
      .sort({ totalPoints: -1, createdAt: 1 })
      .select('name totalPoints createdAt')
      .session(session);
    
    // Add rank to each user
    const leaderboardWithRank = leaderboard.map((user, index) => ({
      ...user.toObject(),
      rank: index + 1
    }));
    
    await session.commitTransaction();
    
    res.json({
      awarded: awardedPoints,
      leaderboard: leaderboardWithRank,
      user: user.name
    });
    
  } catch (error) {
    await session.abortTransaction();
    console.error('Claim error:', error);
    res.status(500).json({ 
      error: 'Failed to process claim',
      message: error.message 
    });
  } finally {
    session.endSession();
  }
};

// Get claim history for a user
export const getClaimHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }
    
    const history = await ClaimHistory.find({ userId })
      .sort({ timestamp: -1 })
      .populate('userId', 'name')
      .limit(50); // Limit to last 50 claims
    
    res.json(history);
  } catch (error) {
    console.error('Error fetching claim history:', error);
    res.status(500).json({ 
      error: 'Failed to fetch claim history',
      message: error.message 
    });
  }
};

// Get all claim history (admin endpoint)
export const getAllClaimHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const history = await ClaimHistory.find({})
      .sort({ timestamp: -1 })
      .populate('userId', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await ClaimHistory.countDocuments();
    
    res.json({
      history,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching all claim history:', error);
    res.status(500).json({ 
      error: 'Failed to fetch claim history',
      message: error.message 
    });
  }
};