describe('My First Test', () => {
  it('visits the app root url', () => {
    cy.visit('/')
    cy.title().should('eq', 'Web Phaser Engine')
  })
})
