import { source } from 'common-tags'

/**
 * A single test definition.
 */
export default {
  name: 'simple test',
  description: `
    This is the simplest test possible. Just finds an element by ID.
  `,
  html: source`
    <div id="my-element">Hi there</div>
  `,
  test: source`
    cy.get('#my-element')
  `
}
