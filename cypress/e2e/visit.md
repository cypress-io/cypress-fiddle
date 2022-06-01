# Testing external site

This fiddle visits [example.cypress.io](https://example.cypress.io)

<!-- fiddle visit -->

```js
cy.visit('https://example.cypress.io')
cy.contains('h1', 'Kitchen Sink').should('be.visible')
```

<!-- fiddle-end -->
