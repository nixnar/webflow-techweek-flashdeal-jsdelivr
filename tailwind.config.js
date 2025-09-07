module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        graybackground: "rgba(143, 143, 143, 0.06)",
        grayBorder: "rgba(0, 0, 0, 0.21)",
        grayText: "rgba(255, 255, 255, 0.75)",
        brand: "#14E8FF",
        white40: "rgba(255, 255, 255, 0.4)",
      },
      fontFamily: {
        sans: ["Space Grotesk"],
      },
      screens: {
        mobile: { max: "1030px" },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],

  important: true,
};
