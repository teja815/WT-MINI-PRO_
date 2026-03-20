import React, { useEffect, useState } from 'react'

const STORAGE = {
  contrast: 'cp_high_contrast',
  fontSize: 'cp_font_scale',
  hideImages: 'cp_hide_images',
  bigCursor: 'cp_big_cursor'
}

export default function AccessibilityToolsDialog({ onClose }) {
  const [contrast, setContrast] = useState(false)
  const [hideImages, setHideImages] = useState(false)
  const [bigCursor, setBigCursor] = useState(false)

  useEffect(() => {
    try {
      setContrast(localStorage.getItem(STORAGE.contrast) === 'true')
      setHideImages(localStorage.getItem(STORAGE.hideImages) === 'true')
      setBigCursor(localStorage.getItem(STORAGE.bigCursor) === 'true')
    } catch {}
  }, [])

  function toggleContrast() {
    const next = !contrast
    setContrast(next)
    document.documentElement.classList.toggle('high-contrast', next)
    try { localStorage.setItem(STORAGE.contrast, next.toString()) } catch {}
  }

  function adjustFont(delta) {
    const root = document.documentElement
    const current = parseFloat(root.style.getPropertyValue('--font-scale') || '1')
    const next = Math.max(0.7, Math.min(1.5, current + delta))
    root.style.setProperty('--font-scale', next.toString())
    try { localStorage.setItem(STORAGE.fontSize, next.toString()) } catch {}
  }

  function resetFont() {
    document.documentElement.style.setProperty('--font-scale', '1')
    try { localStorage.setItem(STORAGE.fontSize, '1') } catch {}
  }

  function toggleHideImages() {
    const next = !hideImages
    setHideImages(next)
    document.documentElement.classList.toggle('hide-images', next)
    try { localStorage.setItem(STORAGE.hideImages, next.toString()) } catch {}
  }

  function toggleBigCursor() {
    const next = !bigCursor
    setBigCursor(next)
    document.documentElement.classList.toggle('big-cursor', next)
    try { localStorage.setItem(STORAGE.bigCursor, next.toString()) } catch {}
  }

  const btnBase = 'border-2 rounded-xl hover:bg-gray-50 cursor-pointer flex flex-col justify-center items-center gap-1 p-3 text-center w-full aspect-square text-xs font-medium transition-all duration-200'
  const btnActive = 'border-brand-red bg-red-50 text-brand-red shadow-sm'
  const btnInactive = 'border-gray-200 text-gray-700 hover:border-brand-sky hover:text-brand-sky'

  return (
    <div className="fixed inset-0 z-[999] flex items-start justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Accessibility Tools"
        className="relative mr-4 mt-28 w-[340px] rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl animate-slideInRight"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">♿ Accessibility Tools</h2>
          <button
            title="Close"
            aria-label="Close accessibility tools"
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Contrast</h3>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={toggleContrast} className={`${btnBase} ${contrast ? btnActive : btnInactive}`}>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                {contrast ? 'Normal' : 'High Contrast'}
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Text Size</h3>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => adjustFont(-0.1)} className={`${btnBase} ${btnInactive}`}>
                <span className="text-lg font-bold">A-</span>
                Decrease
              </button>
              <button onClick={resetFont} className={`${btnBase} ${btnInactive}`}>
                <span className="text-lg font-bold">A</span>
                Reset
              </button>
              <button onClick={() => adjustFont(0.1)} className={`${btnBase} ${btnInactive}`}>
                <span className="text-lg font-bold">A+</span>
                Increase
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Others</h3>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={toggleHideImages} className={`${btnBase} ${hideImages ? btnActive : btnInactive}`}>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                {hideImages ? 'Show Images' : 'Hide Images'}
              </button>
              <button onClick={toggleBigCursor} className={`${btnBase} ${bigCursor ? btnActive : btnInactive}`}>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                {bigCursor ? 'Normal Cursor' : 'Big Cursor'}
              </button>
              <a
                href="https://www.screenreaderaccess.com/"
                target="_blank"
                rel="noreferrer"
                className={`${btnBase} ${btnInactive} no-underline`}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                Screen Reader
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
