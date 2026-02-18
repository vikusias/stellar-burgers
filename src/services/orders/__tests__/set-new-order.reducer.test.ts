import { ordersReducer, setNewOrder } from '../OrdersSlice';
import { ordersTestInitialState } from '../../../constants/test-orders-state';
import { testOrder } from '../../../constants/test-orders';

describe('setNewOrder reducer', () => {
  it('устанавливает orderRequest = true и сбрасывает newOrder.order', () => {
    const action = setNewOrder(true);
    const state = ordersReducer(
      {
        ...ordersTestInitialState,
        newOrder: {
          order: testOrder,
          name: testOrder.name
        }
      },
      action
    );
    expect(state).toEqual({
      ...ordersTestInitialState,
      orderRequest: true,
      newOrder: {
        order: null,
        name: testOrder.name
      }
    });
  });

  it('устанавливает orderRequest = false и сбрасывает newOrder.order', () => {
    const action = setNewOrder(false);
    const state = ordersReducer(
      {
        ...ordersTestInitialState,
        newOrder: {
          order: testOrder,
          name: testOrder.name
        }
      },
      action
    );
    expect(state).toEqual({
      ...ordersTestInitialState,
      orderRequest: false,
      newOrder: {
        order: null,
        name: testOrder.name
      }
    });
  });

  it('не изменяет состояние при неизвестном экшене', () => {
    const action = { type: 'UNKNOWN' };
    const state = ordersReducer(ordersTestInitialState, action);
    expect(state).toEqual(ordersTestInitialState);
  });
});
