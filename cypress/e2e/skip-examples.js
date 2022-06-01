import { source } from 'common-tags'

// one of the tests has a "skip: true"
export default {
  tests: [
    {
      name: 'skipped test',
      skip: true,
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
