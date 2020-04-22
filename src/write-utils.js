// @ts-check
const { source } = require('common-tags')
const debug = require('debug')('@cypress/fiddle')

const isTestObject = o => o.test

function generateTest (name, maybeTest) {
  let itName = 'it'
  if (maybeTest.skip) {
    itName = 'it.skip'
  } else if (maybeTest.only) {
    itName = 'it.only'
  }

  return source`
    ${itName}('${name}', () => {
      ${maybeTest.test}
    })
  `
}

/**
 * Processes a tree of test definitions, each with HTML and JS
 * and returns generated spec file source
 */
function generateSpec (maybeTest) {

  if (isTestObject(maybeTest)) {
    return generateTest(maybeTest.name, maybeTest)
  }

  if (Array.isArray(maybeTest)) {
    // console.log('list of tests')
    const sources = maybeTest.map(test => {
      return generateTest(test.name, test)
    })
    return sources.join('\n\n')
  }

  const sources = Object.keys(maybeTest).map((name) => {
    debug('generating test for name "%s"', name)
    const value = maybeTest[name]
    // console.log({ name, value })

    if (isTestObject(value)) {
      // console.log('%s is a test', name)

      if (value.skip && value.only) {
        throw new Error(`Test ${name} has both skip and only true`)
      }

      return generateTest(name, value)
    }

    // final choice - create nested suite of tests
    const inner = generateSpec(value)
    return source`
      describe('${name}', () => {
        ${inner}
      })
    `
  })

  return sources.join('\n')
}

module.exports = { generateSpec }
