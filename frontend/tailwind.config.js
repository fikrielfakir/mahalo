/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B1F3A',
          light: '#132d52',
          dark: '#071628',
        },
        gold: {
          DEFAULT: '#C8A97E',
          light: '#d4b896',
          dark: '#b8945f',
        },
        beige: {
          DEFAULT: '#F6F3EE',
          dark: '#ede9e0',
        },
        surface: '#F8F9FB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '28px',
      },
      boxShadow: {
        card: '0 4px 32px rgba(11, 31, 58, 0.08)',
        'card-hover': '0 16px 48px rgba(11, 31, 58, 0.16)',
        glass: '0 8px 32px rgba(11, 31, 58, 0.12)',
      },
      backdropBlur: {
        xs: '4px',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
