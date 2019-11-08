# Hidden fiddle

Imagine this is a "normal" Markdown page. Can we embed a Cypress test _inside the Markdown_ that is hidden by default? Sure we can - using GitHub-flavored Markdown `<details>` section.

<details>
<summary>Cypress test for the current page</summary>
<!--
  make sure to have a blank line before the code block,
  otherwise code block is not properly rendered
-->
<!-- fiddle -->

```js
expect('foo').to.equal('foo')
```

<!-- fiddle-end -->
</details>
