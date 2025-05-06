// // models/TempUser.js
// import mongoose from 'mongoose';

// const tempUserSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//     lowercase: true
//   },
//   otp: {
//     type: String,
//     required: true
//   },
//   emailVerified: {
//     type: Boolean,
//     default: false
//   },
//   expiresAt: {
//     type: Date,
//     default: () => new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
//     index: { expires: 0 }
//   }
// });

// export default mongoose.model('TempUser', tempUserSchema);