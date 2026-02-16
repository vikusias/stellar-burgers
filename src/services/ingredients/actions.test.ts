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

    await thunk(dispatch, () => ({}), undefined);

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

    await thunk(dispatch, () => ({}), undefined);

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
    // Например, API выбросило строку
    jest.spyOn(api, 'getIngredientsApi').mockRejectedValue('Строка ошибки');

    await thunk(dispatch, () => ({}), undefined);

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: getIngredientsThunk.rejected.type,
        payload: 'Не удалось загрузить список ингредиентов'
      })
    );
  });
});
