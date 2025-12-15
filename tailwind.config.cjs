/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './App.tsx',
    './index.tsx',
    './components/**/*.{ts,tsx}',
    './services/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        science: {
          950: '#050505',
          900: '#0a0a0a',
          800: '#171717',
          700: '#262626',
          600: '#404040',
          500: '#525252',
          400: '#737373',
          300: '#a3a3a3',
          200: '#d4d4d4',
          100: '#e5e5e5',
        },
        bio: {
          blue: '#00f2ff',
          green: '#00ff9d',
          red: '#ff2a6d',
          yellow: '#ffcc00',
          purple: '#b967ff',
        },
      },
      boxShadow: {
        'glow-blue': '0 0 15px -3px rgba(0, 242, 255, 0.3)',
        'glow-red': '0 0 15px -3px rgba(255, 42, 109, 0.3)',
      },
    },
  },
  plugins: [],
};
