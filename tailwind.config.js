/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0070f3',
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc5fb',
          400: '#36a7f7',
          500: '#0070f3',
          600: '#0058dd',
          700: '#0046b8',
          800: '#003b96',
          900: '#00337c',
          dark: '#005bd1',
          light: '#3694ff',
        },
        secondary: {
          DEFAULT: '#00a8ff',
          50: '#f0faff',
          100: '#e0f5fe',
          200: '#bae8fd',
          300: '#7cd5fb',
          400: '#36bef7',
          500: '#00a8ff',
          600: '#0088dd',
          700: '#006eb8',
          800: '#005a96',
          900: '#004b7c',
        },
      },
    },
  },
  plugins: [],
}
