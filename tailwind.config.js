/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neo: {
          blue: '#155dfc',
          pink: '#fb64b6',
          green: '#00c758',
          yellow: '#fac800',
          orange: '#fe6e00',
          bg: '#fefce8'
        }
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px rgba(0,0,0,1)',
        'neo-lg': '8px 8px 0px 0px rgba(0,0,0,1)',
      }
    },
  },
  plugins: [],
}
