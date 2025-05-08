import mongoose from 'mongoose';


const proposalSchema = new mongoose.Schema({
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    freelancer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to a Freelancer model
        required: true
    },
    cover_letter: {
        type: String,
        required: true
    },
    hourly_rate: {
        type: Number,
        min: 0 // Ensures rate is non-negative
    },
    fixed_price: {
        type: Number,
        min: 0
    },
    duration: {
        type: String,
        enum: ['1 week', '2 weeks', '1 month', '3 months', '6 months+'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
        default: 'pending',
        lowercase: true 
    },
    submitted_at: {
        type: Date,
        default: Date.now // Auto-set to current time
    }
});

// Export the model
export default mongoose.model('Proposal', proposalSchema);