import { getIngredientsApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

// Получение списка ингредиентов с сервера
export const getIngredientsThunk = createAsyncThunk(
  'ingredients/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getIngredientsApi();
      return response as TIngredient[];
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Не удалось загрузить список ингредиентов';
      return rejectWithValue(errorMessage);
    }
  }
);
