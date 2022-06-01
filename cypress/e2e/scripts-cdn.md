# Scripts from CDN

Using "cypress.json" file we can load additional scripts from CDN

<!-- fiddle.skip loads script resource -->

```html
<div class="alert alert-warning" role="alert">
  A simple warning alert—check it out!
</div>
```

```js
```

<!-- fiddle-end -->

Or you can include the markup directly in the single test

<!-- fiddle loads script via markup -->
<!-- fiddle-markup
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx" crossorigin="anonymous"></script>
-->

```html
<button type="button"
  class="btn btn-lg btn-danger"
  data-toggle="popover"
  title="Popover title"
  data-content="Pop!">Click to toggle popover</button>
<script>
  // because this fiddle loads bootstrap
  // it should have popover support
  $('[data-toggle="popover"]').popover()
</script>
```

```js
cy.get('button').click()
  .wait(1000)
// hmm, it is hard to check if the popover
// is shown because it is created outside
// of the "#live" container
```

<!-- fiddle-end -->
