/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        Primary: "#7c3aed"
      }
    }
  },
    daisyui: {
    themes: ["light", "dark", "bussiness"],
  },
 plugins: [require('daisyui')],

}