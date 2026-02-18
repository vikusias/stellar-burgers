import type {} from '../support/cypress';

describe('Главная страница, ингредиенты, конструктор', () => {
  // Перед каждым тестом перехватываем запрос ингредиентов и загружаем страницу
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Проверка модального окна ингредиента', function () {
    beforeEach(() => {
      // Запоминаем первый ингредиент в списке
      cy.getBySelId('all_ingredients_div', 'li:first').as('firstIngredient');
    });

    it('Открытие модалки и проверка содержимого', function () {
      cy.get('@firstIngredient').click();
      // Проверяем, что модальное окно содержит ожидаемый текст (данные ингредиента)
      cy.getBySelId('modal_div').should(
        'have.text',
        'Детали ингредиентаКраторная булка N-200iКалории, ккал420Белки, г80Жиры, г24Углеводы, г53'
      );
    });

    it('Кнопка закрытия (крестик) работает', function () {
      cy.get('@firstIngredient').click();
      cy.getBySelId('modal_close_btn').click();
      cy.getBySelId('modal_div').should('not.exist');
    });

    it('Закрытие кликом на overlay', function () {
      cy.get('@firstIngredient').click();
      // force, чтобы клик гарантированно попал в оверлей
      cy.getBySelId('modal_overlay').click('topLeft', { force: true });
      cy.getBySelId('modal_div').should('not.exist');
    });
  });

  describe('order', function () {
    beforeEach(() => {
      // Получаем ссылки на категории ингредиентов и отдельные элементы
      cy.getBySelId('all_ingredients_div', 'ul').as('ingredientsList');
      // Булки
      cy.get('@ingredientsList').eq(0).as('bun');
      cy.get('@bun').find('li').eq(1).as('second_bun');
      // Начинки
      cy.get('@ingredientsList').eq(1).as('fillings');
      cy.get('@fillings').find('li').eq(1).as('filing');
      // Соусы
      cy.get('@ingredientsList').eq(2).as('sauces');
      cy.get('@sauces').find('li').eq(1).as('sauce');
    });

    it('Булка отобразилась в конструкторе', function () {
      cy.get('@second_bun').find('button').click();
      cy.get('@second_bun')
        .find('[data-testid=ingredient_name]')
        .invoke('text')
        .then((bunName) => {
          cy.getBySelId('top_bun_in_constructor').should(
            'contain.text',
            bunName.trim()
          );
        });
    });

    it('Начинка отобразилась в конструкторе', function () {
      cy.get('@filing').find('button').click();
      cy.get('@filing')
        .find('[data-testid=ingredient_name]')
        .invoke('text')
        .then((fillingName) => {
          cy.getBySelId('constructor_ingredients_list').should(
            'contain.text',
            fillingName.trim()
          );
        });
    });

    it('Соус отобразился в конструкторе', function () {
      cy.get('@sauce').find('button').click();
      cy.get('@sauce')
        .find('[data-testid=ingredient_name]')
        .invoke('text')
        .then((sauceName) => {
          cy.getBySelId('constructor_ingredients_list').should(
            'contain.text',
            sauceName.trim()
          );
        });
    });

    it('Собираем бургер и заказываем его', function () {
      // Подменяем авторизацию (токены) и перехватываем запросы
      cy.mockLogin();

      // Добавляем ингредиенты в конструктор
      cy.get('@second_bun').find('button').click();
      cy.get('@sauces').find('li').eq(0).find('button').click();
      cy.get('@fillings').find('li').eq(1).find('button').click();
      cy.get('@sauces').find('li').eq(1).find('button').click();
      cy.get('@fillings').find('li').eq(2).find('button').click();
      cy.get('@sauces').find('li').eq(1).find('button').click();
      cy.get('@fillings').find('li').eq(1).find('button').click();
      cy.get('@sauces').find('li').eq(2).find('button').click();

      // Оформляем заказ
      cy.getBySelId('make_order').click();
      cy.getBySelId('modal_div').should('exist');

      // Проверяем, что в модалке отображается номер заказа из фикстуры
      cy.getBySelId('modal_div').should(
        'have.text',
        '777777идентификатор заказаВаш заказ начали готовитьДождитесь готовности на орбитальной станции'
      );

      // Закрываем модальное окно
      cy.getBySelId('modal_close_btn').click();
      cy.getBySelId('modal_div').should('not.exist');

      // Проверяем, что конструктор очистился
      cy.getBySelId('top_bun_in_constructor').should('not.exist');
      cy.contains('Выберите начинку').should('be.visible');

      // Очищаем токены после теста
      cy.clearMemory();
    });
  });
});
