Getting the full CSS class list for [issue 8592](https://github.com/cypress-io/cypress/issues/8592)

<!-- fiddle -->

```html
<div class="profiler__header">
  <div class="c-accordion c-accordion-active collapsed" id="accordion">
    things inside
  </div>
</div>
```

```js
cy.get('#accordion').then($el => {
  console.log($el)
  console.log('class name "%s"', $el[0].className)
})
```

<!-- fiddle-end -->
