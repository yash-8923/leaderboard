import mongoose from 'mongoose';

const claimHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  points: {
    type: Number,
    required: [true, 'Points are required'],
    min: [1, 'Points must be at least 1'],
    max: [10, 'Points cannot exceed 10']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries by user and timestamp
claimHistorySchema.index({ userId: 1, timestamp: -1 });
claimHistorySchema.index({ timestamp: -1 });

const ClaimHistory = mongoose.model('ClaimHistory', claimHistorySchema);

export default ClaimHistory;