import { testOrder } from '../../../constants/test-orders';
import { ordersTestInitialState } from '../../../constants/test-orders-state';
import { getFeedsThunk } from '../actions';
import { ordersReducer } from '../OrdersSlice';

describe('getFeedsThunk', () => {
  it('pending → устанавливает loading: true и error: null', () => {
    const action = { type: getFeedsThunk.pending.type };
    const state = ordersReducer(ordersTestInitialState, action);
    expect(state).toEqual({
      ...ordersTestInitialState,
      loading: true,
      error: null
    });
  });

  it('fulfilled → записывает feed и отключает loading', () => {
    const actionPayload = {
      success: true,
      total: 1,
      totalToday: 1,
      orders: [testOrder]
    };
    const action = {
      type: getFeedsThunk.fulfilled.type,
      payload: actionPayload
    };
    const state = ordersReducer(ordersTestInitialState, action);
    expect(state).toEqual({
      ...ordersTestInitialState,
      loading: false,
      feed: actionPayload
    });
  });

  it('rejected → записывает ошибку и отключает loading', () => {
    const action = {
      type: getFeedsThunk.rejected.type,
      payload: 'Ошибка загрузки'
    };
    const state = ordersReducer(ordersTestInitialState, action);
    expect(state).toEqual({
      ...ordersTestInitialState,
      loading: false,
      error: 'Ошибка загрузки'
    });
  });

  it('не изменяет состояние при неизвестном экшене', () => {
    const action = { type: 'UNKNOWN' };
    const state = ordersReducer(ordersTestInitialState, action);
    expect(state).toEqual(ordersTestInitialState);
  });
});
