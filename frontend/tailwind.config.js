/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clv: {
          bg: '#0A0A0A',
          card: '#141414',
          surface: '#1A1A1A',
          border: '#2D2D2D',
          gold: '#D4AF37',
          'gold-light': '#F5E6AB',
          'gold-dark': '#A38218',
          'gold-glow': 'rgba(212, 175, 55, 0.25)',
          muted: '#9CA3AF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.2)',
        'gold-glow-lg': '0 0 45px rgba(212, 175, 55, 0.35)',
        'luxury': '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(212, 175, 55, 0.2)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F5E6AB 0%, #D4AF37 50%, #A38218 100%)',
        'dark-radial': 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.12) 0%, rgba(10, 10, 10, 1) 70%)',
        'glass-card': 'linear-gradient(180deg, rgba(26, 26, 26, 0.7) 0%, rgba(14, 14, 14, 0.85) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
}
