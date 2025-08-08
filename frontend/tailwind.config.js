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
        /* Light Theme - Paleta Más Viva */
        'light-bg': '#ffffff',           /* Blanco puro */
        'light-surface': '#d1d8ff',      /* Azul más brillante y saturado */
        'light-elevated': '#a3c1ff',     /* Azul claro pero con intensidad */
        'light-primary': '#ff005c',      /* Rojo vibrante y neón */
        'light-accent': '#0099ff',       /* Azul eléctrico brillante */
        'light-danger': '#ff1c36',       /* Rojo neón más intenso */
        'light-text': '#0f0f0f',         /* Gris oscuro para máximo contraste */
        'light-text-secondary': '#383d47', /* Gris más oscuro pero saturado */
        'light-success': '#00ff19',      /* Verde fluorescente brillante */
        'light-info': '#0064ff',         /* Azul más brillante, casi cian */
        'light-warning': '#ffdb00',      /* Amarillo intenso, similar a oro */

        /* Dark Theme - Paleta Más Viva */
        'dark-bg': '#000000',            /* Negro puro para mayor contraste */
        'dark-surface': '#1d1f25',       /* Azul muy oscuro, casi negro, con toques de morado */
        'dark-elevated': '#2d3547',      /* Azul intenso con morado vibrante */
        'dark-primary': '#e1001a',       /* Rojo neón aún más saturado */
        'dark-accent': '#00f4ff',        /* Azul cian muy brillante */
        'dark-danger': '#ff2048',        /* Rojo eléctrico e intenso */
        'dark-text': '#ffffff',          /* Blanco puro para máxima claridad */
        'dark-text-secondary': '#b0b8c0', /* Gris pálido y frío */
        'dark-success': '#00ff66',       /* Verde muy brillante y saturado */
        'dark-info': '#0099ff',          /* Azul eléctrico fuerte */
        'dark-warning': '#ff4f00',       /* Naranja vibrante y neón */
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