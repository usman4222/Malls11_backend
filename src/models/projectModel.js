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
    enum: ['Admin', 'Self'],
    required: true,
  },
  project_type: {
    type: String,
    enum: ['Hourly', 'Fixed'],
    required: true,
  },
  duration: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Expert'],
    required: true,
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
    type: {
      min: {
        type: Number,
        required: false
      },
      max: {
        type: Number,
        required: false
      }
    },
    default: null
  },
  fixed_price: {
    type: Number,
    default: null // Only required for fixed-price projects
  },
  skills: {
    type: [String],
    required: true
  },
  project_doc: {
    type: String,
    default: null
  },
  visibility: {
    type: String,
    enum: ['Private', 'Public'],
    default: 'Public'
  },
  status: {
    type: String,
    enum: ['Draft', 'Published', 'In_progress', 'Completed', 'Cancelled'],
    default: 'Draft',
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