import { source } from 'common-tags'

// a suite of tests can have list of objects
export default {
  tests: [
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
