import {
  registerUserThunk,
  loginUserThunk,
  updateUserThunk,
  logoutUserThunk,
  checkUserAuth
} from './actions';
import * as api from '@api';
import * as cookie from '../../utils/cookie';
import { testUser, testLoginResponse } from '../../constants/test-user';

// Мокаем API
jest.mock('@api', () => ({
  registerUserApi: jest.fn(),
  loginUserApi: jest.fn(),
  updateUserApi: jest.fn(),
  logoutApi: jest.fn(),
  getUserApi: jest.fn()
}));

// Мокаем cookie
jest.mock('../../utils/cookie', () => ({
  setCookie: jest.fn(),
  getCookie: jest.fn()
}));

const mockRegisterApi = api.registerUserApi as jest.Mock;
const mockLoginApi = api.loginUserApi as jest.Mock;
const mockUpdateApi = api.updateUserApi as jest.Mock;
const mockLogoutApi = api.logoutApi as jest.Mock;
const mockGetUserApi = api.getUserApi as jest.Mock;
const mockSetCookie = cookie.setCookie as jest.Mock;
const mockGetCookie = cookie.getCookie as jest.Mock;

// Тестовые данные
const testRegisterData = {
  email: 'test@example.com',
  password: 'secret',
  name: 'Test User'
};

const testLoginData = {
  email: 'test@example.com',
  password: 'secret'
};

