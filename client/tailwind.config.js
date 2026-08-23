/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#090d16',
          card: 'rgba(15, 23, 42, 0.75)',
          border: 'rgba(56, 189, 248, 0.2)',
          glow: '#00f0ff',
          neon: '#3b82f6',
          cyan: '#06b6d4',
          accent: '#8b5cf6',
          danger: '#ef4444',
          warning: '#f59e0b',
          success: '#10b981'
        }
      },
      backgroundImage: {
        'cyber-grid': "radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.12) 0%, transparent 60%), linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
        'glow-gradient': "linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)"
      },
      backgroundSize: {
        'grid': '40px 40px'
      },
      boxShadow: {
        'neon': '0 0 20px rgba(6, 182, 212, 0.4), inset 0 0 10px rgba(6, 182, 212, 0.2)',
        'neon-red': '0 0 20px rgba(239, 68, 68, 0.4), inset 0 0 10px rgba(239, 68, 68, 0.2)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-spin': 'radar 4s linear infinite',
        'cyber-glow': 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(6, 182, 212, 0.3)' },
          '100%': { boxShadow: '0 0 25px rgba(6, 182, 212, 0.8), 0 0 40px rgba(59, 130, 246, 0.5)' }
        }
      }
    },
  },
  plugins: [],
}
