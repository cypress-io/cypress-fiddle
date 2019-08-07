// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="Cypress" />

import { source } from 'common-tags'

Cypress.Commands.add('runExample', (html, test) => {
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
      <h1>Test code</h1>

      <pre><code class="javascript">${test}</code></pre>

      <h1>HTML</h1>
      <div id="html">
      <pre><code class="html">${Cypress._.escape(html)}</code></pre>
      </div>

      <h1>Live HTML</h1>
      <div id="live">
      ${html}
      </div>
    </body>
  `
  const document = cy.state('document')
  document.write(appHtml)
  document.close()

  const noLog = { log: false }
  cy.get('#live', noLog).within(noLog, () => {
    eval(test)
  })
})

context('Cypress example', () => {
  describe('.get()', () => {
    it('.get()', function () {
      const html = source`
        <div id="my-element">Hi there</div>
      `

      const test = source`
        cy.get('#my-element')
      `

      cy.runExample(html, test)
    })
  })

  describe('.then()', () => {
    it('invokes a callback function with the current subject', () => {
      const html = source`
        <ul class="connectors-list">
          <li>Walk the dog</li>
          <li>Feed the cat</li>
          <li>Write JavaScript</li>
        </ul>
        `

      const test = source`
        cy.get('.connectors-list > li')
          .then(($lis) => {
            expect($lis, '3 items').to.have.length(3)
            expect($lis.eq(0), 'first item').to.contain('Walk the dog')
            expect($lis.eq(1), 'second item').to.contain('Feed the cat')
            expect($lis.eq(2), 'third item').to.contain('Write JavaScript')
          })
      `

      cy.runExample(html, test)
    })

    context('searching for cell', () => {
      const html = source`
        <table>
          <tr><td>A1</td><td>A2</td><td><button onclick="alert('A3')">A3</button></td></tr>
          <tr><td>B1</td><td>B2</td><td><button onclick="alert('B3')">B3</button></td></tr>
          <tr><td>C1</td><td>C2</td><td><button onclick="alert('C3')">C3</button></td></tr>
        </table>
        `

      it('finds row with a cell that has B2 text and checks last cell', () => {
        const test = source`
          cy.get('table')
            .find('tr:contains("B2")')
            .find('td') // finds 3 TD elements in this row
            .eq(2) // 3rd TD element
            .find('button')
            .should('have.attr', 'onclick')
        `

        cy.runExample(html, test)
      })

      it('finds row using $.each', () => {
        const test = source`
          cy.get('table tr')
            .should('have.length', 3)
            .then($trs => {
              $trs.each((k, tr) => {
                if (Cypress.$(tr).text().includes('B2')) {
                  // yield this "TR" element and stop ".each" iteration
                  cy.wrap(tr)
                  return false
                }
              })
            })
            .contains('button', 'B3')
        `

        cy.runExample(html, test)
      })

      it('finds row using cy.contains', () => {
        const test = source`
          cy.get('table tr')
            .should('have.length', 3)
            .contains('td', 'B2')
            .parent('tr')
            .contains('button', 'B3')
        `
        cy.runExample(html, test)
      })
    })
  })
})
