import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  freelancer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review_text: {
    type: String,
    required: true,
    maxlength: 2000
  },
}, {
  timestamps: true 
});

// Indexes for better query performance
reviewSchema.index({ project_id: 1 });
reviewSchema.index({ freelancer_id: 1 });
reviewSchema.index({ client_id: 1 });

export const Review = mongoose.model('Review', reviewSchema);