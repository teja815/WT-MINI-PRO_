import { getFirebaseAdmin } from '../lib/firebaseAdmin.js'
import { User } from '../models/User.js'

export async function requireAuth(req, res, next) {
  try {
    const firebaseAdmin = getFirebaseAdmin()
    if (!firebaseAdmin) {
      return res
        .status(500)
        .send(
          'Firebase Admin not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON (recommended) or FIREBASE_SERVICE_ACCOUNT_PATH / GOOGLE_APPLICATION_CREDENTIALS in server/.env'
        )
    }

    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : ''
    if (!token) return res.status(401).send('Missing auth token')

    const decoded = await firebaseAdmin.auth().verifyIdToken(token)
    req.auth = decoded

    const user = await User.findOne({ firebaseUid: decoded.uid })
    req.user = user || null
    return next()
  } catch (e) {
    return res.status(401).send('Invalid auth token')
  }
}

export function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).send('User not registered')
    if (!roles.includes(req.user.role)) return res.status(403).send('Forbidden')
    return next()
  }
}

