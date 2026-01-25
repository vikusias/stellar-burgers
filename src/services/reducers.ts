import { combineSlices } from '@reduxjs/toolkit';

// Импорт слайсов для различных частей состояния
import { ingredientsSlice } from './ingredients/IngredientsSlice';
import { constructorSlice } from '../services/slices/ConstructorSlice';
import { userSlice } from './user/UserSlice';
import { ordersSlice } from './orders/OrdersSlice';

// Комбинирование всех слайсов в корневой редьюсер
export const rootReducer = combineSlices(
  ingredientsSlice,
  constructorSlice,
  userSlice,
  ordersSlice
);
