Does [`cy.invoke`](https://on.cypress.io/invoke) retry?

<!-- fiddle -->

```js
let g = 'hello'
const o = {
  greeting () {
    return g
  }
}
setTimeout(() => {
  g = 'bye'
}, 1000)

// initially the o.greeting() should return "hello"
// and after 1 second should return "bye" the assertion expects
cy.wrap(o).invoke('greeting').should('equal', 'bye')
```

<!-- fiddle-end -->
