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
          50:  '#eff8ff',
          100: '#dff0ff',
          200: '#b8e2ff',
          300: '#7accff',
          400: '#36b0fb',
          500: '#0c93f0',
          600: '#0073ce',
          700: '#005ba7',
          800: '#064d88',
          900: '#0b4171',
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
        display: ['Inter', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        '600': '600',
        '700': '700',
        '800': '800',
        '900': '900',
      },
      borderRadius: {
        'xl':  '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        'glow':      '0 0 40px rgba(12,147,240,0.15)',
        'glow-sm':   '0 0 20px rgba(12,147,240,0.1)',
        'card':      '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
      },
      animation: {
        'shimmer': 'shimmer 4s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shimmer: { to: { backgroundPosition: '200% center' } },
      },
    },
  },
  plugins: [],
};
