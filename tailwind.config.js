/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFEFA',
          100: '#FFFDF5',
          200: '#FFF8EB',
          300: '#FEF0D6',
          400: '#FDE2B5',
          500: '#FCD495',
        },
        brand: {
          orange: '#FF5E1E',
          'orange-hover': '#E2490C',
          'orange-light': '#FFF0EB',
          chocolate: '#331B10',
          'chocolate-dark': '#211008',
          'chocolate-light': '#5A3828',
          'chocolate-soft': '#F4EFEB',
          yellow: '#F59E0B',
          'yellow-light': '#FEF3C7',
          berry: '#E11D48',
          'berry-light': '#FFE4E6',
          vanilla: '#FDF7E7',
          mint: '#10B981',
          'mint-light': '#D1FAE5',
        }
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        display: ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 24px -2px rgba(51, 27, 16, 0.06), 0 2px 8px -2px rgba(51, 27, 16, 0.04)',
        'card': '0 10px 30px -4px rgba(51, 27, 16, 0.08), 0 4px 12px -2px rgba(51, 27, 16, 0.03)',
        'hover': '0 20px 40px -6px rgba(255, 94, 30, 0.16), 0 8px 16px -4px rgba(51, 27, 16, 0.06)',
        'glow': '0 0 25px rgba(255, 94, 30, 0.35)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        }
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'pulse-slow': 'pulseSlow 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};
