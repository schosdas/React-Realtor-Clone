/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    // form ui 라이브러리 추가 (기본 스타일 변경)
    require("@tailwindcss/forms"),
  ],
};
