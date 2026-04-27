/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#040705',
        surface: {
          DEFAULT: '#0a100c',
          hover: '#0e1a14',
          elevated: '#14251c',
        },
        border: {
          DEFAULT: 'rgba(0,255,157,0.08)',
          hover: 'rgba(0,255,157,0.18)',
        },
        primary: {
          DEFAULT: '#00ff9d',
          light: '#6effce',
          dark: '#00cc7d',
        },
        accent: {
          DEFAULT: '#8a2be2',
          light: '#ae6dff',
          dark: '#6a1bb2',
        },
        success: '#00f2ff',
        warning: '#ffcc00',
        danger: '#ff4d4d',
        text: {
          primary: '#f0f5f2',
          secondary: '#94a79f',
          muted: '#5a6e65',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
        'input': '10px',
        'badge': '9999px',
      },
      boxShadow: {
        'card': '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 1px rgba(0, 255, 157, 0.1)',
        'card-hover': '0 12px 48px rgba(0, 0, 0, 0.8), 0 0 15px rgba(0, 255, 157, 0.15)',
        'glow': '0 0 25px rgba(0, 255, 157, 0.35)',
        'glow-accent': '0 0 25px rgba(138, 43, 226, 0.25)',
        'neon': '0 0 10px rgba(0, 255, 157, 0.5), 0 0 20px rgba(0, 255, 157, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'aurora': 'aurora 15s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 25px rgba(0, 255, 157, 0.2)' },
          '50%': { boxShadow: '0 0 50px rgba(0, 255, 157, 0.4)' },
        },
        aurora: {
          'from': { backgroundPosition: '0% 50%' },
          'to': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}
