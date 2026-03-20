import React, { useEffect, useState } from 'react'

const CONTRAST_MODES = {
  NORMAL: 'normal',
  HIGH: 'high',
  DARK: 'dark'
}

const TEXT_SIZES = {
  SMALL: 'small',
  NORMAL: 'normal',
  LARGE: 'large',
  XLARGE: 'xlarge'
}

const TEXT_SIZE_MAP = {
  small: '0.875',
  normal: '1',
  large: '1.125',
  xlarge: '1.25'
}

export default function AccessibilityToolsDialog({ onClose }) {
  const [contrastMode, setContrastMode] = useState(CONTRAST_MODES.NORMAL)
  const [textSize, setTextSize] = useState(TEXT_SIZES.NORMAL)
  const [hideImages, setHideImages] = useState(false)
  const [bigCursor, setBigCursor] = useState(false)

  // Load preferences from localStorage
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

  // Apply text size
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

  function saveSettings() {
    try {
      localStorage.setItem(
        'a11y_settings',
        JSON.stringify({
          contrastMode,
          textSize,
          hideImages,
          bigCursor
        })
      )
    } catch (e) {
      console.warn('Failed to save accessibility settings')
    }
  }

  function resetAll() {
    setContrastMode(CONTRAST_MODES.NORMAL)
    setTextSize(TEXT_SIZES.NORMAL)
    setHideImages(false)
    setBigCursor(false)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="a11y-dialog-title"
      className="absolute right-4 top-16 z-[999] max-h-[500px] w-[320px] overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-xl sm:w-[380px]"
    >
      {/* Header */}
      <div className="sticky top-0 border-b border-gray-200 bg-white p-4">
        <div className="flex items-start justify-between gap-3">
          <h2 id="a11y-dialog-title" className="text-lg font-extrabold text-gray-900">
            ♿ Accessibility Tools
          </h2>
          <button
            type="button"
            aria-label="Close accessibility tools"
            className="rounded-full p-1 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-red"
            onClick={onClose}
          >
            <svg stroke="currentColor" fill="currentColor" viewBox="0 0 15 15" className="h-5 w-5 text-gray-600">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-5 p-4">
        {/* Contrast Adjustment */}
        <div>
          <h3 className="text-sm font-extrabold uppercase text-gray-900">🎨 Contrast Adjustment</h3>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { value: CONTRAST_MODES.NORMAL, label: 'Normal', emoji: '⚪' },
              { value: CONTRAST_MODES.HIGH, label: 'High', emoji: '⬛' },
              { value: CONTRAST_MODES.DARK, label: 'Dark', emoji: '🌙' }
            ].map((mode) => (
              <button
                key={mode.value}
                onClick={() => setContrastMode(mode.value)}
                aria-pressed={contrastMode === mode.value}
                className={[
                  'rounded-lg p-3 transition-all font-semibold text-sm flex flex-col items-center gap-1',
                  contrastMode === mode.value
                    ? 'border-2 border-brand-red bg-red-50 shadow-md'
                    : 'border-2 border-gray-200 bg-white hover:border-gray-300'
                ].join(' ')}
              >
                <span className="text-xl">{mode.emoji}</span>
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text Size */}
        <div>
          <h3 className="text-sm font-extrabold uppercase text-gray-900">📝 Text Size</h3>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[
              { value: TEXT_SIZES.SMALL, label: 'Small', emoji: '🔤' },
              { value: TEXT_SIZES.NORMAL, label: 'Normal', emoji: '📄' },
              { value: TEXT_SIZES.LARGE, label: 'Large', emoji: '📖' },
              { value: TEXT_SIZES.XLARGE, label: 'X-Large', emoji: '📕' }
            ].map((size) => (
              <button
                key={size.value}
                onClick={() => setTextSize(size.value)}
                aria-pressed={textSize === size.value}
                className={[
                  'rounded-lg p-2 transition-all font-semibold text-xs flex flex-col items-center gap-1',
                  textSize === size.value ? 'border-2 border-brand-red bg-red-50 shadow-md' : 'border-2 border-gray-200 bg-white hover:border-gray-300'
                ].join(' ')}
              >
                <span className="text-lg">{size.emoji}</span>
                {size.label}
              </button>
            ))}
          </div>
        </div>

        {/* Other Options */}
        <div>
          <h3 className="text-sm font-extrabold uppercase text-gray-900">⚙️ Other Options</h3>
          <div className="mt-3 space-y-2">
            <label className="flex items-center gap-3 rounded-lg border-2 border-gray-200 p-3 hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={hideImages}
                onChange={(e) => setHideImages(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-brand-red focus:ring-brand-red"
                aria-label="Hide images"
              />
              <span className="flex-1 text-sm font-semibold text-gray-900">🖼️ Hide Images</span>
            </label>

            <label className="flex items-center gap-3 rounded-lg border-2 border-gray-200 p-3 hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={bigCursor}
                onChange={(e) => setBigCursor(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-brand-red focus:ring-brand-red"
                aria-label="Big cursor"
              />
              <span className="flex-1 text-sm font-semibold text-gray-900">🖱️ Big Cursor</span>
            </label>
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={resetAll}
          className="w-full rounded-lg border-2 border-gray-300 bg-white p-3 font-semibold text-gray-900 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-red"
          aria-label="Reset all accessibility settings to default"
        >
          🔄 Reset to Default
        </button>

        {/* Info */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800">
          <strong>💡 Tip:</strong> Your accessibility settings are saved locally and will persist across visits.
        </div>
      </div>
    </div>
  )
}
