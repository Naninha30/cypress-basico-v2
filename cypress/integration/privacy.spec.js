/// <reference types="Cypress" />

it('testa a página da política de privavidade de forma independente', () => {    
    cy.visit('./src/privacy.html')
        .should('exist')
    cy.contains('Talking About Testing').should('be.visible')
})