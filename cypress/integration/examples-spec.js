import examples from './examples'

const { forEach } = Cypress._

const isTestObject = o => o.test

const processTest = maybeTest => {
  if (isTestObject(maybeTest)) {
    it(maybeTest.name, () => {
      cy.runExample(maybeTest.html, maybeTest.test)
    })
  } else {
    forEach(maybeTest, (value, name) => {
      console.log({ name, value })

      if (isTestObject(value)) {
        console.log('%s is a test', name)
        it(name, () => {
          cy.runExample(value.html, value.test)
        })
      } else {
        processTest(value)
      }
    })
  }
}

processTest(examples)
