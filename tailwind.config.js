/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/common/components/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/components/shop/components/showcase/*.{js,ts,jsx,tsx}',
    './src/components/cart/**/*.{js,ts,jsx,tsx}',
    './src/components/sign-in/**/*.{js,ts,jsx,tsx}',
    './src/components/sign-up/**/*.{js,ts,jsx,tsx}',
    './src/components/contact/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    // Ensure these match with .storybook/preview.js
    screens: {
      xs: '375px',
      sm: '600px',
      md: '900px',
      lg: '1200px',
      xl: '1536px',
    },
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
      serif: ['Garamond', 'serif'],
    },
    extend: {
      colors: {
        orange: '#E76033',
        blue: {
          500: '#1a73e8',
        },
        green: '#3CD53F',
        subHero: '#F3F3F3',
      },
      spacing: {
        128: '32rem',
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        '.primary_button': {
          borderRadius: '0.5rem',
          fontWeight: '400',
          backgroundColor: '#000',
          color: 'white',
          textAlign: 'center',
          padding: '0.5rem 0',
          margin: '0.5rem 0',
          display: 'block',
          width: '100%',
        },
        '.secondary_button': {
          borderRadius: '0.5rem',
          fontWeight: '400',
          backgroundColor: '#fff',
          color: 'black',
          textAlign: 'center',
          padding: '0.5rem 0',
          margin: '0.5rem 0',
          display: 'block',
          width: '100%',
          border: '1px solid black',
        },
        '.text_button': {
          borderRadius: '0.5rem',
          fontWeight: '400',
          backgroundColor: '#fff',
          color: 'black',
          textAlign: 'center',
          padding: '0.5rem 0',
          margin: '0.5rem 0',
          display: 'block',
          width: '100%',
        },
      });
    }),
  ],
};
