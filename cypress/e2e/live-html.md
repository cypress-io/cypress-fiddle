# Live HTML

<!-- fiddle includes live html -->

<div id="live-block">Live Block</div>

```js
cy.contains('#live-block', 'Live Block').should('be.visible')
```
<!-- fiddle-end -->

<!-- fiddle includes html block -->
```html
<div id="my-block">Block</div>
```
```js
cy.contains('#my-block', 'Block').should('be.visible')
```
<!-- fiddle-end -->

<!-- fiddle includes both live and html block -->
```html
<div id="my-block">Block</div>
```

<div id="live-block">Live Block</div>

```js
// when including both live HTML block and
// html code block, the live HTML block wins
cy.contains('#live-block', 'Live Block').should('be.visible')
cy.contains('#my-block', 'Block').should('not.exist')
```
<!-- fiddle-end -->
