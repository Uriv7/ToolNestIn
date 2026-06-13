/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#edfcff',
          100: '#d6f6ff',
          200: '#b5f0ff',
          300: '#83e7ff',
          400: '#48d4ff',
          500: '#1eb3f0',
          600: '#068ecf',
          700: '#0271a8',
          800: '#075e8a',
          900: '#0c4f73',
          950: '#08324d',
        },
        dark: {
          900: '#060d16',
          800: '#0b1623',
          700: '#111f30',
          600: '#172840',
          500: '#1d3150',
        }
      },
      fontFamily: {
        display: ['var(--font-outfit)', 'sans-serif'],
        body: ['var(--font-outfit)', 'sans-serif'],
        mono: ['var(--font-fira)', 'monospace'],
      },
    },
  },
  plugins: [],
}
