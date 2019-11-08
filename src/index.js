/// <reference path="./index.d.ts" />
// @ts-check

const { createMarkdown } = require('safe-marked')
const markdown = createMarkdown()

Cypress.Commands.add('runExample', options => {
  const { name, description, html, test } = options
  const testTitle = name || cy.state('runnable').title

  if (typeof test !== 'string' || !test) {
    expect(test, 'must have test source').to.be.a('string')
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
    ${html}
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
      <script charset="UTF-8" src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.9/highlight.min.js"></script>
      <script charset="UTF-8" src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.9/languages/javascript.min.js"</script>
      <script charset="UTF-8" src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.9/languages/html.min.js"</script>
      <script>hljs.initHighlightingOnLoad();</script>
    </head>
    <body>
      ${testTitle ? `<h1>${testTitle}</h1>` : ''}
      <div>${descriptionHtml}</div>
      <h2>Test code</h2>

      <pre><code class="javascript">${test}</code></pre>

      ${htmlSection}
    </body>
  `
    const document = cy.state('document')
    document.write(appHtml)
    document.close()

    // make sure when "eval" runs, the "window" in the test code
    // points at the application's iframe window object
    const window = cy.state('window')

    const noLog = { log: false }

    if (test.includes('cy.visit(')) {
      // really dummy way to see if the test code contains "cy.visit(...)"
      // because in that case we should not use "cy.within" or mount html
    }
    cy.get('#live', noLog).within(noLog, () => {
      eval(test)
    })
  } else {
    if (html) {
      throw new Error(
        'You have passed HTML block for this test, but also used cy.visit in the test, which one is it?'
      )
    }
    // run "full" test
    eval(test)
  }
})

const { forEach } = Cypress._

const isTestObject = o => o.test

const createTest = (name, test) => {
  name = name || test.name

  if (test.skip && test.only) {
    throw new Error(
      `Test "${name}" has both skip: true and only: true, which is impossible`
    )
  }

  if (test.skip) {
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

  it(name, () => {
    cy.runExample(test)
  })
}

/**
 * Processes a tree of test definitions, each with HTML and JS
 * and makes each into a live test. See examples in "integration" folder.
 */
const testExamples = maybeTest => {
  if (isTestObject(maybeTest)) {
    createTest(maybeTest.name, maybeTest)
    return
  }

  if (Array.isArray(maybeTest)) {
    console.log('list of tests')
    maybeTest.forEach(test => {
      createTest(test.name, test)
    })
    return
  }

  forEach(maybeTest, (value, name) => {
    console.log({ name, value })

    if (isTestObject(value)) {
      console.log('%s is a test', name)

      if (value.skip && value.only) {
        throw new Error(`Test ${name} has `)
      }

      createTest(name, value)
      return
    }

    // final choice - create nested suite of tests
    console.log('creating new suite "%s"', name)
    describe(name, () => {
      testExamples(value)
    })
  })
}

module.exports = { testExamples }
