const { defineConfig } = require('cypress')
const mdPreprocessor = require('./src/markdown-preprocessor')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('file:preprocessor', mdPreprocessor)
    },
    specPattern: 'cypress/e2e/**/*.js',
    excludeSpecPattern: ['examples.js', '*-examples.js'],
  },
})
