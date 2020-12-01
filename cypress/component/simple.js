/// <reference types="cypress" />

// note: React and mount where set as globals in the support file
describe('simple', () => {
  it('has the right spec type', () => {
    expect(Cypress.spec).to.have.property('specType', 'component')
  })

  it('mounts the component', () => {
    const hello = React.createElement('div', null, 'Hello')
    mount(hello)
    cy.contains('Hello').should('be.visible')
  })

  it('mounts the component using JSX', () => {
    const Hello = () => <div>Hello</div>
    mount(<Hello />)
    cy.contains('Hello').should('be.visible')
  })
})
