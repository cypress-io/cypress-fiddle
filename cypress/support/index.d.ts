/// <reference types="cypress" />

type HTML = string
type JavaScript = string

interface RunExampleOptions {
  name?: string,
  description?: string,
  html?: HTML,
  test: JavaScript
}

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to generate a runnable test from HTML and JavaScript.
     */
    runExample(options: RunExampleOptions): Chainable<void>
  }
}
