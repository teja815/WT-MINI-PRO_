# 🔍 Code Changes Reference

## Quick Reference for All Modifications

### 1. Admin Rejection Flow

**Frontend - AdminPage.jsx**
```javascript
// New rejection handler
async function reject(id, reason) {
  setBusyId(id)
  try {
    await apiPost(`/api/admin/issues/${id}/reject`, { reason })
    setSuccessMsg('❌ Complaint rejected. Feedback sent to student.')
    await load()
  } catch (e) {
    setErr(e?.message || 'Rejection failed')
  } finally {
    setBusyId('')
  }
}

// In card: Reject form shown inline
{showRejectForm && (
  <div className="mt-4 rounded-lg border-2 border-red-200 bg-red-50 p-4">
    <textarea
      value={rejectReason}
      onChange={(e) => setRejectReason(e.target.value)}
      placeholder="Provide constructive feedback to the student..."
    />
    <button onClick={handleReject}>Confirm Rejection</button>
  </div>
)}
```

**Backend - routes/api.js**
```javascript
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
```

---

### 2. Admin Stats Enhancement

**Backend - routes/api.js**
```javascript
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
```

**Frontend - ProfilePage.jsx**
```javascript
// Load admin-specific stats
useEffect(() => {
  let mounted = true
  async function run() {
    setLoading(true)
    try {
      const data = await apiGet('/api/my-stats')
      if (mounted) {
        if (me?.role === 'admin') {
          setStats({
            ...data.stats,
            totalPending: data.stats.totalPending || 0,
            totalApproved: data.stats.totalApproved || 0
          })
        } else {
          setStats(data.stats)
        }
      }
    } catch (e) {
      console.error('Failed to load stats:', e)
    } finally {
      if (mounted) setLoading(false)
    }
  }
  run()
}, [me?.role])

// Admin dashboard stat cards
{me?.role === 'admin' && (
  <div>
    <h2 className="mb-4 text-lg font-extrabold text-gray-900">🛡️ Admin Dashboard</h2>
    <div className="grid gap-4 md:grid-cols-2">
      <StatCard
        icon="⏳"
        label="Pending Review"
        count={stats.totalPending}
        onClick={handleAdminDashboardClick}
      />
      <StatCard
        icon="✅"
        label="Total Approved"
        count={stats.totalApproved}
      />
    </div>
  </div>
)}
```

---

### 3. Database Model Update

**Backend - models/Issue.js**
```javascript
const IssueSchema = new mongoose.Schema(
  {
    category: { type: String, enum: ['classroom', 'mess', 'hostel'], required: true, index: true },
    description: { type: String, required: true },
    photoUrl: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    approvedAt: { type: Date, default: null },
    // NEW FIELDS FOR REJECTION:
    rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    rejectedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: '' }
  },
  { timestamps: true }
)
```

---

### 4. Accessibility Features Implementation

**Frontend - AccessibilityToolsDialog.jsx**
```javascript
// Load saved settings
useEffect(() => {
  try {
    const saved = localStorage.getItem('a11y_settings')
    if (saved) {
      const settings = JSON.parse(saved)
      setContrastMode(settings.contrastMode || CONTRAST_MODES.NORMAL)
      setTextSize(settings.textSize || TEXT_SIZES.NORMAL)
      setHideImages(settings.hideImages || false)
      setBigCursor(settings.bigCursor || false)
    }
  } catch (e) {
    console.warn('Failed to load accessibility settings')
  }
}, [])

// Apply contrast mode
useEffect(() => {
  const root = document.documentElement
  root.classList.remove('a11y-high-contrast', 'a11y-dark-mode')

  if (contrastMode === CONTRAST_MODES.HIGH) {
    root.classList.add('a11y-high-contrast')
  } else if (contrastMode === CONTRAST_MODES.DARK) {
    root.classList.add('a11y-dark-mode')
  }

  saveSettings()
}, [contrastMode])

// Apply text size (scales root font-size)
useEffect(() => {
  const root = document.documentElement
  const scale = TEXT_SIZE_MAP[textSize] || '1'
  root.style.fontSize = `${scale * 16}px`
  saveSettings()
}, [textSize])

// Apply hide images
useEffect(() => {
  const root = document.documentElement
  if (hideImages) {
    root.classList.add('a11y-hide-images')
  } else {
    root.classList.remove('a11y-hide-images')
  }
  saveSettings()
}, [hideImages])

// Apply big cursor
useEffect(() => {
  const root = document.documentElement
  if (bigCursor) {
    root.classList.add('a11y-big-cursor')
  } else {
    root.classList.remove('a11y-big-cursor')
  }
  saveSettings()
}, [bigCursor])

// Persist to localStorage
function saveSettings() {
  try {
    localStorage.setItem(
      'a11y_settings',
      JSON.stringify({ contrastMode, textSize, hideImages, bigCursor })
    )
  } catch (e) {
    console.warn('Failed to save accessibility settings')
  }
}
```

