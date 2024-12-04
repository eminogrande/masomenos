/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
        },
        dark: {
          900: '#1C1B1F',
          800: '#2A2A2D',
          700: '#323236',
        }
      },
      borderRadius: {
        xl: '1rem',
      }
    },
  },
  plugins: [],
}