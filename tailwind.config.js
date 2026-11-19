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
          base: '#0B0B0E',
          dark: '#08080B',
          darker: '#050507',
          card: 'rgba(22, 22, 29, 0.78)',
          cardHover: 'rgba(30, 30, 42, 0.92)',
          border: 'rgba(84, 28, 47, 0.55)',
          borderSubtle: 'rgba(212, 175, 55, 0.22)',
          cherry: '#8A1538',
          cherryVibrant: '#B8234B',
          cherryGlow: 'rgba(184, 35, 75, 0.35)',
          gold: '#D4AF37',
          goldLight: '#F5C542',
          goldGlow: 'rgba(212, 175, 55, 0.45)',
          text: '#F3F4F6',
          muted: '#9CA3AF',
          dim: '#6B7280'
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
