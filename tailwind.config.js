/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        shield: {
          navy: '#0B132B',
          blue: '#1C2541',
          teal: '#00A896',
          cyan: '#028090',
          amber: '#F4A261',
          crimson: '#E63946',
          safe: '#2A9D8F',
          card: '#162238',
          cardBorder: '#273852'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
