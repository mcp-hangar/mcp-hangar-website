/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
        'display': ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      colors: {
        'hangar': {
          'bg': '#0a0a0b',
          'surface': '#141416',
          'border': '#27272a',
          'muted': '#71717a',
          'text': '#fafafa',
          'accent': '#22c55e',
          'accent-dim': '#16a34a',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
