import { source } from 'common-tags'

// one of the tests has a "only: true"
export default {
  'two tests': [
    {
      name: 'first test',
      test: source`
        // nothing really, just a demo
      `
    },
    {
      name: 'second test',
      description: 'another test',
      test: source`
        // nothing in the second test
      `
    }
  ]
}
