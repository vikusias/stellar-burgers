import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Получение ленты заказов (общедоступная лента)
export const getFeedsThunk = createAsyncThunk(
  'feeds/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFeedsApi();
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Ошибка загрузки ленты заказов';
      return rejectWithValue(errorMessage);
    }
  }
);

// Получение информации о заказе по номеру
export const getOrderByNumberThunk = createAsyncThunk(
  'orders/getByNumber',
  async (orderNumber: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(orderNumber);
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Ошибка получения заказа по номеру';
      return rejectWithValue(errorMessage);
    }
  }
);

// Создание заказа (оформление бургера)
export const postUserBurderThunk = createAsyncThunk(
  'orders/create',
  async (ingredientIds: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredientIds);
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Ошибка создания заказа';
      return rejectWithValue(errorMessage);
    }
  }
);

// Получение заказов текущего пользователя
export const getUserOrdersThunk = createAsyncThunk(
  'orders/getUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getOrdersApi();
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Ошибка загрузки заказов пользователя';
      return rejectWithValue(errorMessage);
    }
  }
);
