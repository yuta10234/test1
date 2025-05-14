/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        black: '#000',
        white: '#fff',
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        primary: {
          500: '#000000',
          700: 'rgba(255, 255, 255, 0.1)',
        },
        secondary: {
          500: '#fff',
          700: '#000',
        },
        accent: {
          500: '#fff',
          700: '#000',
        },
        success: {
          500: '#fff',
          700: '#000',
        },
        warning: {
          500: '#fff',
          700: '#000',
        },
        error: {
          500: '#fff',
          700: '#000',
        },
        dark: {
          50: '#f5f5f5',
          100: '#e5e5e5',
          200: '#d4d4d4',
          300: '#a3a3a3',
          400: '#737373',
          500: '#404040',
          600: '#262626',
          700: '#171717',
          800: '#111',
          900: '#000',
        },
      },
      fontFamily: {
        sans: ['Segoe UI', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-blue': 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(17,17,17,0.9) 25%, rgba(34,34,34,0.85) 50%, rgba(51,51,51,0.8) 75%, rgba(68,68,68,0.75) 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(34,34,34,0.9) 0%, rgba(0,0,0,0.8) 100%)',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0,0,0,0.2), 0 2px 4px -1px rgba(0,0,0,0.1)',
        'card-hover': '0 10px 15px -3px rgba(0,0,0,0.3), 0 4px 6px -2px rgba(0,0,0,0.15)',
        'button': '0 2px 4px rgba(255,255,255,0.1)',
        'cuticle': 'inset 0 0 0 1px rgba(255,255,255,0.15), 0 0 0 1px rgba(255,255,255,0.15)',
        'cuticle-hover': 'inset 0 0 0 1px rgba(255,255,255,0.15), 0 0 0 1px rgba(255,255,255,0.15)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        buttonHover: {
          '0%': { 
            background: 'linear-gradient(135deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(64,64,64,1) 50%, rgba(64,64,64,1) 100%)',
            backgroundSize: '200% 200%',
            backgroundPosition: '0% 0%'
          },
          '100%': { 
            background: 'linear-gradient(135deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(64,64,64,1) 50%, rgba(64,64,64,1) 100%)',
            backgroundSize: '200% 200%',
            backgroundPosition: '100% 100%'
          }
        },
        buttonHoverOut: {
          '0%': { 
            background: 'linear-gradient(135deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(64,64,64,1) 50%, rgba(64,64,64,1) 100%)',
            backgroundSize: '200% 200%',
            backgroundPosition: '100% 100%'
          },
          '100%': { 
            background: 'linear-gradient(135deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(64,64,64,1) 50%, rgba(64,64,64,1) 100%)',
            backgroundSize: '200% 200%',
            backgroundPosition: '0% 0%'
          }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        slideIn: 'slideIn 0.5s ease-out forwards',
        shake: 'shake 0.5s ease-in-out',
        gradient: 'gradient 15s ease infinite',
        buttonHover: 'buttonHover 0.5s ease-out forwards',
        buttonHoverOut: 'buttonHoverOut 0.5s ease-out forwards'
      },
    },
  },
  plugins: [],
};