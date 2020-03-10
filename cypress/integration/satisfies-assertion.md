Chai [satisfy/satisfies](https://www.chaijs.com/api/bdd/#method_satisfy) assertion

<!-- fiddle satisfy -->

```html
<div id="greeting">  Hi!  </div>
```

```js
const textIs = (text) => text === 'Hi!'
cy.get('#greeting')
  .invoke('text')
  .invoke('trim')
  .should('satisfy', textIs, 'text is Hi!')
```

<!-- fiddle-end -->
