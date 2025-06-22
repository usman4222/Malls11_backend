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
    contact_no: {
      type: String,
    },
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
    cnic_no: {
      type: String,
      default: null,
    },
    passport_no: {
      type: String,
      default: null,
    },
    doc_pic: { type: String }, // URL to document

    // Freelancer-Specific
    hourly_rate: {
      min: { type: Number, min: 1 },
      max: { type: Number, min: 1 }
    },
    profile_des: { type: String, maxlength: 2000 },
    profile_status: {
      type: String,
      enum: ["pending", "completed", "deleted"],
      default: "pending"
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

    // Freelancer Gigs (Only for role: 'freelancer')
    freelancer_gig: {
      type: [{
        title: { type: String, trim: true, maxlength: 100 },
        description: { type: String, maxlength: 2000 },
        category: {
          type: String,
          enum: ["design", "development", "writing", "marketing"],
        },
        response_time: { type: Number, min: 1 }, // in hours
        english_level: {
          type: String,
          enum: ["Basic", "Conversational", "Fluent", "Native"],
          default: "Fluent"
        },
        packages: [{
          tier: {
            type: String,
            enum: ["Basic", "Standard", "Premium"],
          },
          title: { type: String, },
          description: { type: String, },
          price: { type: Number, min: 5 },
          delivery_days: { type: Number, min: 1 },
          revisions: { type: Number, default: 1 },
          features: [String]
        }],
        status: {
          type: String,
          enum: ["draft", "active", "paused"],
          default: "draft"
        },
        created_at: { type: Date, default: Date.now }
      }],
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Prevent gig creation for non-freelancers
userSchema.pre('save', function (next) {
  if (this.role !== 'freelancer' && this.freelancer_gig?.length > 0) {
    throw new Error("Only freelancers can create gigs");
  }
  next();
});

// Indexes for performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ "freelancer_gig.category": 1 });
userSchema.index({ "freelancer_gig.status": 1 });
userSchema.index({ role: 1 });

export const UserModel = mongoose.model("User", userSchema);