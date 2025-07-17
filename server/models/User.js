import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [1, 'Name must be at least 1 character'],
    maxlength: [50, 'Name must be less than 50 characters'],
    unique: true
  },
  totalPoints: {
    type: Number,
    default: 0,
    min: [0, 'Points cannot be negative']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for efficient sorting by points
userSchema.index({ totalPoints: -1 });

// Virtual for rank (calculated in queries)
userSchema.virtual('rank');

const User = mongoose.model('User', userSchema);

export default User;