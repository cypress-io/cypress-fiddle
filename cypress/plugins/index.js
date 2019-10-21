const mdPreprocessor = require('../../src/markdown-preprocessor')

module.exports = (on, config) => {
  // find and run tests in JS or Markdown files
  on('file:preprocessor', mdPreprocessor)
}
