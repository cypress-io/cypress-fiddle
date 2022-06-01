import { source } from 'common-tags'

// a suite of tests can have list of test objects
// and they should all just go into the root suite
export default [
  {
    name: 'first test',
    test: source`
      // nothing really, just a demo
    `
  },
  {
    name: 'second test',
    test: source`
      // nothing in the second test
    `
  }
]
