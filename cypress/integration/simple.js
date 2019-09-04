import { source } from 'common-tags'

/**
 * A single test definition.
 */
export default {
  name: 'simple test',
  html: source`
    <div id="my-element">Hi there</div>
  `,
  test: source`
    cy.get('#my-element')
  `
}
