describe('Create and connect to an account', () => {
  it('Visits the Oc commerce site', () => {
    cy.visit('home')

    // User is able to create an account an to be redirect to login pages

    cy.contains('SIGNUP').click()
    cy.url().should('include', '/user/signup')
    // cy.contains('fname')
    cy.get('[id^=fname]').type('afakeuser')
    cy.get('[id^=lname]').type('atoto')
    cy.get('[id^=username]').type('afakeuser')
    cy.get('[id^=email]').type('afake@email.com')
    cy.get('[id^=pass]').type('a1hstesh<23456789')
    cy.get('[id^=re_pass]').type('a1hstesh<23456789')
    cy.get('form').contains('Register').click()
    cy.url().should('include', '/user/login')

    // User is able to connect with the previously created account
    cy.get('[id^=your_name]').type('afakeuser')
    cy.get('[id^=your_pass]').type('a1hstesh<23456789')
    cy.get('form').contains('Log in').click()
    cy.url().should('include', '/home')
    cy.contains('FAVOURITE')
  })
})

describe('Put item in favourite', () => {
  it('Connects, adds an item to favourite, verifies, then removes it', () => {
    // Step 1: Visit and login
    cy.visit('/home')
    cy.contains('LOGIN').click()
    cy.url().should('include', '/user/login')

    cy.get('[id^=your_name]').type('afakeuser')
    cy.get('[id^=your_pass]').type('a1hstesh<23456789')
    cy.get('form').contains('Log in').click()
    cy.url().should('include', '/home')
    cy.contains('FAVOURITE')

    // Step 2: Go to favourites to confirm it's empty
    cy.contains('FAVOURITE').click()
    cy.url().should('include', '/favourite')
    cy.get('body').then(($body) => {
      if ($body.text().includes('No Product in your favourite list')) {
        cy.log('No favourites yet – continuing')
      } else {
        // Remove all favourites before starting
        cy.get('a[id^=favBtn]').each(($btn) => {
          cy.wrap($btn).click()
        })
        cy.reload()
        cy.contains('No Product in your favourite list')
      }
    })

    // Step 3: Go back home and add a favourite
    cy.contains('add').click() // The "add" link in "Please add" goes back to /home
    cy.url().should('include', '/home')

    // Add the first available product to favourites
    cy.get('a[id^=favBtn]').first().as('firstFavBtn')
    cy.get('@firstFavBtn').click()

    // Step 4: Go to favourites and verify item is listed
    cy.contains('FAVOURITE').click()
    cy.url().should('include', '/favourite')
    cy.get('table tbody tr').should('have.length.at.least', 1)

    // Step 5: Remove the favourite
    cy.get('a[id^=favBtn]').then(($btns) => {
      const count = $btns.length
      for (let i = 0; i < count; i++) {
        cy.get('a[id^=favBtn]').first().click()
        cy.wait(300) // permet à AJAX de finir et DOM de se stabiliser
        cy.reload()
      }
      cy.contains('No Product in your favourite list')
    })

  })
})

describe('Switch dark / light mode', () => {
  it('Connects and switches between dark and light mode', () => {
    // Step 1: Visit and login
    cy.visit('/home')
    cy.contains('LOGIN').click()
    cy.url().should('include', '/user/login')

    cy.get('[id^=your_name]').type('afakeuser')
    cy.get('[id^=your_pass]').type('a1hstesh<23456789')
    cy.get('form').contains('Log in').click()
    cy.url().should('include', '/home')

    // Step 2: Switch to dark mode
    cy.get('#theme-toggle').click()
    cy.get('html').should('have.class', 'dark-mode')

    // Step 3: Switch back to light mode
    cy.get('#theme-toggle').click()
    cy.get('html').should('not.have.class', 'dark-mode')
  })
})

