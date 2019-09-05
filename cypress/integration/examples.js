import { source } from 'common-tags'

// add different Cypress test examples we want to test
export default {
  'Cypress examples': {
    '.get()': {
      '.get()': {
        html: source`
          <div id="my-element">Hi there</div>
        `,
        test: source`
          cy.get('#my-element')
        `
      }
    },
    'select input by label': {
      html: source`
        <label for="myinput">My Text</label>
        <input type="text" id="myinput" />
      `,
      test: source`
        // select input by ID
        cy.get('input#myinput')

        // a little function to select input by ID in the label
        const inputByLabelText = (text) =>
          cy.contains('label', text)
            .invoke('attr', 'for')
            .then(forInput => cy.get('input#' + forInput))

        // select first the label by text
        inputByLabelText('My Text')
          .should('be.visible')
      `
    },
    'select input by label using custom command': {
      html: source`
        <label for="myinput">My Text</label>
        <input type="text" id="myinput" />
      `,
      test: source`
        Cypress.Commands.add('inputByLabelText', (text) =>
          cy.contains('label', text)
            .invoke('attr', 'for')
            .then(forInput => cy.get('input#' + forInput))
        )
        cy.inputByLabelText('My Text')
          .should('be.visible')
      `
    },
    'within row scope': {
      html: source`
        <table>
          <tr>
            <td>My first client</td>
            <td>My first project</td>
            <td>0</td>
            <td>Active</td>
            <td><button>Edit</button></td>
          </tr>
        </table>
      `,
      test: source`
        cy.contains('My first client').parent('tr').within(() => {
          cy.get('td').eq(1).should('contain', 'My first project')
          cy.get('td').eq(2).should('contain', '0')
          cy.get('td').eq(3).should('contain', 'Active')
          cy.get('td').eq(4).should('contain', 'Edit').find('button').click()
        })
      `
    },
    'within row scope using contains': {
      html: source`
        <div>Notes about My first project</div>
        <table>
          <tr>
            <td>My first client</td>
            <td>My first project</td>
            <td>0</td>
            <td>Active</td>
            <td><button>Edit</button></td>
          </tr>
        </table>
      `,
      test: source`
        cy.contains('My first client').parent('tr').within(() => {
          cy.get('td').eq(1).contains('My first project')
          cy.get('td').eq(2).contains('0')
          cy.get('td').eq(3).contains('Active')
          cy.get('td').eq(4).contains('button', 'Edit').click()
        })
      `
    }
  }
}
