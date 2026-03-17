import mongoose from 'mongoose'

export async function connectDb() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('Missing MONGODB_URI in backend .env')
  await mongoose.connect(uri)
}

