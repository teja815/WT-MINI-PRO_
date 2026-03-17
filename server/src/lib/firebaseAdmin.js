import admin from 'firebase-admin'

function initFirebaseAdminIfPossible() {
  if (admin.apps.length) return admin

  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  const path = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || process.env.GOOGLE_APPLICATION_CREDENTIALS

  if (json) {
    const serviceAccount = JSON.parse(json)
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    })
    return admin
  }

  // Supports standard ADC flow via GOOGLE_APPLICATION_CREDENTIALS path
  if (path) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    })
    return admin
  }

  return null
}

export function getFirebaseAdmin() {
  return initFirebaseAdminIfPossible()
}

