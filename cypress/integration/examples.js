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
      },
      '.get().contains()': {
        skip: true,
        html: source`
          <ul>
            <li>first</li>
            <li>second</li>
          </ul>
        `,
        test: source`
          setTimeout(() => {
            const newLi = window.document.createElement('li')
            newLi.innerText = 'third'
            window.document.querySelector('ul').appendChild(newLi)
          }, 2000)
          // DOES NOT WORK
          // because it only checks the first two LI elements
          // over and over - not noticing the 3rd LI
          cy.get('li').contains('third')
        `
      },
      '.get().should("contain")': {
        only: false,
        html: source`
          <ul>
            <li>first</li>
            <li>second</li>
          </ul>
        `,
        test: source`
          setTimeout(() => {
            const newLi = window.document.createElement('li')
            newLi.innerText = 'third'
            window.document.querySelector('ul').appendChild(newLi)
          }, 2000)
          cy.get('li').should('contain', 'third')
        `
      },
      '.get class selector by partial text': {
        only: false,
        html: source`
          <div class="css-abc123-header">Header</div>
          <div class="css-xyz123-footer small">Footer</div>
        `,
        test: source`
          cy.get('[class*=footer]').should('have.text', 'Footer')
            .and('have.class', 'small')
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
    },
    'exact then inexact matches using jQuery and cypress-pipe': {
      html: source`
        <div id="example">
          <div id="inexact">my item</div>
          <div id="exact">item</div>
        </div>
      `,
      test: source`
        const exactThenInexact = (text) => $el => {
          const r = new RegExp('^' + text + '$')
          let found
          $el.children().each(function (k, v) {
            if (found) return
            if (Cypress.$(v).text().match(r)) {
              found = Cypress.$(v)
            }
          })

          if (!found) {
            // now try to find inexact match
            $el.children().each(function (k, v) {
              if (found) return
              if (Cypress.$(v).text().includes(text)) {
                found = Cypress.$(v)
              }
            })
          }

          return cy.wrap(found)
        }
        const containsExactThenInexactText = (text) =>
          cy.get('div').pipe(exactThenInexact(text))

        containsExactThenInexactText('item').should('have.attr', 'id', 'exact')
        containsExactThenInexactText('my').should('have.attr', 'id', 'inexact')
      `
    },
    'contains exact label match': {
      html: source`
        <div class="form-group">
          <label for="client_default_rate_type">Default rate type</label>
          <select name="client[default_rate_type]" id="client_default_rate_type"><option value="hourly">hourly</option><option selected="selected" value="weekly">weekly</option></select>
        </div>
        <div class="form-group">
          <label for="client_default_rate">Default rate</label>
          <input type="text" value="50.00" name="client[default_rate]" id="client_default_rate">
        </div>
      `,
      test: source`
        cy.contains('label', /^Default rate$/)
          .should('have.attr', 'for', 'client_default_rate')
      `
    },
    'single a': {
      only: false,
      html: source`
        <a id="single">Single anchor</a>
      `,
      test: source`
        // yields "a"
        cy.get('a').should('have.id', 'single')
      `
    },
    'escapes tag': {
      only: false,
      html: source`
        <a id="single">Single anchor</a>
      `,
      test: source`
        // yields <a>...</a>
        cy.get('a').should('have.id', 'single')
      `
    },
    'several classes': {
      only: false,
      html: source`
        <div>
          <div class="one two three">incorrect element</div>
          <div class="one two three four">correct element</div>
        </div>
      `,
      test: source`
        cy.get('.one.two.three.four').should('have.text', 'correct element')
      `
    },
    'button title attribute': {
      only: false,
      html: source`
        <button type="button" data-toggle="tooltip" data-placement="top"
          title="1123bad: Device is not in the factory account" class="btn btn-xs btn-danger">
          <a href="/inventory/devices/1123bad" class="serial">1123bad</a>
          <i class="fa fa-exclamation"></i>
        </button>
      `,
      test: source`
        cy.get('button.btn-danger')     // gets button that satisfies next assertion
          .should('have.attr', 'title') // yields title attribute string
          .should('match', /^1123bad:/) // checks title
      `
    }
  }
}
