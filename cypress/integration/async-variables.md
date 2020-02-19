This fiddle follows example from the blog post [Working With Variables In Cypress Tests](https://dev.to/pepopowitz/working-with-variables-in-cypress-tests-4097)

## Original code

The blog post parses the location url to extract a particular ID, then saves it in an alias. Then it uses the alias to make an HTTP request using [cy.request](https://on.cypress.io/request)

```js
it('myExtractedURLParamTest', () => {
  // Visit the articles list and click on the first link
  cy.visit('/articles');
  cy.get('[data-cy=article]').click();

  // Wait until we're on an article page
  cy.location('pathname').should('match', /^\/articles\/.*$/);

  // Extract the article ID from the URL and alias it
  cy.location('pathname').then(path => {
    // path = "/articles/234234234"
    const articleID = path.split('/')[2];
    cy.wrap(articleID).as('articleID');
  });

  // Access the article ID from the alias
  cy.get('@articleID').then(articleID => {
    // do stuff with the articleID
    cy.request(`/api/articles/${articleID}`).then(response => {
      expect(response.status).to.eq(200);
      expect(response.body.title).to.eq(
        'A stolen $15,000 wooden monkey was returned to a Danish art museum?'
      );
    });
  });
});
```

## Simplify the test

Let's simplify the test step by step. First, let's take a look at getting the article ID from the URL

```js
// Extract the article ID from the URL and alias it
cy.location('pathname').then(path => {
  // path = "/articles/234234234"
  const articleID = path.split('/')[2];
  cy.wrap(articleID).as('articleID');
});
```

Here is the example page and the test

<!-- fiddle-skip Get article ID -->
```js
cy.visit('https://dev.to/pepopowitz/working-with-variables-in-cypress-tests-4097')
cy.location('pathname').then(path => {
  // path = "/author/blog post title"
  const articlePost = path.split('/')[2];
  cy.wrap(articlePost).as('articleID');
});
```
<!-- fiddle-end -->

Let's simplify the above code a little bit. When we get the `path` variable we call `split` method on it. We can do this inline using [cy.invoke](https://on.cypress.io/invoke).

<!-- fiddle-skip Use invoke -->
```js
cy.visit('https://dev.to/pepopowitz/working-with-variables-in-cypress-tests-4097')
// pathname is "/author/blog post title"
cy.location('pathname').invoke('split', '/').then(parts => {
  const articlePost = parts[2];
  cy.wrap(articlePost).as('articleID');
});
```
<!-- fiddle-end -->

Next, we are getting the second item in the array returned by the `split('/')` call. We can grab an individual property or array's item using [cy.its](https://on.cypress.io/its) method.

<!-- fiddle-skip Use its -->
```js
cy.visit('https://dev.to/pepopowitz/working-with-variables-in-cypress-tests-4097')
// pathname is "/author/blog post title"
cy.location('pathname').invoke('split', '/').its(2).then(articlePost => {
  cy.wrap(articlePost).as('articleID');
});
```
<!-- fiddle-end -->

Hmm, if we are using `then` callback to simply wrap the `articlePost` as an alias, we can directly use [cy.as](https://on.cypress.io/as)

<!-- fiddle-skip remove then -->
```js
cy.visit('https://dev.to/pepopowitz/working-with-variables-in-cypress-tests-4097')
// pathname is "/author/blog post title"
cy.location('pathname').invoke('split', '/').its(2).as('articleID');
```
<!-- fiddle-end -->

Let's use the wrapped variable to do something. We can make a request but for simplicity I will just log it

<!-- fiddle log the result -->
```js
cy.visit('https://dev.to/pepopowitz/working-with-variables-in-cypress-tests-4097')
// pathname is "/author/blog post title"
cy.location('pathname').invoke('split', '/').its(2).as('articleID');
cy.get('@articleID').then(id => cy.log(`article **${id}**`))
```
<!-- fiddle-end -->
