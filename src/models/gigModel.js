import mongoose from "mongoose";

const gigSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: { type: String, trim: true, maxlength: 100, required: true },
    description: { type: String, maxlength: 2000, required: true },
    category: {
        type: String,
        enum: ["design", "development", "writing", "marketing"],
        required: true
    },
    response_time: { type: Number, min: 1, required: true }, // in hours
    english_level: {
        type: String,
        enum: ["Basic", "Conversational", "Fluent", "Native"],
        default: "Fluent"
    },
    min_hourly_rate: {
        type: Number,
        required: true
    },
    max_hourly_rate: {
        type: Number,
        validate: {
            validator: function (value) {
                return value >= this.min_hourly_rate;
            },
            message: "Max hourly rate must be greater than or equal to min hourly rate"
        },
        required: true
    },
    packages: [{
        tier: {
            type: String,
            enum: ["Basic", "Standard", "Premium"]
        },
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, min: 5, required: true },
        delivery_time: { type: Number, min: 1, required: true },
        revisions: { type: Number, default: 1, required: true },
        features: [String]
    }],
    status: {
        type: String,
        enum: ["draft", "active", "paused"],
        default: "draft"
    },
    created_at: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Indexes for performance
gigSchema.index({ userId: 1 });
gigSchema.index({ category: 1 });
gigSchema.index({ status: 1 });

export const GigModel = mongoose.model("Gig", gigSchema);
