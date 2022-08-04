/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
    beforeEach(() => {
        cy.visit('./src/index.html').should('exist')        
    })

    it('verifica o título da aplicação', function() {
        cy.title().should('include', 'Central de Atendimento ao Cliente TAT')
    })

    it('preenche os campos obrigatórios e envia o formulário', () => {
        //const longText = 'Teste, , teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste'

        cy.get('#firstName').type('Adriana')
        cy.get('#lastName').type('Souza')
        cy.get('#email').type('adiana.s@uorak.com')
        cy.get('#open-text-area')//.type(longText, {delay: 0})
            .type('O curso começou a pouco tempo, então ainda estou aprendendo aos poucos e até o momento sigo sem dúvidas até o momento!', {delay: 0})
        cy.get('.button').click() //cy.get('button[type="submit"]').click()
        cy.get('.success').should('be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
        cy.get('#firstName').type('Adriana')
        cy.get('#lastName').type('Souza')
        cy.get('#email').type('adiana.s@uorak')
        cy.get('#open-text-area').type('Sem dúvidas até o momento!')
        cy.get('.button').click()
        cy.get('.error').should('have.class', 'error')//.should('be.visible')
    })

    it('campo telefone continua vazio quando preenchido com valor não-numérico', () => {
        cy.get('#phone').type('texto')//.should('have.value', '')
        cy.get('input[name=phone]').should('be.empty')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
        cy.get('#firstName').type('Adriana')
        cy.get('#lastName').type('Souza')
        cy.get('#email').type('adiana.s@uorak.com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('Sem dúvidas até o momento!')
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
        cy.get('#firstName').type('Adriana').should('have.value', 'Adriana')
        cy.get('#lastName').type('Souza').should('have.value', 'Souza')
        cy.get('#email').type('adiana.s@uorak.com').should('have.value', 'adiana.s@uorak.com')
        cy.get('#phone').type('987654321').should('have.value', '987654321')
        cy.get('#firstName').clear().should('have.value', '')
        cy.get('#lastName').clear().should('have.value', '')
        cy.get('#email').clear().should('have.value', '')
        cy.get('#phone').clear().should('have.value', '')
        /*cy.get('#firstName')
            .type('Adriana')
            .should('have.value', 'Adriana')
            .clear()
            .should('have.value', '')*/
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
        cy.contains('button', 'Enviar'). click()
        cy.get('.error').should('contain', 'Valide os campos obrigatórios!')
            //.should('be.visible')
    })
    
    it('envia o formuário com sucesso usando um comando customizado', () => {
        cy.fillMandatoryFieldsAndSubmit()
        cy.mensagemSucesso().should('be.visible')
    })

    it('seleciona um produto (YouTube) por seu texto', () => {
        cy.get('select').select('YouTube')//cy.get('#product').select('YouTube')
         .should('have.value', 'youtube')        
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', () => {
        cy.get('#product').select('mentoria')
         .should('have.value', 'mentoria')        
    })

    it('seleciona um produto (Blog) por seu índice', () => {
        cy.get('#product').select(1)
         .should('have.value', 'blog')        
    })

    it('marca o tipo de atendimento "Feedback"', () => {
        cy.get(':nth-child(4) > input').check()
        //cy.get('input[type="radio"][value="feedback"').check()
         .should('have.value', 'feedback')      

    })

    it('marca cada tipo de atendimento', () => {
        cy.get('input[type="radio"][value="elogio"').check()
         .should('be.checked')
        cy.get('input[type="radio"][value="feedback"').check()
         .should('be.checked')
        cy.get('input[type="radio"][value="ajuda"').check()
         .should('be.checked')

        /*cy.get('input[type="radio"]')
            .should('have.length', 3)
            .each(($radio) => {
                cy.wrap($radio).check()
                cy.wrap($radio).should('be.checked')
            })*/                
    })

    it('marca ambos checkboxes, depois desmarca o último', () => {
        /*cy.get('#email-checkbox').check().should('be.checked')
        cy.get('#phone-checkbox').check().should('be.checked')
        cy.get('#phone-checkbox').uncheck().should('not.be.checked')*/

        cy.get('input[type="checkbox"]')            
            .check()
            .should('be.checked')
            .last().uncheck()
            .should('not.be.checked')
    })

    it('seleciona um arquivo da pasta fixtures', () => {
        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json')
            .should(($input) => {                
                expect($input [0].files[0].name).to.equal('example.json')                
            })            
    })

    it('seleciona um arquivo simulando um drag-and-drop', () => {
        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json', {action: 'drag-drop'})
            .should(($input) => {                
                expect($input [0].files[0].name).to.equal('example.json')                
            })            
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
        cy.fixture('example.json').as('arquivoEx')
        cy.get('input[type="file"]')
            .selectFile('@arquivoEx')
            .should(($input) => {                
                expect($input [0].files[0].name).to.equal('example.json')
            })        
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
        cy.get('a[href="privacy.html"]')
            .should('have.attr', 'target', '_blank')
    })

    it('acessa a página da política de privacidade removendo o target e então clicanco no link', () => {
        cy.get('#privacy a')
            .invoke('removeAttr', 'target')
            .click()
        cy.contains('Talking About Testing').should('be.visible')
    })
})  
