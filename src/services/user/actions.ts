import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getCookie, setCookie } from '../../utils/cookie';

// Регистрация нового пользователя
export const registerUserThunk = createAsyncThunk(
  'user/register',
  async (userData: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(userData);
      // Побочные эффекты сохранения токенов
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Ошибка регистрации пользователя';
      return rejectWithValue(errorMessage);
    }
  }
);

// Авторизация пользователя
export const loginUserThunk = createAsyncThunk(
  'user/login',
  async (authData: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(authData);
      // Побочные эффекты сохранения токенов
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Ошибка входа в систему';
      return rejectWithValue(errorMessage);
    }
  }
);

// Обновление данных пользователя
export const updateUserThunk = createAsyncThunk(
  'user/update',
  async (updatedData: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(updatedData);
      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Ошибка обновления данных пользователя';
      return rejectWithValue(errorMessage);
    }
  }
);

// Выход из системы
export const logoutUserThunk = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      // Побочные эффекты удаления токенов
      setCookie('accessToken', '', { expires: -1 });
      localStorage.removeItem('refreshToken');
      return null;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Ошибка выхода из системы';
      return rejectWithValue(errorMessage);
    }
  }
);

// Проверка авторизации пользователя
export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    const accessToken = getCookie('accessToken');

    if (!accessToken) {
      return rejectWithValue('Токен отсутствует');
    }

    try {
      const response = await getUserApi();
      return response;
    } catch (error) {
      // Очищаем токены при ошибке
      setCookie('accessToken', '', { expires: -1 });
      localStorage.removeItem('refreshToken');
      const errorMessage =
        error instanceof Error ? error.message : 'Ошибка проверки авторизации';
      return rejectWithValue(errorMessage);
    }
  }
);

// Установка флага проверки авторизации
export const setIsAuthChecked = createAction<boolean>('user/setAuthChecked');
