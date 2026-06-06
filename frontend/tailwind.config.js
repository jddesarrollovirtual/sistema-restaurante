/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta base del sistema
        background: {
          DEFAULT: '#05070E', // Fondo principal
          surface: '#0B1020', // Tarjetas/Paneles
          panel: '#111827',   // Componentes internos
        },
        primary: {
          DEFAULT: '#10b981', // Emerald principal
          hover: '#059669',
        },
        text: {
          DEFAULT: '#F8FAFC', // Blanco principal
          muted: '#94A3B8',  // Texto secundario
          dark: '#64748B',    // Texto deshabilitado/placeholder
        }
      },
    },
  },
  plugins: [],
}
