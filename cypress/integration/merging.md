<!--
  this fiddle should create (inside top level describe "nested fiddles")

  describe("parent suite", () => {
    it("test A", () => {})
    it("test B", () => {})
  })
-->

<!-- fiddle parent suite / test A -->
```js
expect('test A').to.equal('test A')
// check the current test
expect(this.test.title, 'test title').to.equal('test A')
expect(this.test.parent.title, 'parent title').to.equal('parent suite')
expect(this.test.parent.tests.length, 'parent suite has 2 tests').to.equal(2)
```
<!-- fiddle-end -->

<!-- fiddle parent suite / test B -->
```js
expect('test B').to.equal('test B')
// check the current test
expect(this.test.title, 'test title').to.equal('test B')
expect(this.test.parent.title, 'parent title').to.equal('parent suite')
expect(this.test.parent.tests.length, 'parent suite has 2 tests').to.equal(2)
```
<!-- fiddle-end -->
