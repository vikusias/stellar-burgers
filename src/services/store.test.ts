import { rootReducer } from './reducers';

// Тестируем инициализацию Redux store
describe('Redux store', () => {
  // Проверяем, что при неизвестном экшене возвращается начальное состояние всех слайсов
  test('initialization of the rootReducer', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const result = rootReducer(undefined, action);

    // Ожидаемая структура состояния со значениями по умолчанию для каждого слайса
    expect(result).toEqual({
      myconstructor: {
        // конструктор бургера
        burger: {
          bun: null,
          ingredients: []
        },
        isLoading: false,
        error: undefined
      },
      orders: {
        // заказы
        feed: {
          success: false,
          total: 0,
          totalToday: 0,
          orders: []
        },
        userOrders: [],
        orderByNumber: null,
        newOrder: {
          order: null,
          name: ''
        },
        orderRequest: false,
        loading: false,
        error: null
      },
      ingredients: {
        // ингредиенты
        ingredients: [],
        loading: false,
        error: null
      },
      user: {
        // пользователь
        user: null,
        isAuthChecked: false,
        loading: false,
        error: null
      }
    });
  });
});
