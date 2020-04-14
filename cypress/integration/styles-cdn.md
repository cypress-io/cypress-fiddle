# Styles from CDN

<!-- fiddle loads style resource -->

<!-- fiddle-markup
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
<style>
body {
  padding: 2rem;
}
</style>
-->

```html
<div class="alert alert-warning" role="alert">
  A simple warning alert—check it out!
</div>
```

```js
// the live HTML should have CSS from external CSS resource
cy.get('.alert-warning').should('be.visible')
  // check if external CSS class was applied
  .and('have.css', 'background-color', 'rgb(255, 243, 205)')
```

<!-- fiddle-end -->
