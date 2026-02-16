// Подключаем файл с реализацией пользовательских команд
import './commands';

// Расширяем глобальные типы Cypress для поддержки своих команд
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Моковая авторизация: записывает токены в localStorage и cookie
       */
      mockLogin(): void;

      /**
       * Очищает localStorage и cookie после теста
       */
      clearMemory(): void;

      /**
       * Получает элемент по data-cy атрибуту.
       * Можно указать дочерний селектор и опции cy.get()
       */

      getBySelId(
        selector: string,
        childSelector?: string,
        options?: Partial<
          Cypress.Loggable &
            Cypress.Timeoutable &
            Cypress.Withinable &
            Cypress.Shadow
        >
      ): Chainable<JQuery<HTMLElement>>;
    }
  }
}
