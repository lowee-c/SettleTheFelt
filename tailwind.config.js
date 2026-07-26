/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme="day"]'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        felt: {
          DEFAULT: 'var(--felt)',
          deep: 'var(--felt-deep)',
        },
        card: 'var(--card)',
        ink: {
          DEFAULT: 'var(--ink)',
          soft: 'var(--ink-soft)',
        },
        gold: {
          DEFAULT: 'var(--gold)',
          deep: 'var(--gold-deep)',
        },
        win: 'var(--win)',
        loss: 'var(--loss)',
        rail: 'var(--rail)',
        line: 'var(--line)',
      },
      boxShadow: {
        chip: '0 2px 0 rgba(0,0,0,0.25), 0 8px 20px -8px rgba(0,0,0,0.45)',
        card: '0 1px 0 rgba(255,255,255,0.4) inset, 0 12px 30px -14px rgba(0,0,0,0.55)',
      },
      borderRadius: {
        chip: '999px',
      },
    },
  },
  plugins: [],
}
