import type {} from './commands';

// Базовый URL API (используется в intercept)
const URL = 'https://norma.nomoreparties.space/api';

// Команда для моковой авторизации: подменяет запросы логина, получения пользователя и создания заказа,
// а также записывает тестовые токены.
Cypress.Commands.add('mockLogin', (): void => {
  cy.intercept('POST', '**/auth/login', { fixture: 'login' }).as('postLogin');
  cy.intercept('GET', '**/auth/user', { fixture: 'user' }).as('getUser');
  cy.intercept('POST', '**/orders', { fixture: 'order' }).as('order');
  window.localStorage.setItem(
    'refreshToken',
    JSON.stringify('test-refreshToken')
  );
  cy.setCookie('accessToken', 'test-accessToken');
  cy.visit('/');
});

// Очищает localStorage и cookies – полезно между тестами
Cypress.Commands.add('clearMemory', (): void => {
  cy.clearLocalStorage();
  cy.clearCookies();
});

// Удобная команда для поиска элементов по data-testid
Cypress.Commands.add(
  'getBySelId',
  (
    selector: string,
    childSelector?: string,
    options?: Partial<
      Cypress.Loggable &
        Cypress.Timeoutable &
        Cypress.Withinable &
        Cypress.Shadow
    >
  ) => {
    const fullSelector = `[data-testid=${selector}]${childSelector ? ' ' + childSelector : ''}`;
    return cy.get(fullSelector, options);
  }
); // ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
