import User from '../models/User.js';

// Get leaderboard (sorted by points)
export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find({})
      .sort({ totalPoints: -1, createdAt: 1 })
      .select('name totalPoints createdAt');
    
    // Add rank to each user
    const leaderboardWithRank = leaderboard.map((user, index) => ({
      ...user.toObject(),
      rank: index + 1
    }));
    
    res.json(leaderboardWithRank);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ 
      error: 'Failed to fetch leaderboard',
      message: error.message 
    });
  }
};