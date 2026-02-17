import { testIngredients } from '../../constants/test-ingredients';
import { getIngredientsThunk } from './actions';
import * as api from '@api';

describe('getIngredientsThunk', () => {
  const dispatch = jest.fn();
  const thunk = getIngredientsThunk();

  afterEach(() => {
    jest.restoreAllMocks();
    dispatch.mockClear();
  });

  it('успешный запрос должен вернуть данные', async () => {
    jest.spyOn(api, 'getIngredientsApi').mockResolvedValue(testIngredients);

    const result = await thunk(dispatch, () => ({}), undefined);

    expect(result.payload).toEqual(testIngredients);
    expect(result.type.endsWith('/fulfilled')).toBe(true);
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: getIngredientsThunk.pending.type })
    );
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: getIngredientsThunk.fulfilled.type,
        payload: testIngredients
      })
    );
  });

  it('ошибка (экземпляр Error) должна вернуть rejectWithValue с текстом ошибки', async () => {
    jest
      .spyOn(api, 'getIngredientsApi')
      .mockRejectedValue(new Error('API error'));

    const result = await thunk(dispatch, () => ({}), undefined);

    expect(result.payload).toBe('API error');
    expect(result.type.endsWith('/rejected')).toBe(true);
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: getIngredientsThunk.pending.type })
    );
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: getIngredientsThunk.rejected.type,
        payload: 'API error'
      })
    );
  });

  it('ошибка (не Error) должна вернуть rejectWithValue с сообщением по умолчанию', async () => {
    jest.spyOn(api, 'getIngredientsApi').mockRejectedValue('Строка ошибки');

    const result = await thunk(dispatch, () => ({}), undefined);

    expect(result.payload).toBe('Не удалось загрузить список ингредиентов');
    expect(result.type.endsWith('/rejected')).toBe(true);
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: getIngredientsThunk.rejected.type,
        payload: 'Не удалось загрузить список ингредиентов'
      })
    );
  });

  it('успешный запрос с пустым массивом должен вернуть пустой массив', async () => {
    jest.spyOn(api, 'getIngredientsApi').mockResolvedValue([]);

    const result = await thunk(dispatch, () => ({}), undefined);

    expect(result.payload).toEqual([]);
    expect(result.type.endsWith('/fulfilled')).toBe(true);
  });
});
