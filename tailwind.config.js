/**
 * Substitui o antigo tailwind.config que era declarado inline nas páginas,
 * junto do script cdn.tailwindcss.com. Os valores abaixo são os mesmos
 * que estavam no inline do index.html (superset do que as páginas de
 * noivas declaravam).
 *
 * Build:  npm run build:css
 */
module.exports = {
  content: [
    './index.html',
    './noivas/*.html',
    './js/**/*.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        stone: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
        'surface-light': '#EAEAE5',
      },
    },
  },
  plugins: [],
};
