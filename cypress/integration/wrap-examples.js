import { source } from 'common-tags'

const smallTests = [
  {
    name: 'first test',
    description: '[cy.wrap()](+https://on.cypress.io/wrap) example',
    test: `
      cy.wrap('hello').should('have.length', 5)
    `
  },
  {
    name: 'second test',
    only: false,
    description: '`cy.wrap() + cy.then()` example',
    test: `
        cy.wrap()
          .then(() => {
            cy.log('In .then')
          })
      `
  }
]

export default {
  'small tests': smallTests,
  'cy.wrap()': {
    'detects when property gets added to an object': {
      test: source`
        // an object without a property
        const o = {}
        // property "id" gets added after a delay
        setTimeout(() => {
          o.id = 'abc123'
        }, 500)
        // detects when property "id" get added to the object "o"
        cy.wrap(o).should('have.property', 'id')
      `
    },

    'detects when property has expected value': {
      test: source`
      // an object with an id
      const o = {
        id: 'initial'
      }
      // set "o.id" after delay
      setTimeout(() => {
        o.id = 'abc123'
      }, 500)
      // detects property "o.id" has specific value
      cy.wrap(o).should('have.property', 'id', 'abc123')
    `
    },

    'detects when property gets added and deleted from window object': {
      test: source`
      // asynchronously add and delete a property
      setTimeout(() => {
        window.customProp = 'here'
      }, 1000)
      setTimeout(() => {
        delete window.customProp
      }, 2000)

      cy.window().should('have.property', 'customProp')
      cy.window().should('not.have.property', 'customProp')
    `
    }
  }
}
