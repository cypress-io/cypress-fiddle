<!-- fiddle invoke on array -->
## Arrays

In the above examples, the subject was an object. `cy.invoke` also works on arrays and allows using numerical index to pick a function to run.

```javascript
const reverse = (s) => Cypress._.reverse(s)
const double = (n) => n * n
// picks function with index 1 and calls it with argument 4
cy.wrap([reverse, double]).invoke(1, 4).should('eq', 16)
```
<!-- fiddle-end -->
