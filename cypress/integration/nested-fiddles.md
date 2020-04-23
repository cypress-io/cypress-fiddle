# nested fiddles

<!--
  this fiddle should create (inside top level describe "nested fiddles")

  describe("parent suite", () => {
    context("child suite", () => {
      it("test itself", () => {}
    })
  })
-->

<!-- fiddle parent suite / child suite / test itself -->
```js
expect('fiddle').to.equal('fiddle')
// check the current test
expect(this.test.title, 'test title').to.equal('test itself')
expect(this.test.parent.title, 'child suite').to.equal('child suite')
expect(this.test.parent.parent.title, 'parent suite').to.equal('parent suite')
expect(this.test.parent.parent.parent.title, 'top level suite').to.equal('nested fiddles')
```
<!-- fiddle-end -->
