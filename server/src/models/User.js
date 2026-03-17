import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, index: true },
    name: { type: String, default: '' },
    photoURL: { type: String, default: '' },
    role: { type: String, enum: ['student', 'teacher', 'admin'], required: true }
  },
  { timestamps: true }
)

export const User = mongoose.models.User || mongoose.model('User', UserSchema)

