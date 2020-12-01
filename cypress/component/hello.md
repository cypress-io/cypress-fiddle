# Hello component

<!-- fiddle Hello -->
```js
const {mount} = require('cypress-react-unit-test')
const Hello = () => <div>Hello</div>
mount(<Hello />)
cy.contains('Hello')
```
<!-- fiddle-end -->
