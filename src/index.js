/// <reference path="./index.d.ts" />
// @ts-check

const { createMarkdown } = require('safe-marked')
const markdown = createMarkdown()

Cypress.Commands.add('runExample', (options) => {
  const { name, description, commonHtml, html, test } = options
  const testTitle =
    name ||
    // @ts-ignore
    cy.state('runnable').title

  if (typeof test !== 'string' || !test) {
    expect(test, 'must have test source').to.be.a('string')
  }

  const fullLiveHtml = commonHtml ? commonHtml + '\n' + html : html

  const fiddleOptions = Cypress._.defaults({}, Cypress.env('cypress-fiddle'), {
    stylesheets: [],
    style: '',
    scripts: [],
  })

  // take a single stylesheet URL or a list
  let stylesheetsHtml = ''
  if (typeof fiddleOptions.stylesheets === 'string') {
    fiddleOptions.stylesheets = [fiddleOptions.stylesheets]
  }
  if (Array.isArray(fiddleOptions.stylesheets)) {
    stylesheetsHtml = fiddleOptions.stylesheets
      .map((url) => `<link rel="stylesheet" href="${url}">`)
      .join('\n')
  }

  // take a single script URL or a list
  let scriptsHtml = ''
  if (typeof fiddleOptions.scripts === 'string') {
    fiddleOptions.scripts = [fiddleOptions.scripts]
  }
  if (Array.isArray(fiddleOptions.scripts)) {
    scriptsHtml = fiddleOptions.scripts
      .map((url) => `<script src="${url}"></script>`)
      .join('\n')
  }

  let style = ''
  if (typeof fiddleOptions.style === 'string' && fiddleOptions.style) {
    style = `<style>\n${fiddleOptions.style}\n</style>`
  }

  // really dummy way to see if the test code contains "cy.visit(...)"
  // because in that case we should not use "cy.within" or mount html
  const isTestingExternalSite = test.includes('cy.visit(')
  if (!isTestingExternalSite) {
    const htmlSection = html
      ? `<h2>HTML</h2>
    <div id="html">
    <pre><code class="html">${Cypress._.escape(html)}</code></pre>
    </div>

    <h2>Live HTML</h2>
    <div id="live">
    ${fullLiveHtml}
    </div>
    `
      : `<div id="live"></div>
    `

    // TODO: allow simple markup, properly convert it
    const descriptionHtml = markdown(description || '')

    const appHtml = `
    <head>
      <meta charset="UTF-8">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.9/styles/github.min.css">
      ${stylesheetsHtml}
      ${style}
      <script src="https://code.jquery.com/jquery-3.5.0.min.js"
        integrity="sha256-xNzN2a4ltkB44Mc/Jz3pT4iU1cmeR0FkXs4pru/JxaQ="
        crossorigin="anonymous"></script>
      <script charset="UTF-8" src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.9/highlight.min.js"></script>
      <script>hljs.initHighlightingOnLoad();</script>
      ${scriptsHtml}
    </head>
    <body>
      ${testTitle ? `<h1>${testTitle}</h1>` : ''}
      <div>${descriptionHtml}</div>
      <h2>Test code</h2>

      <pre><code class="javascript">${Cypress._.escape(test)}</code></pre>

      ${htmlSection}
    </body>
  `

    // @ts-ignore
    const document = cy.state('document')

    // make sure when "eval" runs, the "window" in the test code
    // points at the application's iframe window object
    // @ts-ignore
    const window = cy.state('window')
    if (!window.Cypress) {
      // also set "window.Cypress" before loading "live" HTML
      // so when it runs, it can check if it's inside Cypress test
      window.Cypress = Cypress
    }

    document.write(appHtml)
    document.close()

    // compiling the Markdown to get the playground
    // often takes a few extra seconds on the first pass
    const noLog = { log: false, timeout: 10000 }

    if (test.includes('cy.visit(')) {
      // really dummy way to see if the test code contains "cy.visit(...)"
      // because in that case we should not use "cy.within" or mount html
    }
    cy.get('#live', noLog).within(noLog, () => {
      const insideFunction = '(function live() {\n' + test + '\n}).call(this)'
      eval(insideFunction)
    })
  } else {
    if (html) {
      throw new Error(
        'You have passed HTML block for this test, but also used cy.visit in the test, which one is it?',
      )
    }
    // run "full" test
    eval(test)
  }
})

const { forEach } = Cypress._

const isTestObject = (o) => 'test' in o

const createTest = (name, test) => {
  name = name || test.name
  if (!name) {
    console.error({ name, test })
    throw new Error('Could not determine test name from ' + name)
  }

  if (test.skip && test.only) {
    throw new Error(
      `Test "${name}" has both skip: true and only: true, which is impossible`,
    )
  }

  if (test.skip || test.export) {
    console.log('skipping test "%s"', name)
    it.skip(name, () => {
      cy.runExample(test)
    })
    return
  }

  if (test.only) {
    console.log('exclusive test "%s"', name)
    it.only(name, () => {
      cy.runExample(test)
    })
    return
  }

  it(name, function () {
    cy.runExample(test)
  })
}

/**
 * Processes a tree of test definitions, each with HTML and JS
 * and makes each into a live test. See examples in "integration" folder.
 */
const testExamples = (maybeTest) => {
  // for debugging
  // console.log('testExamples', { maybeTest })

  if (isTestObject(maybeTest)) {
    createTest(maybeTest.name, maybeTest)
    return
  }

  if (Array.isArray(maybeTest)) {
    // console.log('list of tests')
    maybeTest.forEach((test) => {
      if (isTestObject(test)) {
        createTest(test.name, test)
      } else {
        testExamples(test)
      }
    })
    return
  }

  forEach(maybeTest, (value, name) => {
    // console.log({ name, value })

    if (isTestObject(value)) {
      // console.log('%s is a test', name)

      if (value.skip && value.only) {
        throw new Error(`Test ${name} has both skip and only true`)
      }

      createTest(name, value)
      return
    }

    // final choice - create nested suite of tests
    // console.log('creating new suite "%s"', name)
    if (typeof name !== 'string') {
      console.error('Invalid test name (typeof %s): "%s"', typeof name, name)
      console.error({ maybeTest, value, name })
      throw new Error(`Invalid test name ${name}`)
    }

    describe(name, () => {
      testExamples(value)
    })
  })
}

module.exports = { testExamples }
