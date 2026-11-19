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
          card: 'rgba(22, 22, 29, 0.88)',
          cardHover: 'rgba(30, 30, 42, 0.95)',
          border: 'rgba(212, 175, 55, 0.45)',
          borderSubtle: 'rgba(212, 175, 55, 0.30)',
          cherry: '#8A1538',
          cherryVibrant: '#B8234B',
          cherryGlow: 'rgba(184, 35, 75, 0.45)',
          gold: '#D4AF37',
          goldLight: '#FDE047',
          goldGlow: 'rgba(212, 175, 55, 0.60)',
          text: '#FFFFFF',
          muted: '#E2E8F0',
          dim: '#CBD5E1'
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
