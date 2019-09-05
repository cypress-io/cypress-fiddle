/// <reference path="./index.d.ts" />

import 'cypress-pipe'

Cypress.Commands.add('runExample', options => {
  const { name, description, html, test } = options
  const testTitle = name || cy.state('runnable').title

  expect(test, 'must have test source').to.be.a('string')

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
  const descriptionHtml = description || ''

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
      <h1>${testTitle}</h1>
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
  cy.get('#live', noLog).within(noLog, () => {
    eval(test)
  })
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
export const testExamples = maybeTest => {
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

    // if (Array.isArray(value)) {
    //   console.log('list of tests inside value')
    //   value.forEach(test => {
    //     createTest(test.name, test)
    //   })
    //   return
    // }

    // final choice - create nested suite of tests
    console.log('creating new suite "%s"', name)
    describe(name, () => {
      testExamples(value)
    })
  })
}
