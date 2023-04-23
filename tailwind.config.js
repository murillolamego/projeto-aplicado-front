/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#45BBBD",
        hoverPrimary: "#45BBBDCC",
        hoverDark: "#ffffff1A",
        hoverLight: "#ffffff4d",
        secondary: "#f6ca38",
        hoverSecondary: "#f6ca38CC",
      },
      fontFamily: {
        chicle: ["'Chicle'", "cursive"],
      },
    },
  },
  plugins: [],
};

// #f8d152
