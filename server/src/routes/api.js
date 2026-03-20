import express from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { User } from '../models/User.js'
import { Issue } from '../models/Issue.js'

export const apiRouter = express.Router()

function parseAllowList(value) {
  return String(value || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

apiRouter.get('/health', (req, res) => {
  res.json({ ok: true })
})

apiRouter.get('/me', requireAuth, (req, res) => {
  if (!req.user) return res.status(404).send('Not registered')
  res.json({ user: req.user })
})

apiRouter.post('/register', requireAuth, async (req, res) => {
  const role = req.body?.role
  if (!['student', 'teacher', 'admin'].includes(role)) return res.status(400).send('Invalid role')

  // If already exists, keep existing role (prevents self-escalation)
  let user = await User.findOne({ firebaseUid: req.auth.uid })
  if (user) return res.json({ user })

  const email = (req.auth.email || '').toLowerCase()
  if (!email) return res.status(400).send('Missing email in Firebase account')

  const adminAllow = parseAllowList(process.env.ADMIN_EMAILS)
  const teacherAllow = parseAllowList(process.env.TEACHER_EMAILS)
  if (role === 'admin' && adminAllow.length > 0 && !adminAllow.includes(email)) {
    return res.status(403).send('This email is not allowed to register as admin')
  }
  if (role === 'teacher' && teacherAllow.length > 0 && !teacherAllow.includes(email)) {
    return res.status(403).send('This email is not allowed to register as teacher')
  }

  user = await User.create({
    firebaseUid: req.auth.uid,
    email,
    name: req.auth.name || '',
    photoURL: req.auth.picture || '',
    role
  })
  res.json({ user })
})

apiRouter.get('/issues', requireAuth, requireRole(['student', 'teacher', 'admin']), async (req, res) => {
  const { category, status } = req.query
  if (!['classroom', 'mess', 'hostel'].includes(category)) return res.status(400).send('Invalid category')
  if (!['pending', 'approved', 'rejected'].includes(status)) return res.status(400).send('Invalid status')

  const issues = await Issue.find({ category, status })
    .populate('createdBy', 'name email role')
    .sort({ createdAt: -1 })
    .limit(200)
  res.json({ issues })
})

apiRouter.post('/issues', requireAuth, requireRole(['student', 'teacher', 'admin']), async (req, res) => {
  const { category, description, photoUrl } = req.body || {}
  if (!['classroom', 'mess', 'hostel'].includes(category)) return res.status(400).send('Invalid category')
  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    return res.status(400).send('Description must be at least 10 characters')
  }

  const issue = await Issue.create({
    category,
    description: description.trim(),
    photoUrl: typeof photoUrl === 'string' ? photoUrl : '',
    status: 'pending',
    createdBy: req.user._id
  })
  res.json({ issue })
})

apiRouter.get('/my-stats', requireAuth, requireRole(['student', 'teacher', 'admin']), async (req, res) => {
  if (req.user.role === 'admin') {
    // For admin, return total pending and approved counts
    const [totalPending, totalApproved] = await Promise.all([
      Issue.countDocuments({ status: 'pending' }),
      Issue.countDocuments({ status: 'approved' })
    ])
    return res.json({ stats: { totalPending, totalApproved, approvedByMe: 0, pendingByMe: 0 } })
  }

  const [approvedByMe, pendingByMe] = await Promise.all([
    Issue.countDocuments({ createdBy: req.user._id, status: 'approved' }),
    Issue.countDocuments({ createdBy: req.user._id, status: 'pending' })
  ])
  res.json({ stats: { approvedByMe, pendingByMe } })
})

// Admin
apiRouter.get('/admin/pending', requireAuth, requireRole(['admin']), async (req, res) => {
  const issues = await Issue.find({ status: 'pending' })
    .populate('createdBy', 'name email role')
    .sort({ createdAt: -1 })
    .limit(500)
  res.json({ issues })
})

apiRouter.post('/admin/issues/:id/approve', requireAuth, requireRole(['admin']), async (req, res) => {
  const { id } = req.params
  const issue = await Issue.findById(id)
  if (!issue) return res.status(404).send('Not found')
  if (issue.status !== 'pending') return res.status(400).send('Not pending')

  issue.status = 'approved'
  issue.approvedBy = req.user._id
  issue.approvedAt = new Date()
  await issue.save()

  res.json({ issue })
})

apiRouter.post('/admin/issues/:id/reject', requireAuth, requireRole(['admin']), async (req, res) => {
  const { id } = req.params
  const { reason } = req.body

  const issue = await Issue.findById(id)
  if (!issue) return res.status(404).send('Not found')
  if (issue.status !== 'pending') return res.status(400).send('Not pending')

  issue.status = 'rejected'
  issue.rejectedBy = req.user._id
  issue.rejectedAt = new Date()
  issue.rejectionReason = reason || 'No reason provided'
  await issue.save()

  res.json({ issue })
})

// Faculty
apiRouter.get('/faculty/approved', requireAuth, requireRole(['teacher', 'admin']), async (req, res) => {
  const issues = await Issue.find({ status: 'approved' })
    .sort({ approvedAt: -1, updatedAt: -1 })
    .limit(500)
  res.json({ issues })
})

