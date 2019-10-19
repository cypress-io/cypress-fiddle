const fs = require('fs')
const path = require('path')
const { source } = require('common-tags')
const { parse } = require('@textlint/markdown-to-ast')
const tempWrite = require('temp-write')
const cyBrowserify = require('@cypress/browserify-preprocessor')()

const testExamplesPath = path.join(__dirname, '..', '..')

/**
 * Finds optional fiddle name from the comment line
 * `<!-- fiddle my name -->` returns "my name".
 */
const findFiddleName = commentLine => {
  const matches = /fiddle (.+)-->/.exec(commentLine)
  if (matches && matches.length) {
    return matches[1].trim()
  }
}

module.exports = (on, config) => {
  on('file:preprocessor', file => {
    const { filePath, outputPath, shouldWatch } = file

    if (filePath.endsWith('.js')) {
      // TODO apply default ES6 preprocessor
      return cyBrowserify(file)
    }

    console.log({ filePath, outputPath, shouldWatch })
    // return new Promise((resolve, reject) => {
    const md = fs.readFileSync(filePath, 'utf8')
    // console.log('----')
    // console.log(md)
    // console.log('----')

    const lines = md.split('\n')
    const fiddles = []

    let start = 0
    do {
      console.log('start with %d', start)
      start = lines.findIndex(
        (line, k) => k >= start && line.startsWith('<!-- fiddle ')
      )
      if (start === -1) {
        break
      }

      const testName =
        findFiddleName(lines[start]) || `fiddle at line ${start + 1}`

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
        fiddle
      })

      start = end + 1
    } while (true)

    // const fiddleRegex = /<!-- fiddle -->\n()<!-- fiddle-end -->\n/
    // const matches = fiddleRegex.exec(md)
    // console.log('matches')
    // console.log(matches)
    console.log('found %d fiddles in file %s', fiddles.length, filePath)
    console.log(fiddles)
    // list of fiddles converted into JavaScript
    const testFiddles = []
    fiddles.forEach(fiddle => {
      const ast = parse(fiddle.fiddle)
      console.log('markdown fiddle AST')
      console.log(ast)
      const htmlMaybe = ast.children.find(
        n => n.type === 'CodeBlock' && n.lang === 'html'
      )
      console.log('found html block?', htmlMaybe)
      const jsMaybe = ast.children.find(
        n => n.type === 'CodeBlock' && n.lang === 'js'
      )
      console.log('found js block?', jsMaybe)
      if (jsMaybe) {
        testFiddles.push({
          name: fiddle.name,
          test: jsMaybe.value,
          html: htmlMaybe ? htmlMaybe.value : null
        })
      }
    })

    console.log(testFiddles)

    const specSource = source`
      const fiddles = ${JSON.stringify(testFiddles, null, 2)}
      console.table(fiddles)
      import { testExamples } from '${testExamplesPath}'
      testExamples(fiddles)
    `
    console.log(specSource)
    const writtenTempFilename = tempWrite.sync(
      specSource,
      path.basename(filePath) + '.js'
    )
    console.log('wrote temp file', writtenTempFilename)

    return cyBrowserify({
      filePath: writtenTempFilename,
      outputPath,
      shouldWatch,
      on: file.on
    })
  })
}
