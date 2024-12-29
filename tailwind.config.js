module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1D4ED8", // Blue color
        secondary: "#4B5563", // Gray color
      },
      fontSize: {
        sm: "0.875rem", // Small text
        base: "1rem", // Normal text
        lg: "1.25rem", // Large text
      },
      animation: {
        "fade-in": "fadeIn 1s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
