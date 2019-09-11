/// <reference types="../.." />

import { source } from 'common-tags'
import { testExamples } from '../..'
import wrapExamples from './wrap-examples'

testExamples(wrapExamples)

context('Cypress example', () => {
  describe('.get()', () => {
    it('.get()', function () {
      const html = source`
        <div id="my-element">Hi there</div>
      `

      const test = source`
        cy.get('#my-element')
      `

      cy.runExample({ html, test })
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

      cy.runExample({ html, test })
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

        cy.runExample({ html, test })
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

        cy.runExample({ html, test })
      })

      it('finds row using cy.contains', () => {
        const test = source`
          cy.get('table tr')
            .should('have.length', 3)
            .contains('td', 'B2')
            .parent('tr')
            .contains('button', 'B3')
        `
        cy.runExample({ html, test })
      })
    })
  })

  describe('.as()', () => {
    it('saves values in the test context', () => {
      const html = source`
        <input id="first" value="101" />
        <input id="second" value="101" />
        <input id="third" value="101" />
      `

      const test = source`
        // save value from the first input element
        // as test context property "first"
        cy.get('#first').invoke('val').as('first')
        cy.get('#second').invoke('val').as('second')
        cy.get('#third').invoke('val').as('third')

        // now compare the saved values
        // note how we use ".then" to make sure the callback
        // function runs AFTER "cy.get" calls
        cy.then(function () {
          // use "function () {...}" to make sure "this" points
          // at the test context
          expect(this.first, 'first equals second').to.equal(this.second)
          expect(this.first, 'first equals third').to.equal(this.third)
        })
      `

      cy.runExample({ html, test })
      // cy.wait(5000)
      // cy.screenshot('my example', { log: true, capture: 'runner' })
    })
  })
})
