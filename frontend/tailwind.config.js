/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs:  '375px',
      sm:  '640px',
      md:  '768px',
      lg:  '1024px',
      xl:  '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
      '4xl': '2560px',
    },
    extend: {
      colors: {
        navy: {
          DEFAULT: '#730D26',
          light: '#9b1232',
          dark: '#4f0919',
        },
        gold: {
          DEFAULT: '#BA1932',
          light: '#d01e38',
          dark: '#9b1229',
        },
        softgold: '#D6B98C',
        champagne: '#E8D9C5',
        beige: {
          DEFAULT: '#F8F6F4',
          dark: '#EAE4DE',
          deeper: '#E0D8D0',
        },
        charcoal: '#1A1A1A',
        graphite: '#2A2A2A',
        surface: '#F8F6F4',
        rose: '#FF5A5F',
      },
      spacing: {
        'safe-top':    'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left':   'env(safe-area-inset-left)',
        'safe-right':  'env(safe-area-inset-right)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
        '5xl': '40px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(115,13,38,0.08), 0 1px 4px rgba(0,0,0,0.04)',
        'card-hover': '0 16px 48px rgba(115,13,38,0.16), 0 4px 12px rgba(0,0,0,0.06)',
        glass: '0 8px 32px rgba(115,13,38,0.10), inset 0 1px 0 rgba(255,255,255,0.6)',
        'glass-lg': '0 20px 60px rgba(115,13,38,0.15), inset 0 1px 0 rgba(255,255,255,0.5)',
        glow: '0 0 30px rgba(186,25,50,0.28)',
        'glow-lg': '0 0 60px rgba(186,25,50,0.38)',
        float: '0 24px 64px rgba(115,13,38,0.22)',
        burgundy: '0 8px 32px rgba(115,13,38,0.30)',
        luxury: '0 10px 40px rgba(115,13,38,0.12)',
        'luxury-hover': '0 20px 60px rgba(115,13,38,0.20)',
      },
      backdropBlur: {
        xs: '4px',
        sm: '8px',
        DEFAULT: '16px',
        md: '20px',
        lg: '32px',
        xl: '48px',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
        shimmer: 'shimmer 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.85' },
        },
      },
      backgroundImage: {
        'shimmer': 'linear-gradient(90deg, #ede8e4 25%, #e2dcd8 50%, #ede8e4 75%)',
        'burgundy-gradient': 'linear-gradient(135deg, #730D26 0%, #BA1932 100%)',
        'luxury-dark': 'linear-gradient(135deg, #1a0208 0%, #0d0208 100%)',
        'warm-ivory': 'linear-gradient(180deg, #F8F6F4 0%, #F2EDE8 100%)',
      },
    },
  },
  plugins: [],
}
