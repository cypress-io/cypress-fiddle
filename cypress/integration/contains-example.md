## cy.contains example

Trying to check [https://twitter.com/Kmaschta/status/1189120060054540289](https://twitter.com/Kmaschta/status/1189120060054540289)

To run this fiddle in this repo:

```
npm run cy:md
```

Then click on "contains-example.md" spec file.

<!-- fiddle cy.contains one -->
```html
<div id="app">nothing here</div>
<script>
setTimeout(() => {
  document.getElementById('app').innerText = 'something'
}, 2000)
</script>
```

Here is a test

```js
cy.contains('#app', 'something')
// this command will only run AFTER cy.contains finishes
cy.get('#app').should('be.visible')
```

<!-- fiddle-end -->

<!-- fiddle split fiddle -->
This fiddle has common HTML code

```html
<div id="app">nothing here</div>
<script>
setTimeout(() => {
  document.getElementById('app').innerText = 'something'
}, 2000)
</script>
```

Then first assertion

```js
cy.contains('#app', 'something')
```

Then more test code here

```js
// this command will only run AFTER cy.contains finishes
cy.get('#app').should('be.visible')
```

<!-- fiddle-end -->
