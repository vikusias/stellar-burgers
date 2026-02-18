import {
  getFeedsThunk,
  getOrderByNumberThunk,
  getUserOrdersThunk,
  postUserBurderThunk
} from './actions';
import * as api from '@api';
import { testOrder } from '../../constants/test-orders';

// Мокаем все API функции
jest.mock('@api', () => ({
  getFeedsApi: jest.fn(),
  getOrderByNumberApi: jest.fn(),
  getOrdersApi: jest.fn(),
  orderBurgerApi: jest.fn()
}));

const mockGetFeedsApi = api.getFeedsApi as jest.Mock;
const mockGetOrderByNumberApi = api.getOrderByNumberApi as jest.Mock;
const mockGetOrdersApi = api.getOrdersApi as jest.Mock;
const mockOrderBurgerApi = api.orderBurgerApi as jest.Mock;

describe('orders thunks', () => {
  const dispatch = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
    dispatch.mockClear();
  });

  describe('getFeedsThunk', () => {
    it('успешно получает ленту', async () => {
      const response = {
        success: true,
        total: 100,
        totalToday: 10,
        orders: [testOrder]
      };
      mockGetFeedsApi.mockResolvedValue(response);

      const thunk = getFeedsThunk();
      await thunk(dispatch, () => ({}), undefined);

      expect(mockGetFeedsApi).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: getFeedsThunk.pending.type })
      );
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: getFeedsThunk.fulfilled.type,
          payload: response
        })
      );
    });

    it('обрабатывает ошибку (экземпляр Error)', async () => {
      const errorMessage = 'API error';
      mockGetFeedsApi.mockRejectedValue(new Error(errorMessage));

      const thunk = getFeedsThunk();
      await thunk(dispatch, () => ({}), undefined);

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: getFeedsThunk.rejected.type,
          payload: errorMessage
        })
      );
    });

    it('обрабатывает ошибку (не Error)', async () => {
      mockGetFeedsApi.mockRejectedValue('string error');

      const thunk = getFeedsThunk();
      await thunk(dispatch, () => ({}), undefined);

      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: getFeedsThunk.rejected.type,
          payload: 'Ошибка загрузки ленты заказов'
        })
      );
    });
  });

  describe('getOrderByNumberThunk', () => {
    it('успешно получает заказ по номеру', async () => {
      const response = { orders: [testOrder] };
      mockGetOrderByNumberApi.mockResolvedValue(response);

      const thunk = getOrderByNumberThunk(123);
      await thunk(dispatch, () => ({}), undefined);

      expect(mockGetOrderByNumberApi).toHaveBeenCalledWith(123);
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: getOrderByNumberThunk.fulfilled.type,
          payload: response
        })
      );
    });

    it('обрабатывает ошибку (экземпляр Error)', async () => {
      mockGetOrderByNumberApi.mockRejectedValue(new Error('Not found'));

      const thunk = getOrderByNumberThunk(999);
      await thunk(dispatch, () => ({}), undefined);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: getOrderByNumberThunk.rejected.type,
          payload: 'Not found'
        })
      );
    });

    it('обрабатывает ошибку (не Error)', async () => {
      mockGetOrderByNumberApi.mockRejectedValue(null);

      const thunk = getOrderByNumberThunk(999);
      await thunk(dispatch, () => ({}), undefined);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: getOrderByNumberThunk.rejected.type,
          payload: 'Ошибка получения заказа по номеру'
        })
      );
    });
  });

  describe('postUserBurderThunk', () => {
    it('успешно создает заказ', async () => {
      const response = {
        order: testOrder,
        name: 'Test burger'
      };
      mockOrderBurgerApi.mockResolvedValue(response);

      const thunk = postUserBurderThunk(['1', '2']);
      await thunk(dispatch, () => ({}), undefined);

      expect(mockOrderBurgerApi).toHaveBeenCalledWith(['1', '2']);
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: postUserBurderThunk.fulfilled.type,
          payload: response
        })
      );
    });

    it('обрабатывает ошибку (экземпляр Error)', async () => {
      mockOrderBurgerApi.mockRejectedValue(new Error('Creation failed'));

      const thunk = postUserBurderThunk(['1']);
      await thunk(dispatch, () => ({}), undefined);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: postUserBurderThunk.rejected.type,
          payload: 'Creation failed'
        })
      );
    });

    it('обрабатывает ошибку (не Error)', async () => {
      mockOrderBurgerApi.mockRejectedValue('error');

      const thunk = postUserBurderThunk(['1']);
      await thunk(dispatch, () => ({}), undefined);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: postUserBurderThunk.rejected.type,
          payload: 'Ошибка создания заказа'
        })
      );
    });
  });

  describe('getUserOrdersThunk', () => {
    it('успешно получает заказы пользователя', async () => {
      mockGetOrdersApi.mockResolvedValue([testOrder]);

      const thunk = getUserOrdersThunk();
      await thunk(dispatch, () => ({}), undefined);

      expect(mockGetOrdersApi).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: getUserOrdersThunk.fulfilled.type,
          payload: [testOrder]
        })
      );
    });

    it('обрабатывает ошибку (экземпляр Error)', async () => {
      mockGetOrdersApi.mockRejectedValue(new Error('Auth required'));

      const thunk = getUserOrdersThunk();
      await thunk(dispatch, () => ({}), undefined);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: getUserOrdersThunk.rejected.type,
          payload: 'Auth required'
        })
      );
    });

    it('обрабатывает ошибку (не Error)', async () => {
      mockGetOrdersApi.mockRejectedValue(500);

      const thunk = getUserOrdersThunk();
      await thunk(dispatch, () => ({}), undefined);

      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: getUserOrdersThunk.rejected.type,
          payload: 'Ошибка загрузки заказов пользователя'
        })
      );
    });
  });
});
