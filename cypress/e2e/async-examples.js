import { source } from 'common-tags'
export default [
  {
    name: 'async refresh of first item',
    description: 'Read https://on.cypress.io/retry-ability guide',
    html: source`
      <ul>
        <li data-cy="name">Bob</li>
        <li data-cy="name">Chris</li>
      </ul>
    `,
    test: source`
      // our application "fetches" data and changes the first item
      // from "Bob" to "Alice"
      setTimeout(() => {
        // simulate async change
        document.querySelector('li[data-cy=name]').innerText = 'Alice'
      }, 1000)

      // this retries until first item changes its text to "Alice"
      cy.contains('li[data-cy=name]:first', 'Alice')
    `
  }
]
