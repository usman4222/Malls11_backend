import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Basic Info
    username: { type: String, required: true, trim: true, minlenght: 6, maxlength: 30 },
    fullName: { type: String, required: true, trim: true, minlenght: 6, maxlength: 30 },

    // Auth
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    otp: { type: String, maxlength: 6 },

    // Profile
    profile_pic: { type: String, },
    whatsapp_no: {
      type: String,
    },

    // Personal Details
    dof: {
      type: Date,
      default: null
    },
    gender: { type: String, enum: ["male", "female", "other"] },

    // Location
    country: { type: String, },
    state: { type: String, },

    // Verification
    contact_no: {
      type: String,
    },
    address: {
      type: String,
    },
    cnic_no: {
      type: String,
    },
    passport_no: {
      type: String,
    },
    verification_document: {
      type: String,
    },
    profile_verified: {
      type: Boolean
    },
    user_doc: { type: String },

    // Freelancer-Specific
    hourly_rate: {
      min: { type: Number, min: 1 },
      max: { type: Number, min: 1 }
    },
    profile_des: { type: String, maxlength: 2000 },
    profile_status: {
      type: String,
      enum: ["Pending", "Completed", "Deleted"],
      default: "Pending"
    },
    profile_image: {
      type: String,
    },
    tokenVersion: {
      type: Number,
      default: 0
    },

    // Social Links
    social_links: {
      instagram: String,
      facebook: String,
      linkedin: String,
      twitter: String
    },

    // Role Management
    role: {
      type: [String],
      enum: ["admin", "client", "freelancer"],
      default: "client",
      // immutable: true 
    },
    awards: [{ type: String }],
    skills: [{ type: String }],

    faqs: [{
      question: { type: String, required: true, trim: true },
      answer: { type: String, required: true, trim: true }
    }],

  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);


export const UserModel = mongoose.model("User", userSchema);