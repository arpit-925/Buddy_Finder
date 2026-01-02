/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
   theme: {
    extend: {
      colors: {
        primary: "#2563eb",   // blue-600
        accent: "#10b981",    // emerald-500
        surface: "#ffffff",
        background: "#f8fafc", // slate-50
      },
    },
  },
  plugins: [],
};
