/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#8b5a2b',
          dark: '#5f3b1f',
          light: '#d4b07b',
          olive: '#9aa341'
        }
      },
      boxShadow: {
        glow: '0 10px 35px rgba(139, 90, 43, 0.18)'
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        }
      },
      animation: {
        shimmer: 'shimmer 2.5s linear infinite',
        floaty: 'floaty 5s ease-in-out infinite'
      }
    }
  },
  plugins: []
};
