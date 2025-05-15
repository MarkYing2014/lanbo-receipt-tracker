module.exports = {
  plugins: {
    'postcss-import': {},
    '@tailwindcss/postcss': {},
    'autoprefixer': {},
    'postcss-focus-visible': {},
    'postcss-flexbugs-fixes': {},
    'postcss-preset-env': {
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
      features: {
        'custom-properties': false,
        'nesting-rules': true,
      },
    },
  },
}
