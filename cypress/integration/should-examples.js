import { source } from 'common-tags'

export default {
  'should callback': [
    {
      name: 'retries assertion',
      test: source`
        let x
        setTimeout(() => x = 'foo', 2000)

        cy.log('waiting for **x**')
        // to make sure we have a command before ".should()"
        // let's use cy.wrap()
        cy.wrap()
        // should(cb) retries the callback function
        // until all assertions pass, or it times out
        cy.should(() => {
          expect(x).to.equal('foo')
        })
      `
    },
    {
      name: 'retries assertion with custom timeout',
      only: false,
      test: source`
        let x
        // note that 5 seconds it longer than the default command retry timeout
        setTimeout(() => x = 'foo', 5000)

        cy.log('waiting for **x**')
        // should(cb) retries its callback function
        // as long as the previous command's timeout defines
        // (or the default command timeout)
        // we can even write command and assertion separately
        // yet they are still connected
        cy.wrap(null, {timeout: 5100})
        cy.should(() => {
          expect(x).to.equal('foo')
        })
      `
    }
  ]
}
