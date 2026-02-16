import { TOrder } from '@utils-types';

// Тестовый заказ №1: простой бургер с двумя одинаковыми ингредиентами
export const testOrder: TOrder = {
  _id: '68b8bf41673086001ba8654d',
  ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa093c'],
  status: 'done',
  name: 'Краторный бургер',
  createdAt: '2026-02-03T22:20:49.672Z',
  updatedAt: '2026-02-03T22:20:50.480Z',
  number: 87800
};

// Тестовый заказ №2: сложный бургер с несколькими ингредиентами
export const anotherTestOrder: TOrder = {
  _id: '68b8bb7b673086001ba86545',
  ingredients: [
    '643d69a5c3f7b9001cfa093d',
    '643d69a5c3f7b9001cfa0941',
    '643d69a5c3f7b9001cfa093e',
    '643d69a5c3f7b9001cfa093e',
    '643d69a5c3f7b9001cfa093e',
    '643d69a5c3f7b9001cfa093d'
  ],
  status: 'done',
  name: 'Флюоресцентный люминесцентный био-марсианский бургер',
  createdAt: '2026-02-03T22:04:43.527Z',
  updatedAt: '2026-02-03T22:04:44.356Z',
  number: 87797
};
