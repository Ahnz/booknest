import konstaConfig from "konsta/config";

export default konstaConfig({
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./src/index.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#ff864b",
          DEFAULT: "#ff6b22",
          dark: "#f85200",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
});
