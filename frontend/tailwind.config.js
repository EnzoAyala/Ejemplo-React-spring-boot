/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
  /* Light Theme */
  'light-bg': '#ffffff',
  'light-surface': '#f4f4f9',
  'light-elevated': '#dbeafe',
  'light-primary': '#ff005c',
  'light-accent': '#007bff',
  'light-danger': '#ef4444',
  'light-text': '#111827',
  'light-text-secondary': '#374151',
  'light-success': '#22c55e',
  'light-info': '#0ea5e9',
  'light-warning': '#facc15',

  /* Dark Theme */
  'dark-bg': '#0a0a0a',
  'dark-surface': '#1e293b',
  'dark-elevated': '#334155',
  'dark-primary': '#ff005c',
  'dark-accent': '#38bdf8',
  'dark-danger': '#f43f5e',
  'dark-text': '#f9fafb',
  'dark-text-secondary': '#94a3b8',
  'dark-success': '#22c55e',
  'dark-info': '#0ea5e9',
  'dark-warning': '#f97316',
}
,
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateX(-100%)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'gradient-pulse': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'button-glow': {
          '0%, 100%': { boxShadow: '0 0 5px var(--tw-shadow-color)' },
          '50%': { boxShadow: '0 0 20px var(--tw-shadow-color), 0 0 30px var(--tw-shadow-color)' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        // Optional: Keyframes for a smooth exit animation if you implement it
        'scale-out': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.7s ease-out forwards',
        'gradient-pulse': 'gradient-pulse 6s ease infinite',
        'button-glow': 'button-glow 1.5s ease-in-out infinite alternate',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'scale-out': 'scale-out 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards',
        'float': 'float 2s ease-in-out infinite'
      },
    },
  },
  plugins: [
    forms,
  ],
}