# Stubs

This question comes in [cypress-io/cypress/issues/5420](https://github.com/cypress-io/cypress/issues/5420).

## How to stub a getter props?

First, let's have an example stubbing a regular method

<!-- fiddle Stub method -->
```js
let count = 0;

const obj = {
  getCount () {
    return ++count;
  }
};

expect(obj.getCount()).to.equal(1)
expect(count).to.equal(1)

// now let's stub the getter function
cy.stub(obj, 'getCount').returns(10)
expect(obj.getCount()).to.equal(10)
```
<!-- fiddle-end -->

Now let's overwrite the property - replacing "getter" with our stub.

<!-- fiddle Stub getter -->
```js
let count = 0;

const obj = {
  get count() {
    return ++count;
  }
};

// original getter function returns 1
expect(obj.count).to.equal(1)
// because it has incremented "count" variable
expect(count).to.equal(1)

// replace getter with a stub that always returns 20
Object.defineProperty(obj, 'count', {
  get: cy.stub().returns(20)
})
expect(obj.count).to.equal(20)
// still remains the same
expect(count).to.equal(1)
```
<!-- fiddle-end -->

Seems [there is a problem in Sinon with props](https://github.com/sinonjs/sinon/issues/1018), thus I used `Object.defineProperty`. Since every test in Cypress is independent, you should make sure to NOT rely on a stub set in one test to remain in the other test, instead either cleaning it up, or recreating the object.
