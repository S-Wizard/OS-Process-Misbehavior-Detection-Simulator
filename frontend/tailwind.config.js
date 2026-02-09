/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a", // Deep slate/black
        surface: "#111827",    // Slate-900
        primary: "#06b6d4",    // Cyan-500
        secondary: "#8b5cf6",  // Violet-500
        danger: "#f43f5e",     // Rose-500
        success: "#10b981",    // Emerald-500
        warning: "#f59e0b",    // Amber-500
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 10px currentColor' },
          '50%': { opacity: .5, boxShadow: '0 0 2px currentColor' },
        }
      }
    },
  },
  plugins: [],
}
