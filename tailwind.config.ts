import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        focus: '0 0 0 3px rgb(37 99 235 / 0.35)',
      },
    },
  },
  plugins: [],
} satisfies Config;
