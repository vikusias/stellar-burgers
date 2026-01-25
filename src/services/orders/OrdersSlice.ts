import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import {
  getFeedsThunk,
  getOrderByNumberThunk,
  getUserOrdersThunk,
  postUserBurderThunk
} from '../orders/actions';

// Определяем локальный тип TFeedsResponse, поскольку он не экспортируется из @api
type TFeedsResponse = {
  success: boolean;
  total: number;
  totalToday: number;
  orders: TOrder[];
};

export interface OrderState {
  feed: TFeedsResponse;
  userOrders: TOrder[];
  orderByNumber: TOrder | null;
  newOrder: {
    order: TOrder | null;
    name: string;
  };
  orderRequest: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
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
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setNewOrder: (state, action: PayloadAction<boolean>) => {
      state.orderRequest = action.payload;
      state.newOrder.order = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // ------- ЛЕНТА ЗАКАЗОВ -------
      .addCase(getFeedsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getFeedsThunk.fulfilled,
        (state, action: PayloadAction<TFeedsResponse>) => {
          state.loading = false;
          state.feed = action.payload;
        }
      )
      .addCase(getFeedsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ------- ЗАКАЗ ПО НОМЕРУ -------
      .addCase(getOrderByNumberThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orderByNumber = null;
      })
      .addCase(getOrderByNumberThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Безопасное получение первого заказа из массива
        state.orderByNumber = action.payload.orders[0] || null;
      })
      .addCase(getOrderByNumberThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ------- СОЗДАНИЕ НОВОГО ЗАКАЗА -------
      .addCase(postUserBurderThunk.pending, (state) => {
        state.loading = true;
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(postUserBurderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orderRequest = false;
        state.newOrder = {
          order: action.payload.order,
          name: action.payload.name
        };
      })
      .addCase(postUserBurderThunk.rejected, (state, action) => {
        state.loading = false;
        state.orderRequest = false;
        state.error = action.payload as string;
      })

      // ------- ЗАКАЗЫ ПОЛЬЗОВАТЕЛЯ -------
      .addCase(getUserOrdersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getUserOrdersThunk.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.loading = false;
          state.userOrders = action.payload;
        }
      )
      .addCase(getUserOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
  selectors: {
    selectFeedOrders: (state) => state.feed.orders,
    selectOrdersLoading: (state) => state.loading,
    selectOrderByNumber: (state) => state.orderByNumber,
    selectFeed: (state) => state.feed,
    selectNewOrder: (state) => state.newOrder,
    selectOrderRequest: (state) => state.orderRequest,
    selectUserOrders: (state) => state.userOrders
  }
});

export const {
  selectFeedOrders,
  selectOrdersLoading,
  selectOrderByNumber,
  selectFeed,
  selectNewOrder,
  selectOrderRequest,
  selectUserOrders
} = ordersSlice.selectors;

export const ordersReducer = ordersSlice.reducer;
export const { setNewOrder } = ordersSlice.actions;
