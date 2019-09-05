/// <reference types="cypress" />

type HTML = string
type JavaScript = string

interface RunExampleOptions {
  name?: string,
  description?: string,
  html?: HTML,
  test: JavaScript,
  // skip and only are exclusive - they cannot be both set to true
  skip?: boolean,
  only?: boolean
}

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to generate a runnable test from HTML and JavaScript.
     */
    runExample(options: RunExampleOptions): Chainable<void>
  }
}
