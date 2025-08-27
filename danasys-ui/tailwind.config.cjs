/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      xs: '420px',
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        lavender: {
          light: '#E7D9FB',
          DEFAULT: '#EADCFD',
          white: '#FFFFFF',
        },
        accent: {
          purple: '#8B5CF6',
          pink: '#EC4899',
          pastelBlue: '#93C5FD',
        },
        neutral: {
          gray700: '#374151',
          gray500: '#6B7280',
          gray200: '#E5E7EB',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
