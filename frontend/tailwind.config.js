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
        'light-bg': '#f1f5f9', // slate-100
        'light-surface': '#ffffff', // white
        'light-elevated': '#fefefe', // Slightly lighter than surface for cards
        'light-primary': '#0ea5e9', // sky-500 (Azul vibrante)
        'light-accent': '#14b8a6', // teal-500 (Un color de acento para contrastar)
        'light-danger': '#ef4444', // red-500 (Rojo vibrante)
        'light-text': '#1e293b', // slate-800
        'light-text-secondary': '#64748b', // slate-500
        'light-success': '#22c55e', // green-500 (Para mensajes de éxito)
        'light-info': '#3b82f6', // blue-500 (Para mensajes informativos, si los necesitas)
        'light-warning': '#f59e0b', // amber-500 (Para advertencias)

        'dark-bg': '#0a0d14', // Even darker for a more futuristic feel
        'dark-surface': '#1e293b', // slate-800
        'dark-elevated': '#2d3748', // Darker blue-grey for cards
        'dark-primary': '#22d3ee', // cyan-400 (Azul neón)
        'dark-accent': '#67e8f9', // cyan-200 (Acento neón)
        'dark-danger': '#f43f5e', // rose-500 (Rojo neón)
        'dark-text': '#e2e8f0', // slate-200
        'dark-text-secondary': '#94a3b8', // slate-400
        'dark-success': '#4ade80', // green-400 (Para mensajes de éxito en dark mode)
        'dark-info': '#60a5fa', // blue-400 (Para mensajes informativos en dark mode)
        'dark-warning': '#fbbf24', // amber-400 (Para advertencias en dark mode)
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
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
        }
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out forwards', // Adjusted duration for snappier feel
        'gradient-pulse': 'gradient-pulse 6s ease infinite',
        'button-glow': 'button-glow 1.5s ease-in-out infinite alternate',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards', // Adjusted duration and easing
        // Optional: Animation for smooth exit
        'scale-out': 'scale-out 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards'
      },
    },
  },
  plugins: [
    forms,
  ],
}