const fs = require('fs')
const path = require('path')
const { source } = require('common-tags')
const { parse } = require('@textlint/markdown-to-ast')
const tempWrite = require('temp-write')
const cyBrowserify = require('@cypress/browserify-preprocessor')()
const debug = require('debug')('@cypress/fiddle')

const testExamplesPath = path.join(__dirname, '.')

/**
 * Finds optional fiddle name from the comment line
 * `<!-- fiddle my name -->` returns "my name".
 */
const findFiddleName = commentLine => {
  const matches = /fiddle(?:\.only|\.skip)? (.+)-->/.exec(commentLine)
  if (matches && matches.length) {
    return matches[1].trim()
  }
}

const isFiddleOnly = (line) => line.startsWith('<!-- fiddle.only ')
const isFiddleSkip = (line) => line.startsWith('<!-- fiddle.skip ')

/**
 * Checks if the given line starts with "<!-- fiddle" or one of its variations.
 */
const isFiddleStartLine = (line) => {
  return line.startsWith('<!-- fiddle ') || isFiddleOnly(line) || isFiddleSkip(line)
}

/**
  Parses Markdown file looking for special fiddle comments. If found,
  creates separate tests from them. If processing ".js" or ".coffee" files just
  calls Cypress Browserify preprocessor.

  ```
  const mdPreprocessor = require('@cypress/fiddle/src/markdown-preprocessor')
  module.exports = (on, config) => {
    on('file:preprocessor', mdPreprocessor)
  }
  ```
*/
const mdPreprocessor = file => {
  const { filePath, outputPath, shouldWatch } = file

  if (filePath.endsWith('.js') || filePath.endsWith('.coffee')) {
    return cyBrowserify(file)
  }

  debug({ filePath, outputPath, shouldWatch })
  const md = fs.readFileSync(filePath, 'utf8')

  const lines = md.split('\n')
  const fiddles = []

  let start = 0
  let startLine
  do {
    debug('start with %d', start)
    start = lines.findIndex(
      (line, k) => k >= start && isFiddleStartLine(line)
    )
    if (start === -1) {
      break
    }

    startLine = lines[start]
    const defaultFiddleName = `fiddle at line ${start + 1}`
    const testName = findFiddleName(startLine) || defaultFiddleName

    const end = lines.indexOf('<!-- fiddle-end -->', start)
    if (end === -1) {
      break
    }

    const fiddle = lines.slice(start + 1, end).join('\n')
    // console.log('found fiddle')
    // console.log('----')
    // console.log(fiddle)
    // console.log('----')
    fiddles.push({
      name: testName,
      fiddle,
      only: isFiddleOnly(startLine),
      skip: isFiddleSkip(startLine),
    })

    start = end + 1
  } while (true)

  // const fiddleRegex = /<!-- fiddle -->\n()<!-- fiddle-end -->\n/
  // const matches = fiddleRegex.exec(md)
  // console.log('matches')
  // console.log(matches)
  debug('found %d fiddles in file %s', fiddles.length, filePath)
  debug(fiddles)
  // list of fiddles converted into JavaScript
  const testFiddles = []
  fiddles.forEach(fiddle => {
    const ast = parse(fiddle.fiddle)
    // console.log('markdown fiddle AST')
    // console.log(ast)
    const htmlMaybe = ast.children.find(
      n => n.type === 'CodeBlock' && n.lang === 'html'
    )
    // console.log('found html block?', htmlMaybe)
    const isJavaScript = n =>
      n.type === 'CodeBlock' && (n.lang === 'js' || n.lang === 'javascript')

    // a single fiddle can have multiple JS blocks
    // we want to find them all and merge into a single test
    const jsMaybe = ast.children.filter(isJavaScript)

    if (jsMaybe.length) {
      const testCode = jsMaybe.map(b => b.value).join('\n')
      testFiddles.push({
        name: fiddle.name,
        test: testCode,
        html: htmlMaybe ? htmlMaybe.value : null,
        only: fiddle.only,
        skip: fiddle.skip
      })
    }
  })

  // console.log(testFiddles)
  debug('Found fiddles: %d', testFiddles.length)

  const specSource = source`
      const fiddles = ${JSON.stringify(testFiddles, null, 2)}
      import { testExamples } from '${testExamplesPath}'
      testExamples(fiddles)
    `
  // console.log(specSource)
  const writtenTempFilename = tempWrite.sync(
    specSource,
    path.basename(filePath) + '.js'
  )
  debug('wrote temp file', writtenTempFilename)

  return cyBrowserify({
    filePath: writtenTempFilename,
    outputPath,
    // since the file is generated once, no need to watch it
    shouldWatch: false,
    on: file.on
  })
}

module.exports = mdPreprocessor
