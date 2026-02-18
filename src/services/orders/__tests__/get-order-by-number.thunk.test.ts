import { testOrder } from '../../../constants/test-orders';
import { ordersTestInitialState } from '../../../constants/test-orders-state';
import { getOrderByNumberThunk } from '../actions';
import { ordersReducer } from '../OrdersSlice';

describe('getOrderByNumberThunk', () => {
  it('pending → loading: true, error: null, orderByNumber: null', () => {
    const action = { type: getOrderByNumberThunk.pending.type };
    const state = ordersReducer(ordersTestInitialState, action);

    expect(state).toEqual({
      ...ordersTestInitialState,
      loading: true,
      error: null,
      orderByNumber: null
    });
  });

  it('fulfilled → loading: false, записывает orderByNumber', () => {
    const action = {
      type: getOrderByNumberThunk.fulfilled.type,
      payload: { orders: [testOrder] }
    };
    const state = ordersReducer(ordersTestInitialState, action);
    expect(state).toEqual({
      ...ordersTestInitialState,
      loading: false,
      orderByNumber: testOrder
    });
  });

  it('fulfilled с пустым массивом → orderByNumber: null', () => {
    const action = {
      type: getOrderByNumberThunk.fulfilled.type,
      payload: { orders: [] }
    };
    const state = ordersReducer(ordersTestInitialState, action);
    expect(state.orderByNumber).toBeNull();
  });

  it('rejected → loading: false, error = payload', () => {
    const action = {
      type: getOrderByNumberThunk.rejected.type,
      payload: 'Ошибка получения заказа по номеру'
    };
    const state = ordersReducer(ordersTestInitialState, action);
    expect(state).toEqual({
      ...ordersTestInitialState,
      loading: false,
      error: 'Ошибка получения заказа по номеру'
    });
  });

  it('не изменяет состояние при неизвестном экшене', () => {
    const action = { type: 'UNKNOWN' };
    const state = ordersReducer(ordersTestInitialState, action);
    expect(state).toEqual(ordersTestInitialState);
  });
});
