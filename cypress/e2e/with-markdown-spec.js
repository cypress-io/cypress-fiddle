/// <reference types="../.." />

const test = {
  description:
    'This **test** has _markdown_, thanks to [safe-marked](+https://github.com/azu/safe-marked)',
  html: `
    <div>Hello</div>
  `,
  test: `
    cy.get('div').should('have.text', 'Hello')
  `
}

it('test with markdown', () => {
  cy.runExample(test)
})
