import { source } from 'common-tags'

// object with name and a list of tests
// should create single suite "list of tests"
// with all tests under it
export default {
  'list of tests': [
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
}
