import { source } from 'common-tags'

// add different Cypress test examples we want to test
export default {
  'Cypress examples': {
    '.get()': {
      '.get()': {
        html: source`
          <div id="my-element">Hi there</div>
        `,
        test: source`
          cy.get('#my-element')
        `
      }
    }
  }
}
