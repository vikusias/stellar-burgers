import { emptyBurger } from '../../constants/test-burger';
import {
  testBun,
  testFilling,
  testSauce
} from '../../constants/test-ingredients';
import {
  constructorReducer,
  addIngredient,
  removeIngredient,
  swapIngredient,
  clearBurger
} from './ConstructorSlice';

describe('constructorSlice', () => {
  it('должен добавить булку в burger.bun', () => {
    const state = constructorReducer(undefined, addIngredient(testBun));

    expect(state.burger.bun).toMatchObject({
      _id: testBun._id,
      name: testBun.name,
      type: 'bun'
    });
  });

  it('должен добавить начинку в burger.ingredients', () => {
    const state = constructorReducer(undefined, addIngredient(testFilling));

    expect(state.burger.ingredients).toHaveLength(1);
    expect(state.burger.ingredients[0]).toMatchObject({
      _id: testFilling._id,
      name: testFilling.name,
      type: 'main'
    });
  });

  it('должен добавить соус в burger.ingredients', () => {
    const state = constructorReducer(undefined, addIngredient(testSauce));

    expect(state.burger.ingredients).toHaveLength(1);
    expect(state.burger.ingredients[0]).toMatchObject({
      _id: testSauce._id,
      name: testSauce.name,
      type: 'sauce'
    });
  });

  // Исправленный тест: удаление по уникальному id, а не по _id
  it('удаление начинки не должно затрагивать соус', () => {
    let state = constructorReducer(undefined, addIngredient(testFilling));
    state = constructorReducer(state, addIngredient(testSauce));

    expect(state.burger.ingredients).toHaveLength(2);

    // Находим экземпляр начинки по её _id и получаем уникальный id
    const fillingInstance = state.burger.ingredients.find(
      (item) => item._id === testFilling._id
    );
    expect(fillingInstance).toBeDefined();
    const fillingId = fillingInstance!.id;

    state = constructorReducer(state, removeIngredient(fillingId));

    expect(state.burger.ingredients).toHaveLength(1);
    expect(state.burger.ingredients[0]).toMatchObject({
      _id: testSauce._id,
      name: testSauce.name,
      type: 'sauce'
    });
  });

  it('должен поменять два ингредиента местами по индексам', () => {
    let state = constructorReducer(undefined, addIngredient(testFilling));
    state = constructorReducer(state, addIngredient(testSauce));

    expect(state.burger.ingredients.map((i) => i._id)).toEqual([
      testFilling._id,
      testSauce._id
    ]);

    state = constructorReducer(state, swapIngredient({ first: 0, second: 1 }));

    expect(state.burger.ingredients.map((i) => i._id)).toEqual([
      testSauce._id,
      testFilling._id
    ]);
  });

  it('должен очищать булку и начинку при clearBurger', () => {
    let state = constructorReducer(undefined, addIngredient(testBun));
    state = constructorReducer(state, addIngredient(testFilling));
    state = constructorReducer(state, addIngredient(testSauce));

    expect(state.burger.bun).not.toBeNull();
    expect(state.burger.ingredients).toHaveLength(2);

    state = constructorReducer(state, clearBurger());

    expect(state.burger).toEqual(emptyBurger);
  });
});