describe('user thunks', () => {
  const dispatch = jest.fn();

  // Создаём моки для методов localStorage
  let mockSetItem: jest.Mock;
  let mockRemoveItem: jest.Mock;
  let mockGetItem: jest.Mock;
  let localStorageStore: { [key: string]: string } = {};

  beforeEach(() => {
    jest.clearAllMocks();
    dispatch.mockClear();
    localStorageStore = {};

    // Инициализируем моки
    mockSetItem = jest.fn().mockImplementation((key, value) => {
      localStorageStore[key] = value;
    });
    mockRemoveItem = jest.fn().mockImplementation((key) => {
      delete localStorageStore[key];
    });
    mockGetItem = jest
      .fn()
      .mockImplementation((key) => localStorageStore[key] || null);

    // Подменяем глобальный localStorage
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: mockGetItem,
        setItem: mockSetItem,
        removeItem: mockRemoveItem,
        clear: () => {
          localStorageStore = {};
        },
        length: 0,
        key: () => null
      },
      writable: true,
      configurable: true
    });
  });

  afterEach(() => {
    localStorageStore = {};
  });

  describe('registerUserThunk', () => {
    it('успешная регистрация сохраняет токены и возвращает данные', async () => {
      mockRegisterApi.mockResolvedValue(testLoginResponse);

      const thunk = registerUserThunk(testRegisterData);
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(mockRegisterApi).toHaveBeenCalledWith(testRegisterData);
      expect(mockSetCookie).toHaveBeenCalledWith(
        'accessToken',
        testLoginResponse.accessToken
      );
      expect(mockSetItem).toHaveBeenCalledWith(
        'refreshToken',
        testLoginResponse.refreshToken
      );
      expect(result.payload).toEqual(testLoginResponse);
      expect(result.type).toBe('user/register/fulfilled');
    });

    it('ошибка регистрации (Error) передаёт сообщение', async () => {
      const errorMessage = 'Registration failed';
      mockRegisterApi.mockRejectedValue(new Error(errorMessage));

      const thunk = registerUserThunk(testRegisterData);
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe(errorMessage);
      expect(result.type).toBe('user/register/rejected');
    });

    it('ошибка регистрации (не Error) передаёт сообщение по умолчанию', async () => {
      mockRegisterApi.mockRejectedValue('string error');

      const thunk = registerUserThunk(testRegisterData);
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Ошибка регистрации пользователя');
    });
  });

  describe('loginUserThunk', () => {
    it('успешный логин сохраняет токены и возвращает данные', async () => {
      mockLoginApi.mockResolvedValue(testLoginResponse);

      const thunk = loginUserThunk(testLoginData);
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(mockLoginApi).toHaveBeenCalledWith(testLoginData);
      expect(mockSetCookie).toHaveBeenCalledWith(
        'accessToken',
        testLoginResponse.accessToken
      );
      expect(mockSetItem).toHaveBeenCalledWith(
        'refreshToken',
        testLoginResponse.refreshToken
      );
      expect(result.payload).toEqual(testLoginResponse);
    });

    it('ошибка логина (Error) передаёт сообщение', async () => {
      mockLoginApi.mockRejectedValue(new Error('Invalid credentials'));

      const thunk = loginUserThunk(testLoginData);
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Invalid credentials');
    });

    it('ошибка логина (не Error) передаёт сообщение по умолчанию', async () => {
      mockLoginApi.mockRejectedValue(401);

      const thunk = loginUserThunk(testLoginData);
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Ошибка входа в систему');
    });
  });

  describe('updateUserThunk', () => {
    it('успешное обновление возвращает данные', async () => {
      mockUpdateApi.mockResolvedValue(testLoginResponse);

      const thunk = updateUserThunk({ name: 'New Name' });
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(mockUpdateApi).toHaveBeenCalledWith({ name: 'New Name' });
      expect(result.payload).toEqual(testLoginResponse);
    });

    it('ошибка обновления (Error) передаёт сообщение', async () => {
      mockUpdateApi.mockRejectedValue(new Error('Update failed'));

      const thunk = updateUserThunk({});
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Update failed');
    });

    it('ошибка обновления (не Error) передаёт сообщение по умолчанию', async () => {
      mockUpdateApi.mockRejectedValue('error');

      const thunk = updateUserThunk({});
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Ошибка обновления данных пользователя');
    });
  });

  describe('logoutUserThunk', () => {
    it('успешный выход удаляет токены и возвращает null', async () => {
      mockLogoutApi.mockResolvedValue(undefined);

      const thunk = logoutUserThunk();
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(mockLogoutApi).toHaveBeenCalled();
      expect(mockSetCookie).toHaveBeenCalledWith('accessToken', '', {
        expires: -1
      });
      expect(mockRemoveItem).toHaveBeenCalledWith('refreshToken');
      expect(result.payload).toBeNull();
    });

    it('ошибка выхода (Error) передаёт сообщение', async () => {
      mockLogoutApi.mockRejectedValue(new Error('Logout error'));

      const thunk = logoutUserThunk();
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Logout error');
    });

    it('ошибка выхода (не Error) передаёт сообщение по умолчанию', async () => {
      mockLogoutApi.mockRejectedValue('error');

      const thunk = logoutUserThunk();
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Ошибка выхода из системы');
    });
  });

  describe('checkUserAuth', () => {
    it('если нет токена, сразу rejectWithValue', async () => {
      mockGetCookie.mockReturnValue(null);

      const thunk = checkUserAuth();
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Токен отсутствует');
      expect(result.type).toBe('user/checkAuth/rejected');
    });

    it('если токен есть, вызывает getUserApi и возвращает данные', async () => {
      mockGetCookie.mockReturnValue('valid-token');
      mockGetUserApi.mockResolvedValue({ user: testUser });

      const thunk = checkUserAuth();
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(mockGetUserApi).toHaveBeenCalled();
      expect(result.payload).toEqual({ user: testUser });
    });

    it('если токен есть, но API вернул ошибку, очищает токены и reject', async () => {
      mockGetCookie.mockReturnValue('valid-token');
      const error = new Error('Auth failed');
      mockGetUserApi.mockRejectedValue(error);

      const thunk = checkUserAuth();
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(mockSetCookie).toHaveBeenCalledWith('accessToken', '', {
        expires: -1
      });
      expect(mockRemoveItem).toHaveBeenCalledWith('refreshToken');
      expect(result.payload).toBe('Auth failed');
    });

    it('ошибка getUserApi (не Error) передаёт сообщение по умолчанию', async () => {
      mockGetCookie.mockReturnValue('valid-token');
      mockGetUserApi.mockRejectedValue(500);

      const thunk = checkUserAuth();
      const result = await thunk(dispatch, () => ({}), undefined);

      expect(result.payload).toBe('Ошибка проверки авторизации');
    });
  });
});
