How to wait for a promise returned from user code

Answer to [this tweet](https://twitter.com/marcosberm/status/1310546004127756288)

<!-- fiddle wait for promise -->

```js
const myPromise = () => {
  return new Cypress.Promise((resolve) => {
    setTimeout(resolve, 1000, 'foo')
  })
}

// if you want Cypress test to wait for the promise
// returned from some function, use cy.wrap
// note: you don't need to do cy.wrap(null).then(() => myPromise())
// instead directly pass the promise instance into the cy.wrap
cy.wrap(myPromise()).should('equal', 'foo')
```

<!-- fiddle-end -->