**Frontend - styles.css**
```css
/* High Contrast Mode */
.a11y-high-contrast * {
  border-color: #000 !important;
  background-color: #fff !important;
  color: #000 !important;
  text-shadow: none !important;
}

/* Dark Mode */
.a11y-dark-mode {
  background-color: #1a1a1a !important;
  color: #e0e0e0 !important;
}

.a11y-dark-mode * {
  background-color: #2a2a2a !important;
  color: #e0e0e0 !important;
  border-color: #444 !important;
}

/* Hide Images */
.a11y-hide-images img {
  display: none !important;
}

/* Big Cursor */
.a11y-big-cursor {
  cursor: url('data:image/svg+xml;utf8,...') auto !important;
}
```

---

### 5. Interactive Profile Stat Cards

**Frontend - ProfilePage.jsx**
```javascript
function StatCard({ icon, label, count, to, loading, onClick }) {
  const CardComponent = to ? Link : 'div'
  const cardProps = to ? { to } : onClick ? { 
    onClick, 
    role: 'button', 
    tabIndex: 0, 
    onKeyDown: (e) => (e.key === 'Enter' || e.key === ' ') && onClick() 
  } : {}

  return (
    <CardComponent
      {...cardProps}
      className="group relative overflow-hidden rounded-xl border-2 p-6..."
    >
      <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-brand-yellow/5..."></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm font-semibold uppercase text-gray-600">{label}</div>
            <div className="mt-3 text-4xl font-extrabold text-brand-red">
              {loading ? <span className="animate-pulse">...</span> : count}
            </div>
          </div>
          <div className="text-4xl">{icon}</div>
        </div>

        {(to || onClick) && (
          <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-brand-sky">
            <span>View Details</span>
            <svg className="h-4 w-4">...</svg>
          </div>
        )}
      </div>
    </CardComponent>
  )
}
```

---

### 6. Login Page Enhancements

**Frontend - LoginPage.jsx (Role Selection)**
```javascript
const ROLE_OPTIONS = [
  {
    id: 'student',
    label: 'Student',
    desc: 'Submit issues and track their status in real-time.',
    icon: '📚',
  },
  {
    id: 'teacher',
    label: 'Faculty',
    desc: 'View approved complaints and provide resolutions.',
    icon: '👨‍🏫',
  },
  {
    id: 'admin',
    label: 'Administrator',
    desc: 'Review, approve, and manage all complaints.',
    icon: '🛡️',
  }
]

// Role selection buttons with icons
{ROLE_OPTIONS.map((opt) => (
  <button
    key={opt.id}
    onClick={() => setRole(opt.id)}
    className={role === opt.id ? 'border-brand-red bg-red-50' : 'border-gray-200'}
    aria-pressed={role === opt.id}
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{opt.icon}</span>
          <div className="text-sm font-extrabold">{opt.label}</div>
        </div>
        <div className="mt-1 text-xs text-gray-600">{opt.desc}</div>
      </div>
      <div className={role === opt.id ? 'border-brand-red bg-brand-red' : 'border-gray-300'}>
        {role === opt.id && <svg>...</svg>}
      </div>
    </div>
  </button>
))}
```

---

## 📊 Summary Table

| Feature | Location | Status |
|---------|----------|--------|
| Login Page UI | `client/src/pages/LoginPage.jsx` | ✅ Enhanced |
| Profile Page | `client/src/pages/ProfilePage.jsx` | ✅ Enhanced |
| Accessibility Dialog | `client/src/components/accessibility/AccessibilityToolsDialog.jsx` | ✅ Functional |
| Admin Dashboard | `client/src/pages/AdminPage.jsx` | ✅ Enhanced |
| Accessibility Styles | `client/src/styles.css` | ✅ Added |
| Issue Model | `server/src/models/Issue.js` | ✅ Updated |
| API Routes | `server/src/routes/api.js` | ✅ Enhanced |

---

## 🔄 Migration Notes

If upgrading from old version:
1. Backup MongoDB data
2. Run model migration to add new Issue fields (rejectedBy, rejectedAt, rejectionReason)
3. Deploy server first with backward compatibility
4. Deploy client code
5. Test admin rejection flow
6. Monitor logs for errors

---

**Last Updated**: March 2026  
**Compatibility**: MongoDB 4.0+, Node.js 16+, React 18+
