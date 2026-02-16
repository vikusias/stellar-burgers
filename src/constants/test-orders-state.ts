import { OrderState } from '../services/orders/OrdersSlice';

// Начальное состояние заказов для тестов
export const ordersTestInitialState: OrderState = {
  feed: {
    // лента заказов
    success: false,
    total: 0,
    totalToday: 0,
    orders: []
  },
  userOrders: [], // заказы текущего пользователя
  orderByNumber: null, // конкретный заказ по номеру
  newOrder: {
    // данные создаваемого заказа
    order: null,
    name: ''
  },
  orderRequest: false, // флаг отправки запроса
  loading: false, // индикатор загрузки
  error: null // ошибка, если есть
};
