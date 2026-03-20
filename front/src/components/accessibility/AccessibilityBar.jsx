import React, { useEffect, useState } from 'react'

const FONT_STEP = 0.1
const MIN_SCALE = 0.7
const MAX_SCALE = 1.5
const STORAGE_KEY = 'cp_font_scale'
const CONTRAST_KEY = 'cp_high_contrast'

export default function AccessibilityBar() {
  const [scale, setScale] = useState(1)
  const [contrast, setContrast] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const val = parseFloat(saved)
        if (!isNaN(val)) { setScale(val); applyScale(val) }
      }
      const hc = localStorage.getItem(CONTRAST_KEY) === 'true'
      setContrast(hc)
      document.documentElement.classList.toggle('high-contrast', hc)
    } catch {}
  }, [])

  function applyScale(val) {
    document.documentElement.style.setProperty('--font-scale', val.toString())
  }

  function adjustFont(delta) {
    setScale(prev => {
      const next = Math.max(MIN_SCALE, Math.min(MAX_SCALE, prev + delta))
      applyScale(next)
      try { localStorage.setItem(STORAGE_KEY, next.toString()) } catch {}
      return next
    })
  }

  function resetFont() {
    setScale(1)
    applyScale(1)
    try { localStorage.setItem(STORAGE_KEY, '1') } catch {}
  }

  function toggleContrast() {
    setContrast(prev => {
      const next = !prev
      document.documentElement.classList.toggle('high-contrast', next)
      try { localStorage.setItem(CONTRAST_KEY, next.toString()) } catch {}
      return next
    })
  }

  return (
    <div className="a11y-bar" role="toolbar" aria-label="Accessibility tools">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
        <a
          href="#main-content"
          className="focus:ring-2 focus:ring-brand-yellow rounded"
        >
          Skip to main content
        </a>
        <div className="flex items-center gap-1">
          <span className="mr-2 hidden sm:inline text-gray-400">Text Size:</span>
          <button
            onClick={() => adjustFont(-FONT_STEP)}
            title="Decrease text size"
            aria-label="Decrease text size"
            className="font-bold"
          >
            A<sup>−</sup>
          </button>
          <button
            onClick={resetFont}
            title="Reset text size"
            aria-label="Reset text size"
            className="font-bold"
          >
            A
          </button>
          <button
            onClick={() => adjustFont(FONT_STEP)}
            title="Increase text size"
            aria-label="Increase text size"
            className="font-bold"
          >
            A<sup>+</sup>
          </button>
          <span className="mx-2 h-4 w-px bg-gray-600" aria-hidden="true"></span>
          <button
            onClick={toggleContrast}
            title={contrast ? 'Normal contrast' : 'High contrast'}
            aria-label={contrast ? 'Switch to normal contrast' : 'Switch to high contrast'}
            className={contrast ? 'bg-yellow-500 text-black rounded px-2' : ''}
          >
            {contrast ? '◑ Normal' : '◐ High Contrast'}
          </button>
          <span className="mx-2 h-4 w-px bg-gray-600" aria-hidden="true"></span>
          <a
            href="https://www.screenreaderaccess.com/"
            target="_blank"
            rel="noreferrer"
            title="Screen reader access"
          >
            Screen Reader
          </a>
        </div>
      </div>
    </div>
  )
}
