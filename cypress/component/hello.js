import { testExamples } from '../..'
import { source } from 'common-tags'
const tests = [
  {
    name: 'mount Hello component',
    description: 'Without passing any props',
    // maybe we could move the common code here
    // into the support file?
    // for now, no JSX
    test: source`
      const hello = React.createElement('div', null, 'Hello')
      mount(hello)
      cy.contains('Hello').should('be.visible')
    `,
  },
]
testExamples(tests)
