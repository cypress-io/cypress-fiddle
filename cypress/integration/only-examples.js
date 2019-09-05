import { source } from 'common-tags'

// one of the tests has a "only: true"
export default {
  'tests with .only': [
    {
      name: 'first test',
      test: source`
        // nothing really, just a demo
      `
    },
    {
      name: 'second test with only',
      description: 'This test has `only: true` property',
      only: true,
      test: source`
        // nothing in the second test
      `
    }
  ]
}
