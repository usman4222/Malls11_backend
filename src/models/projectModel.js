import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  management_type: {
    type: String,
    enum: ['admin', 'self'],
    required: true,
    lowercase: true
  },
  project_type: {
    type: String,
    enum: ['hourly', 'fixed'],
    required: true,
    lowercase: true
  },
  duration: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    enum: ['beginner', 'intermediate', 'expert'],
    required: true,
    lowercase: true
  },
  language: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  project_des: {
    type: String,
    required: true
  },
  hourly_rate: {
    type: Number, // Using Number instead of Decimal for simplicity
    default: null // Only required for hourly projects
  },
  fixed_price: {
    type: Number,
    default: null // Only required for fixed-price projects
  },
  skills: {
    type: [String], // Array of strings (e.g., ["JavaScript", "React"])
    required: true
  },
  project_doc: {
    type: String, // Store file path or URL (e.g., AWS S3 link)
    default: null
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'in_progress', 'completed', 'cancelled'],
    default: 'draft',
    lowercase: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better query performance (optional)
projectSchema.index({ client_id: 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ status: 1 });

export const Project = mongoose.model("Project", projectSchema);