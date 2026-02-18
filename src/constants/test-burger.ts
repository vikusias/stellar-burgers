// Импорт тестовых ингредиентов: булка, начинка, соус
import { testBun, testFilling, testSauce } from './test-ingredients';
import { TConstructorIngredient } from '@utils-types';

// Тестовый бургер с булкой и ингредиентами (начинка и соус)
// Каждому ингредиенту добавлен уникальный id для идентификации в конструкторе
export const testBurger = {
  bun: { ...testBun, id: 'bun-test-id' },
  ingredients: [
    { ...testFilling, id: 'filling-test-id' },
    { ...testSauce, id: 'sauce-test-id' }
  ] as TConstructorIngredient[]
};

// Пустой бургер для тестирования граничных случаев
// (булка отсутствует, массив ингредиентов пуст)
export const emptyBurger = {
  bun: null,
  ingredients: [] as TConstructorIngredient[]
};
