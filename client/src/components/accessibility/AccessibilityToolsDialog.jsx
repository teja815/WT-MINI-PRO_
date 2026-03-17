import React from 'react'

// Minimal, India.gov.in-like accessibility tools dialog structure (Tailwind-only)
export default function AccessibilityToolsDialog({ onClose }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="border shadow absolute right-4 top-16 !z-[999] bg-white p-4 rounded-md block w-[280px] sm:w-[336px] max-h-[300px] overflow-y-auto overscroll-contain"
    >
      <div className="flex w-full justify-end">
        <button
          title="Close"
          className="p-0.5 transition-all text-gray-500 hover:text-gray-700 rounded-full border border-transparent hover:border-gray-700"
          aria-label="Close"
          onClick={onClose}
        >
          <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 15 15" className="size-3" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
              fill="currentColor"
            ></path>
          </svg>
        </button>
      </div>

      <h2 className="font-medium mb-[16px] text-[16px]">Accessibility Tools</h2>

      <h3 className="text-[16px]">Contrast Adjustment</h3>
      <div className="h-[1px] bg-black"></div>
      <ul className="grid grid-cols-3 gap-[16px] p-[8px]">
        <li>
          <button className="border rounded-md hover:bg-[#F7F7F7] cursor-pointer flex flex-col justify-center items-center gap-[4px] sm:gap-[8px] py-[4px] sm:py-[8px] px-[2px] sm:px-[4px] text-center w-[70px] h-[70px] sm:w-[96px] sm:h-[96px] text-[12px] sm:text-[14px]">
            High Contrast
          </button>
        </li>
        <li>
          <button className="border border-brand-red rounded-md hover:bg-[#F7F7F7] cursor-pointer flex flex-col justify-center items-center gap-[4px] sm:gap-[8px] py-[4px] sm:py-[8px] px-[2px] sm:px-[4px] text-center w-[70px] h-[70px] sm:w-[96px] sm:h-[96px] text-[12px] sm:text-[14px]">
            Normal
          </button>
        </li>
      </ul>

      <h3>Text Size</h3>
      <div className="h-[1px] bg-black"></div>
      <ul className="grid grid-cols-3 gap-[16px] p-[8px]" style={{ gridAutoRows: '1fr', gridAutoColumns: '1fr' }}>
        <li>
          <button className="border rounded-md hover:bg-[#F7F7F7] cursor-pointer flex flex-col justify-center items-center gap-[4px] sm:gap-[8px] py-[4px] sm:py-[8px] px-[2px] sm:px-[4px] text-center w-[70px] h-[70px] sm:w-[96px] sm:h-[96px] text-[12px] sm:text-[14px]">
            Increase Text
          </button>
        </li>
        <li>
          <button className="border rounded-md hover:bg-[#F7F7F7] cursor-pointer flex flex-col justify-center items-center gap-[4px] sm:gap-[8px] py-[4px] sm:py-[8px] px-[2px] sm:px-[4px] text-center w-[70px] h-[70px] sm:w-[96px] sm:h-[96px] text-[12px] sm:text-[14px]">
            Decrease Text
          </button>
        </li>
        <li>
          <button className="border rounded-md hover:bg-[#F7F7F7] cursor-pointer flex flex-col justify-center items-center gap-[4px] sm:gap-[8px] py-[4px] sm:py-[8px] px-[2px] sm:px-[4px] text-center w-[70px] h-[70px] sm:w-[96px] sm:h-[96px] text-[12px] sm:text-[14px]">
            Reset Text
          </button>
        </li>
      </ul>

      <h3>Others</h3>
      <div className="h-[1px] bg-black"></div>
      <ul className="grid grid-cols-3 gap-[16px] p-[8px]">
        <li>
          <button className="border rounded-md hover:bg-[#F7F7F7] cursor-pointer flex flex-col justify-center items-center gap-[4px] sm:gap-[8px] py-[4px] sm:py-[8px] px-[2px] sm:px-[4px] text-center w-[70px] h-[70px] sm:w-[96px] sm:h-[96px] text-[12px] sm:text-[14px]">
            Hide Images
          </button>
        </li>
        <li>
          <button className="border rounded-md hover:bg-[#F7F7F7] cursor-pointer flex flex-col justify-center items-center gap-[4px] sm:gap-[8px] py-[4px] sm:py-[8px] px-[2px] sm:px-[4px] text-center w-[70px] h-[70px] sm:w-[96px] sm:h-[96px] text-[12px] sm:text-[14px]">
            Big Cursor
          </button>
        </li>
        <li>
          <a className="border rounded-md hover:bg-[#F7F7F7] cursor-pointer flex flex-col justify-center items-center gap-[4px] sm:gap-[8px] py-[4px] sm:py-[8px] px-[2px] sm:px-[4px] text-center w-[70px] h-[70px] sm:w-[96px] sm:h-[96px] text-[12px] sm:text-[14px]" href="/help">
            Screen Reader
          </a>
        </li>
      </ul>
    </div>
  )
}

