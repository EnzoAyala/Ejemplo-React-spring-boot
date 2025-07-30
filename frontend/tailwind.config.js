/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms'; // Asegúrate de tener este plugin si lo usas

export default {
  darkMode: 'class', // ¡Importante! Habilita el modo oscuro basado en clases
  content: [
    "./index.html",
    // Busca clases de Tailwind en todos tus archivos React (JS, TS, JSX, TSX)
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta para el tema claro
        'light-bg': '#f1f5f9', // slate-100
        'light-surface': '#ffffff', // white
        'light-primary': '#0ea5e9', // sky-500 (Azul vibrante)
        'light-danger': '#ef4444', // red-500 (Rojo vibrante)
        'light-text': '#1e293b', // slate-800
        'light-text-secondary': '#64748b', // slate-500

        // Paleta para el tema oscuro
        'dark-bg': '#0f172a', // slate-900
        'dark-surface': '#1e293b', // slate-800
        'dark-primary': '#22d3ee', // cyan-400 (Azul neón)
        'dark-danger': '#f43f5e', // rose-500 (Rojo neón)
        'dark-text': '#e2e8f0', // slate-200
        'dark-text-secondary': '#94a3b8', // slate-400
      }
    },
  },
  plugins: [
    forms, // Si no usas formularios con estilos personalizados, puedes quitarlo
  ],
}