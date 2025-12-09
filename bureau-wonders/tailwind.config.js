/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4DA3FF',
          blue: '#4DA3FF',
          darker: '#1877F2',
          dark: '#1877F2',
          light: '#EAF6FF',
        },
        neutral: {
          white: '#FFFFFF',
          snow: '#F7F9FC',
          'gray-dark': '#1A1A1A',
          gray: '#6B7280',
          'gray-light': '#E5E7EB',
          'gray-border': '#E5E7EB',
          mist: '#EAF6FF',
        },
        accent: {
          mist: '#EAF6FF',
          success: '#22C55E',
          warning: '#F59E0B',
          error: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
        '4xl': '6rem',
      },
      borderRadius: {
        sm: '0.75rem',
        md: '1rem',
        lg: '1.25rem',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
      },
      transitionDuration: {
        200: '200ms',
        300: '300ms',
        400: '400ms',
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-in',
        'slide-up': 'slideUp 400ms ease-out',
        'hover-lift': 'hoverLift 200ms ease',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        hoverLift: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-4px)' },
        },
      },
    },
  },
  plugins: [],
};
