/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
   theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#2563EB", dark: "#1D4ED8" },
        teal: "#0D9488",
        accent: "#F59E0B",
        ink: "#0F172A",
        muted: "#64748B",
        line: "#E2E8F0",
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
        "ocean-gradient": "linear-gradient(135deg, #1D4ED8 0%, #0D9488 100%)",
        "auth-hero":
          "linear-gradient(135deg, #fbbf24 0%, #fb7185 35%, #ec4899 65%, #7c3aed 100%)",
      },
    },
  },
  plugins: [],
};
