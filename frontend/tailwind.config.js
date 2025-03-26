/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}", // ✅ src/app 폴더 기준
    "./src/components/**/*.{js,ts,jsx,tsx}", // ✅ src/components 포함
    "./src/pages/**/*.{js,ts,jsx,tsx}", // ✅ src/pages 포함 (필요한 경우)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
