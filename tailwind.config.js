/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    interFontFeatures: {
      default: ['calt', 'liga', 'kern'],
      numeric: ['tnum', 'salt', 'ss02'],
      text: ['ss01', 'calt', 'liga', 'kern']
    },
    extend: {}
  },
  plugins: [
    require('tailwindcss-font-inter')({ // it's plugin's default settings
      a: -0.0223,
      b: 0.185,
      c: -0.1745,
      baseFontSize: 160,
      baseLineHeight: 1.5,
      importFontFace: true,
      disableUnusedFeatures: false
    }),
    require('@tailwindcss/typography')
  ]
};
