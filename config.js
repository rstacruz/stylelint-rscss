module.exports = {
  plugins: [
    require.resolve('./index')
  ],
  rules: {
    'rscss/no-descendant-operator': 'always',
    'rscss/component-name-format': true
  }
}
