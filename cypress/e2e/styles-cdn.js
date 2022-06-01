/// <reference types="../.." />

import { source } from 'common-tags'

it('adds common HTML markup', function () {
  const commonHtml = source`
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
      integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <style>
    body {
      padding: 1rem;
    }
    </style>
  `

  const html = source`
    <div class="alert alert-success" role="alert">
      A simple success alert—check it out!
    </div>
  `

  // bootstrap alert-success elements should have nice greenish backgrounds
  const test = source`
    cy.get('.alert-success').should('be.visible')
      .and('have.css', 'background-color', 'rgb(212, 237, 218)')
  `

  cy.runExample({ commonHtml, html, test })
})
