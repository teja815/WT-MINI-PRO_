import { API_BASE_URL } from '../config'
import { auth } from '../firebase'

async function authHeader() {
  const user = auth.currentUser
  if (!user) return {}
  const token = await user.getIdToken()
  return { Authorization: `Bearer ${token}` }
}

export async function apiGet(path) {
  const headers = { ...(await authHeader()) }
  const res = await fetch(`${API_BASE_URL}${path}`, { headers })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function apiPost(path, body) {
  const headers = {
    'Content-Type': 'application/json',
    ...(await authHeader())
  }
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

