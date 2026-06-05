/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#f6efe2',
        paper: '#fff9f1',
        butter: '#f0ddb3',
        sage: '#cfd8c0',
        coral: '#dca08f',
        brown: '#8a614a',
        ink: '#4e4037',
        line: '#d4b393',
      },
      boxShadow: {
        paper: '0 18px 50px rgba(108, 78, 58, 0.14)',
      },
      borderRadius: {
        paper: '28px',
      },
    },
  },
  plugins: [],
}
