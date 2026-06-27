import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#0A0A0A',
        charcoal: '#161616',
        ivory: '#F5F2EC',
        platinum: '#C8C8C8',
        silver: '#9B9B9B',
        cerulean: '#3B72B5',
        'cerulean-dark': '#2D5A8E',
      },
      fontFamily: {
        display: ['var(--font-bodoni)', 'Didot', '"Bodoni MT"', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        liftIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.55s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in': 'fadeIn 0.4s ease-out both',
        'lift-in': 'liftIn 0.3s ease-out both',
        'shimmer': 'shimmer 1.8s infinite linear',
      },
    },
  },
  plugins: [],
}
export default config
