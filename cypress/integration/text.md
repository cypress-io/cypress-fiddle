# Text examples

this is some test

<!-- fiddle -->
this is a fiddle with a test.

```html
<div>Hello</div>
```

```js
cy.contains('Hello').should('be.visible')
```

<!-- fiddle-end -->

Some text between the fiddles

<!-- fiddle Second fiddle -->
Second fiddle here

```html
<div>Bye</div>
```

```js
cy.contains('Bye').should('be.visible')
```
<!-- fiddle-end -->

after fiddle

<!-- fiddle-no -->
fiddle B 1
fiddle B 2
<!-- fiddle-end -->

Another `should(cb)` example where we use `cy.wrap` with a custom timeout option to make sure the callback function retries for a longer period.

<!-- fiddle Custom timeout -->
```js
let x
// note that 5 seconds it longer than the default command retry timeout
setTimeout(() => x = 'foo', 5000)

cy.log('waiting for **x**')
// should(cb) retries its callback function
// as long as the previous command's timeout defines
// (or the default command timeout)
// we can even write command and assertion separately
// yet they are still connected
cy.wrap(null, {timeout: 5100})
cy.should(() => {
  expect(x).to.equal('foo')
})
```
<!-- fiddle-end -->
