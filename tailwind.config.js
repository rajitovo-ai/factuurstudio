/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      transition: {
        'bounce': 'bounce 0.3s ease-in-out',
        'fade': 'opacity 0.2s ease-in-out',
        'slide': 'transform 0.2s ease-in-out',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce 1s ease-in-out infinite',
      },
      colors: {
        dark: {
          bg: 'rgb(15 23 42)',
          card: 'rgb(30 41 59)',
          border: 'rgb(51 65 85)',
          text: 'rgb(248 250 252)',
        }
      }
    },
  },
  plugins: [],
}

