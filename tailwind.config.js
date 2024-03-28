/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      width: {
        '175': '700px',
      },
      colors: {
        darkLayoutColor: '#121212',
        darkBackgroundColor: '#1e293b',
        darkWhiteContentColor: 'rgba(255,255,255,0.77)',
        darkBorderColor: '#6b7280',
        primaryColor: '#5458F7',
        layoutColor: '#f3f3f3',
      }
    },
  },
  darkMode: 'class',
  plugins: [],
}

