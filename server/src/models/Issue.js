import mongoose from 'mongoose'

const IssueSchema = new mongoose.Schema(
  {
    category: { type: String, enum: ['classroom', 'mess', 'hostel'], required: true, index: true },
    description: { type: String, required: true },
    photoUrl: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    approvedAt: { type: Date, default: null }
  },
  { timestamps: true }
)

export const Issue = mongoose.models.Issue || mongoose.model('Issue', IssueSchema)

