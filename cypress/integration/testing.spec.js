// testing.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

describe.skip('Login, Logout', () => {
   it('Testing Login...', () => {
     cy.visit('http://localhost:3000/login')

     cy.get('#formBasicEmail')
      .type('test01@gmail.com')
      .should('have.value', 'test01@gmail.com')

      cy.get('#formBasicPassword')
      .type('test01')
      .should('have.value', 'test01')

      cy.get('Button').contains('Login')
      .click()

      cy.url().should('include', '/profile/')
   })

    it('Testing Logout...', () => {
      cy.contains('Profile')
      .click()

      cy.wait(1000)

      cy.contains('test01')
      .click()

      cy.wait(1000)
 
      cy.contains('Logout').click()
    })
 })

describe.skip('Create/Join and Leave Group', () => {
   it('Testing Login...', () => {
     cy.visit('http://localhost:3000/login')

     cy.get('#formBasicEmail')
      .type('test01@gmail.com')
      .should('have.value', 'test01@gmail.com')

      cy.get('#formBasicPassword')
      .type('test01')
      .should('have.value', 'test01')

      cy.get('Button').contains('Login')
      .click()

      cy.url().should('include', '/profile/')
   })

   it('Testing Group Creation and Destruction...', () => {
      cy.contains('Groups')
      .click()
 
       cy.contains('Create Group')
       .click()
 
       cy.contains('Leave Group')
      .click()
    })

    it('Testing Logout...', () => {
      cy.contains('Profile')
      .click()

      cy.wait(1000)

      cy.contains('test01')
      .click()

      cy.wait(1000)
 
      cy.contains('Logout').click()
    })
 })

 describe('Create Account and Adding Game', () => {
   it('Testing Creation...', () => {
     cy.visit('http://localhost:3000/create-account')

     cy.get('#username')
      .type('testCreate')
      .should('have.value', 'testCreate')

     cy.get('#email')
      .type('testCreate@gmail.com')
      .should('have.value', 'testCreate@gmail.com')

      cy.get('#password')
      .type('testCreate')
      .should('have.value', 'testCreate')

      cy.get('#confirmedPassword')
      .type('testCreate')
      .should('have.value', 'testCreate')

      cy.contains('Create Account').click()

      cy.url().should('include', '/profile')
   })

   it('Add new game', () => {
      cy.contains('Find Match')
      .click()

      cy.wait(1000)

      cy.get('#newGame')
      .type('Skribbl.io')
      .should('have.value', 'Skribbl.io')

      cy.contains('Add New Game').click()

      cy.wait(1000)
 
      cy.contains('Profile').click()
    })

    it('Testing Logout...', () => {
      cy.contains('Profile')
      .click()

      cy.wait(1000)

      cy.contains('testCreate')
      .click()

      cy.wait(1000)
 
      cy.contains('Logout').click()
    })
 })

 describe.skip('Join Lobby', () => {
   it('Login for test01...', () => {
     cy.visit('http://localhost:3000/login')

     cy.get('#formBasicEmail')
      .type('test01@gmail.com')
      .should('have.value', 'test01@gmail.com')

      cy.get('#formBasicPassword')
      .type('test01')
      .should('have.value', 'test01')

      cy.get('Button').contains('Login')
      .click()

      cy.url().should('include', '/profile/')
   })

   it('Join Krunker Match as test01', () => {
      cy.contains('Find Match')
      .click()
 
       cy.contains('Select Game')
       .click()
 
       cy.contains('Krunker - Hardpoint')
      .click()
    })

   it('Logout of test01', () => {
      cy.contains('Profile')
      .click()

      cy.wait(1000)

      cy.contains('test01')
      .click()

      cy.wait(1000)
 
      cy.contains('Logout').click()
   })

   it('Login for test02...', () => {
      cy.visit('http://localhost:3000/login')
 
      cy.get('#formBasicEmail')
       .type('test02@gmail.com')
       .should('have.value', 'test02@gmail.com')
 
       cy.get('#formBasicPassword')
       .type('test02')
       .should('have.value', 'test02')
 
       cy.get('Button').contains('Login')
       .click()
 
       cy.url().should('include', '/profile/')
    })
 
    it('Join Krunker Match as test02', () => {
       cy.contains('Find Match')
       .click()
  
        cy.contains('Select Game')
        .click()
  
        cy.contains('Krunker - Hardpoint')
       .click()
     })
 
    it('Logout of test02', () => {
      cy.contains('Profile')
      .click()

      cy.wait(1000)

       cy.contains('test02')
       .click()

       cy.wait(1000)
  
      cy.contains('Logout').click()
    })

    it('Login for test03...', () => {
      cy.visit('http://localhost:3000/login')
 
      cy.get('#formBasicEmail')
       .type('test03@gmail.com')
       .should('have.value', 'test03@gmail.com')
 
       cy.get('#formBasicPassword')
       .type('test03')
       .should('have.value', 'test03')
 
       cy.get('Button').contains('Login')
       .click()
 
       cy.url().should('include', '/profile/')
    })
 
    it('Join Krunker Match as test03', () => {
       cy.contains('Find Match')
       .click()
  
        cy.contains('Select Game')
        .click()
  
        cy.contains('Krunker - Hardpoint')
       .click()
     })
 
    it('Logout of test03', () => {
      cy.contains('Profile')
      .click()

      cy.wait(1000)

       cy.contains('test03')
       .click()

       cy.wait(1000)
  
       cy.contains('Logout').click()
    })

    it('Login for test04...', () => {
      cy.visit('http://localhost:3000/login')
 
      cy.get('#formBasicEmail')
       .type('test04@gmail.com')
       .should('have.value', 'test04@gmail.com')
 
       cy.get('#formBasicPassword')
       .type('test04')
       .should('have.value', 'test04')
 
       cy.get('Button').contains('Login')
       .click()
 
       cy.url().should('include', '/profile/')
    })
 
    it('Join Krunker Match as test04', () => {
       cy.contains('Find Match')
       .click()
  
        cy.contains('Select Game')
        .click()
  
        cy.contains('Krunker - Hardpoint')
       .click()
     })

   it('Test functional lobby', () => {
      cy.wait(5000)

      cy.contains('Find Match').click()

      cy.contains('Submit').click()
    })
 
    it('Logout of test04', () => {
      cy.contains('Profile')
      .click()

      cy.wait(1000)

       cy.contains('test04')
       .click()

       cy.wait(1000)
  
       cy.contains('Logout').click()

       cy.url().should('include', '/login')
    })

    it('Login for test01 to submit', () => {
      cy.visit('http://localhost:3000/login')
 
      cy.get('#formBasicEmail')
       .type('test01@gmail.com')
       .should('have.value', 'test01@gmail.com')
 
       cy.get('#formBasicPassword')
       .type('test01')
       .should('have.value', 'test01')
 
       cy.get('Button').contains('Login')
       .click()
 
       cy.url().should('include', '/profile/')
    })
 
    it('Submit Krunker Match as test01', () => {
       cy.contains('Find Match')
       .click()
  
       cy.contains('Submit').click()
     })
 
    it('Relogout of test01', () => {
       cy.contains('Profile')
       .click()
 
       cy.wait(1000)
 
       cy.contains('test01')
       .click()
 
       cy.wait(1000)
  
       cy.contains('Logout').click()
    })
 
    it('Relogin for test02...', () => {
       cy.visit('http://localhost:3000/login')
  
       cy.get('#formBasicEmail')
        .type('test02@gmail.com')
        .should('have.value', 'test02@gmail.com')
  
        cy.get('#formBasicPassword')
        .type('test02')
        .should('have.value', 'test02')
  
        cy.get('Button').contains('Login')
        .click()
  
        cy.url().should('include', '/profile/')
     })
  
     it('Submit Krunker Match as test02', () => {
        cy.contains('Find Match')
        .click()
   
        cy.contains('Submit').click()
      })
  
     it('Relogout of test02', () => {
       cy.contains('Profile')
       .click()
 
       cy.wait(1000)
 
        cy.contains('test02')
        .click()
 
        cy.wait(1000)
   
       cy.contains('Logout').click()
     })
 })

 describe('Reset Tests', () => {
   it('Resetting...', () => {
     cy.request('PATCH', 'http://localhost:5000/reset', { completed: true} )
   })
 })