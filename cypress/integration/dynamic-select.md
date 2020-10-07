Example where a `<select>` element gets dynamic list

<!-- fiddle Dynamic select -->

```html
<select id="my-select"></select>

<script>
  // populate the select element dynamically
  const s = document.getElementById('my-select')
  const addOption = (x) => () => {
    s.innerHTML += `
      <option value=${x.toLowerCase()}>${x}</option>
    `
  }
  setTimeout(addOption('Alpha'), 500)
  setTimeout(addOption('Beta'), 1000)
  setTimeout(addOption('Gamma'), 1500)
</script>
```

```js
cy.get('#my-select option').should('have.length', 3)
// now that the select has 3 options, let's pick "Beta"
cy.get('#my-select').select('beta')
```

<!-- fiddle-end -->
