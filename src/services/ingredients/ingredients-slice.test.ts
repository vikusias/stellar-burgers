import { ingredientsReducer, IngredientsState } from './IngredientsSlice';
import { getIngredientsThunk } from './actions';
import { testIngredients } from '../../constants/test-ingredients';
import {
  selectIngredients,
  selectIngredientsLoading,
  selectIngredientsError
} from './IngredientsSlice';

// Определяем тип корневого состояния для тестов (как в реальном приложении)
type RootState = {
  ingredients: IngredientsState;
};

const initialState: IngredientsState = {
  ingredients: [],
  loading: false,
  error: null
};

const testIngredient = testIngredients[0];

describe('ingredientsSlice', () => {
  it('pending: должен установить loading=true и error=null', () => {
    const action = { type: getIngredientsThunk.pending.type };
    const result = ingredientsReducer(initialState, action);

    expect(result).toEqual({
      ...initialState,
      loading: true,
      error: null
    });
  });

  it('fulfilled: должен установить loading=false и обновить ингредиенты', () => {
    const action = {
      type: getIngredientsThunk.fulfilled.type,
      payload: testIngredients
    };
    const result = ingredientsReducer(initialState, action);

    expect(result).toEqual({
      ...initialState,
      loading: false,
      ingredients: testIngredients
    });
  });

  it('fulfilled с пустым массивом: должен установить пустой список', () => {
    const action = {
      type: getIngredientsThunk.fulfilled.type,
      payload: []
    };
    const result = ingredientsReducer(initialState, action);

    expect(result).toEqual({
      ...initialState,
      loading: false,
      ingredients: []
    });
  });

  it('rejected: должен установить loading=false и записать ошибку', () => {
    const errorMessage = 'Ошибка загрузки';
    const action = {
      type: getIngredientsThunk.rejected.type,
      payload: errorMessage
    };
    const result = ingredientsReducer(initialState, action);

    expect(result).toEqual({
      ...initialState,
      loading: false,
      error: errorMessage
    });
  });

  it('rejected без payload: должен установить ошибку по умолчанию', () => {
    const action = { type: getIngredientsThunk.rejected.type };
    const result = ingredientsReducer(initialState, action);

    expect(result).toEqual({
      ...initialState,
      loading: false,
      error: 'Неизвестная ошибка'
    });
  });

  it('не должен изменять состояние на неизвестный экшен', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const result = ingredientsReducer(initialState, action);
    expect(result).toEqual(initialState);
  });
});

describe('ingredientsSlice selectors', () => {
  // Корневое состояние с полем ingredients
  const state: RootState = {
    ingredients: {
      ingredients: [testIngredient],
      loading: true,
      error: 'error'
    }
  };

  it('selectIngredients должен вернуть список ингредиентов', () => {
    expect(selectIngredients(state)).toEqual([testIngredient]);
  });

  it('selectIngredientsLoading должен вернуть флаг загрузки', () => {
    expect(selectIngredientsLoading(state)).toBe(true);
  });

  it('selectIngredientsError должен вернуть ошибку', () => {
    expect(selectIngredientsError(state)).toBe('error');
  });
});
