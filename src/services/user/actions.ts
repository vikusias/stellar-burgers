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
import { setUser } from './UserSlice';
import { getCookie, setCookie } from '../../utils/cookie';

// Регистрация нового пользователя
export const registerUserThunk = createAsyncThunk(
  'user/register',
  async (userData: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(userData);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Ошибка регистрации пользователя'
      );
    }
  }
);

// Авторизация пользователя
export const loginUserThunk = createAsyncThunk(
  'user/login',
  async (authData: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(authData);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка входа в систему');
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
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Ошибка обновления данных пользователя'
      );
    }
  }
);

// Выход из системы
export const logoutUserThunk = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      // Удаляем токен с помощью установки пустой строки и истечения срока
      setCookie('accessToken', '', { expires: -1 });
      localStorage.removeItem('refreshToken');
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Ошибка выхода из системы');
    }
  }
);

// Проверка авторизации пользователя
export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { dispatch, rejectWithValue }) => {
    const accessToken = getCookie('accessToken');

    if (!accessToken) {
      return rejectWithValue('Токен отсутствует');
    }

    try {
      const response = await getUserApi();
      dispatch(setUser(response.user));
      return response;
    } catch (error: any) {
      // Очищаем токены при ошибке
      setCookie('accessToken', '', { expires: -1 });
      localStorage.removeItem('refreshToken');
      return rejectWithValue(error.message || 'Ошибка проверки авторизации');
    }
  }
);

// Установка флага проверки авторизации
export const setIsAuthChecked = createAction<boolean>('user/setAuthChecked');
