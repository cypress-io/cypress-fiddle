/// <reference path="./index.d.ts" />

Cypress.Commands.add('runExample', ({ name, description, html, test }) => {
  const testTitle = name || cy.state('runnable').title

  expect(test, 'missing test source').to.be.a('string')

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

/**
 * Processes a tree of test definitions, each with HTML and JS
 * and makes each into a live test. See examples in "integration" folder.
 */
export const testExamples = maybeTest => {
  if (isTestObject(maybeTest)) {
    it(maybeTest.name, () => {
      cy.runExample(maybeTest)
    })
  } else {
    forEach(maybeTest, (value, name) => {
      console.log({ name, value })

      if (isTestObject(value)) {
        console.log('%s is a test', name)
        it(name, () => {
          cy.runExample(value)
        })
      } else {
        describe(name, () => {
          testExamples(value)
        })
      }
    })
  }
}
