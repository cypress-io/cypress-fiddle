# Add list item

In this example, we do not know how many items are in the list initially. After clicking a button we want to confirm that the list has increased by one item.

<!-- fiddle "Adds an item" -->
```html
<ol id="list">
  <li>first</li>
  <li>second</li>
</ol>
<button id="add">Add an item</button>
<script>
let list = document.getElementById('list')
document.getElementById('add').addEventListener('click', () => {
  const li = document.createElement('li')
  li.textContent = 'added'
  list.appendChild(li)
})
</script>
```

```js
// we do not know how many items are in the list
// so first we need to find out and store this information
let N = 0
cy.get('#list li').its('length').then(n => {
  N = n
  // we can even confirm there are a few items if needed
  expect(N).to.be.gt(0)
})
// now add an item
cy.get('#add').click()
  .then(() => {
    // by the time this callback runs the N value is set
    // and we can use it directly in the assertion
    cy.get('#list li').should('have.length', N + 1)
  })
```
<!-- fiddle.end -->
