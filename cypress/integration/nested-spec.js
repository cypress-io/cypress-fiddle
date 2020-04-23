import { source } from 'common-tags'
import { testExamples } from '../..'

const examples = {
  "nested": [
    {
      "parentSuite": [
        {
          "name": "test itself",
          "test": source`
            expect('fiddle').to.equal('fiddle');
            // check the current test
            expect(this.test.title, 'test title').to.equal('test itself')
            expect(this.test.parent.title, 'parent title').to.equal('parentSuite')
            expect(this.test.parent.parent.title, 'root title').to.equal('nested')
          `,
          "html": null,
          "commonHtml": null,
          "only": false,
          "skip": false,
          "export": false
        }
      ]
    }
  ]
}

testExamples(examples)
