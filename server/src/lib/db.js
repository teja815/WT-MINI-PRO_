import mongoose from 'mongoose'
import { initSupabase, getSupabase } from './supabase.js'

let isConnected = false

export async function connectDb() {
  if (isConnected) return { mongoose, supabase: getSupabase() }

  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('Missing MONGODB_URI in server .env')
  await mongoose.connect(uri)
  isConnected = true

  const supabase = initSupabase()

  return { mongoose, supabase }
}

export function getMongoose() {
  return mongoose
}

export { getSupabase }

