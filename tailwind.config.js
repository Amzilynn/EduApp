/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'Cairo', 'sans-serif'],
        cairo: ['Cairo', 'Nunito', 'sans-serif'],
      },
      colors: {
        sun: '#FFD93D',
        sky: '#6BCB77',
        coral: '#FF6B6B',
        ocean: '#4D96FF',
        lavender: '#C77DFF',
      },
      borderRadius: {
        card: '20px',
        button: '50px',
        chip: '12px',
      }
    },
  },
  plugins: [],
}
