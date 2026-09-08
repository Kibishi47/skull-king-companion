/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          light: '#f7f2e7',
          DEFAULT: '#ebdcc4',
          dark: '#d9c29d',
          deep: '#c4a67b',
          shadow: '#a68759',
        },
        ink: {
          pure: '#1e130c',
          DEFAULT: '#2d1e15',
          light: '#4a3627',
          faded: '#785f4c',
        },
        gold: {
          light: '#f2c968',
          DEFAULT: '#e5ab48',
          dark: '#c9933b',
          deep: '#966718',
        },
        wax: {
          light: '#c83838',
          DEFAULT: '#a62828',
          dark: '#8b1d1d',
          border: '#691212',
        },
        pirate: {
          black: '#18181b',
          wood: '#3b2518',
          ocean: '#1e3846',
          cyan: '#15757b',
          emerald: '#1a5c38',
          purple: '#5e2751',
          yellow: '#b58514',
        }
      },
      fontFamily: {
        pirate: ['"Cinzel Decorative"', 'MedievalSharp', 'Georgia', 'serif'],
        display: ['"Cinzel"', 'Georgia', 'serif'],
        sans: ['"Outfit"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'parchment': '0 4px 20px -2px rgba(45, 30, 21, 0.25), 0 2px 6px -1px rgba(45, 30, 21, 0.15)',
        'parchment-inner': 'inset 0 2px 6px rgba(45, 30, 21, 0.2)',
        'wax-seal': '0 4px 12px rgba(139, 29, 29, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
        'gold-glow': '0 0 15px rgba(229, 171, 72, 0.5)',
      }
    },
  },
  plugins: [],
}
