/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';
import tailwindcssForms from '@tailwindcss/forms';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark-blue': '#012E40',
        'brand-cyan': '#03738C',
        'brand-teal': '#00BC99',
        'brand-white': '#FFFFFF',
        'brand-black': '#000000',
      },
      fontFamily: {
        sans: ['Encode Sans', ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #012E40, #00BC99)',
      }
    },
  },
  plugins: [
    tailwindcssForms,
  ],
}