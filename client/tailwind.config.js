/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#D90429',
          yellow: '#FFD60A',
          sky: '#38BDF8'
        }
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}

