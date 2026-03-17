import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../firebase'

export async function uploadIssuePhoto(file, { uid }) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `issues/${uid}/${Date.now()}_${safeName}`
  const r = ref(storage, path)
  await uploadBytes(r, file)
  return await getDownloadURL(r)
}

