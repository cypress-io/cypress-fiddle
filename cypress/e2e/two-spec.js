import { testExamples } from '../..'
import examples from './two'

beforeEach(() => {
  Cypress.env('cypress-fiddle', {
    stylesheets: [
      'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css'
    ],
    style: `
      body {
        padding: 1rem;
      }
    `
  })
})

testExamples(examples)
