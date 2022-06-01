# How to read values from elements using `.each`?

<!-- fiddle read numbers -->

```html
<ul>
  <li>10</li>
  <li>5</li>
  <li>6</li>
</ul>
```

```js
const list = []
cy.get('li')
  .each($li => {
    list.push(parseInt($li.text()))
  })
  // by the time ".each" is finished
  // the list should have 3 numbers, let's grab it
  .wrap(list)
  .should('deep.equal', [10, 5, 6])
```

<!-- fiddle-end -->


<!-- fiddle read using custom command -->

```html
<ul>
  <li>10</li>
  <li>5</li>
  <li>6</li>
</ul>
```

```js
// alternative: using custom command
Cypress.Commands.add('grabList', (selector) => {
  const grabbedList = []
  cy.log(`grabList **${selector}**`)
  cy.get(selector)
    .each($li => {
      // let's not even parse anything
      grabbedList.push($li.text())
    })
    // yield the grabbed list using either wrap or then
    .then(() => grabbedList)
})
cy.grabList('li')
  .should('deep.equal', ['10', '5', '6'])
  // let's convert it
  .then(list => list.map(x => parseInt(x)))
  .should('deep.equal', [10, 5, 6])
```

<!-- fiddle-end -->
