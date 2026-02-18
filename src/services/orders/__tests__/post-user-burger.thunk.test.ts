import { postUserBurderThunk } from '../actions';
import { ordersReducer } from '../OrdersSlice';
import { ordersTestInitialState } from '../../../constants/test-orders-state';
import { testOrder } from '../../../constants/test-orders';

describe('postUserBurderThunk', () => {
  it('pending → loading: true, orderRequest: true, error: null', () => {
    const action = { type: postUserBurderThunk.pending.type };
    const state = ordersReducer(ordersTestInitialState, action);
    expect(state).toEqual({
      ...ordersTestInitialState,
      loading: true,
      orderRequest: true,
      error: null
    });
  });

  it('fulfilled → loading: false, orderRequest: false, записывает newOrder', () => {
    const payload = {
      order: testOrder,
      name: 'Test Order Name'
    };
    const action = {
      type: postUserBurderThunk.fulfilled.type,
      payload
    };
    const state = ordersReducer(ordersTestInitialState, action);
    expect(state).toEqual({
      ...ordersTestInitialState,
      loading: false,
      orderRequest: false,
      newOrder: payload
    });
  });

  it('rejected → loading: false, orderRequest: false, error = payload', () => {
    const action = {
      type: postUserBurderThunk.rejected.type,
      payload: 'Ошибка при оформлении заказа'
    };
    const state = ordersReducer(ordersTestInitialState, action);
    expect(state).toEqual({
      ...ordersTestInitialState,
      loading: false,
      orderRequest: false,
      error: 'Ошибка при оформлении заказа'
    });
  });

  it('не изменяет состояние при неизвестном экшене', () => {
    const action = { type: 'UNKNOWN' };
    const state = ordersReducer(ordersTestInitialState, action);
    expect(state).toEqual(ordersTestInitialState);
  });
});
