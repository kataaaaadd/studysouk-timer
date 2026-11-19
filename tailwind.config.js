/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./*.js"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          base: '#070709',
          dark: '#050507',
          darker: '#030304',
          card: 'rgba(18, 14, 18, 0.90)',
          cardHover: 'rgba(26, 20, 26, 0.96)',
          border: 'rgba(226, 232, 240, 0.22)',
          borderSubtle: 'rgba(226, 232, 240, 0.12)',
          cherry: '#7A0E27',
          cherryDark: '#4A0817',
          cherryVibrant: '#9E1838',
          cherryGlow: 'rgba(158, 24, 56, 0.45)',
          silver: '#E2E8F0',
          silverLight: '#FFFFFF',
          silverDim: '#CBD5E1',
          silverMuted: '#94A3B8',
          silverGlow: 'rgba(226, 232, 240, 0.40)',
          gold: '#E2E8F0',         // remapped to silver
          goldLight: '#FFFFFF',    // remapped to platinum white
          goldGlow: 'rgba(226, 232, 240, 0.40)',
          text: '#FFFFFF',
          muted: '#CBD5E1',
          dim: '#94A3B8'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        outfit: ['"Outfit"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      }
    }
  },
  plugins: [],
}
