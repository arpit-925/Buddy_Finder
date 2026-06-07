/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
   theme: {
    extend: {
      colors: {
        primary: "#db2777", // pink-600 (sunset theme)
        accent: "#10b981",
        surface: "#ffffff",
        background: "#f8fafc",
        sunset: {
          coral: "#fb7185",
          peach: "#fdba74",
          amber: "#fbbf24",
          pink: "#ec4899",
          violet: "#8b5cf6",
          indigo: "#6366f1",
        },
      },
      backgroundImage: {
        "sunset-gradient":
          "linear-gradient(135deg, #fb923c 0%, #ec4899 45%, #7c3aed 100%)",
        "auth-hero":
          "linear-gradient(135deg, #fbbf24 0%, #fb7185 35%, #ec4899 65%, #7c3aed 100%)",
      },
    },
  },
  plugins: [],
};
