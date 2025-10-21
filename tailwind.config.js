/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        'primary': 'hsl(var(--color-primary) / <alpha-value>)',
        'accent': 'hsl(var(--color-accent) / <alpha-value>)',
        'secondary': 'hsl(var(--color-secondary) / <alpha-value>)',
        'base-background': 'hsl(var(--color-background) / <alpha-value>)',
        'text-primary': 'hsl(var(--color-text-primary) / <alpha-value>)',
        'text-secondary': 'hsl(var(--color-text-secondary) / <alpha-value>)'
      }
    },
  },
  plugins: [],
}