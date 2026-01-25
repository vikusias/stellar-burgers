import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

export interface ConstructorState {
  burger: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  isLoading: boolean;
  error: string | undefined;
}

export const initialState: ConstructorState = {
  burger: {
    bun: null,
    ingredients: []
  },
  isLoading: false,
  error: undefined
};

export const constructorSlice = createSlice({
  name: 'myconstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const ingredient = action.payload;
        if (ingredient.type === 'bun') {
          state.burger.bun = ingredient;
        } else {
          state.burger.ingredients.push(ingredient);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ingredient, id } };
      }
    },

    swapIngredient: (
      state,
      action: PayloadAction<{ first: number; second: number }>
    ) => {
      const { first, second } = action.payload;
      const ingredients = state.burger.ingredients;

      [ingredients[first], ingredients[second]] = [
        ingredients[second],
        ingredients[first]
      ];
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      const ingredientId = action.payload;
      state.burger.ingredients = state.burger.ingredients.filter(
        (ingredient) => ingredient.id !== ingredientId
      );
    },

    clearBurger: (state) => {
      state.burger.bun = null;
      state.burger.ingredients = [];
    }
  },
  selectors: {
    selectBurgerConstructor: (state) => state.burger
  }
});

export const { selectBurgerConstructor } = constructorSlice.selectors;
export const { addIngredient, removeIngredient, clearBurger, swapIngredient } =
  constructorSlice.actions;
export const constructorReducer = constructorSlice.reducer;
