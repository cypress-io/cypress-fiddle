// @ts-check
const { source } = require('common-tags')
const debug = require('debug')('@cypress/fiddle')

const isTestObject = o => o.test

function generateTest (name, maybeTest) {
  if (typeof name !== 'string') {
    console.error(maybeTest)
    throw new Error('Test has no name ' + name)
  }

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
function generateSpecWorker (maybeTest, options) {
  let start = ''

  if (options.beforeHooksAtDepth === options.depth) {
    if (options.before ) {
      start = source`
        before(() => {
          cy.visit('${options.before}')
        })
      ` + '\n\n'
    } else if (options.beforeEach) {
      start = source`
        beforeEach(() => {
          cy.visit('${options.before}')
        })
      ` + '\n\n'
    }
  }

  if (isTestObject(maybeTest)) {
    debug('single test object')
    return start + generateTest(maybeTest.name, maybeTest)
  }

  if (Array.isArray(maybeTest)) {
    // console.log('list of tests')
    const sources = maybeTest.map(test => {
      if (isTestObject(test)) {
        return generateTest(test.name, test)
      } else {
        const nextCallOptions = {
          ...options,
          depth: options.depth + 1
        }
        return generateSpecWorker(test, nextCallOptions)
      }
    })
    return start + sources.join('\n\n')
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

    const nextCallOptions = {
      ...options,
      depth: options.depth + 1
    }

    // final choice - create nested suite of tests
    const inner = generateSpecWorker(value, nextCallOptions)
    return source`
      describe('${name}', () => {
        ${inner}
      })
    `
  })

  return start + sources.join('\n')
}

function generateSpec(maybeTest, options = {}) {
  const opts = {
    ...options,
    depth: 0
  }

  const specSource = generateSpecWorker(maybeTest, opts)
  const preamble = source`
    /// <reference types="cypress" />
  ` + '\n'
  return preamble + specSource
}

module.exports = { generateSpec }
