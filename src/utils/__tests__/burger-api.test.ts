import * as api from '../burger-api';
import { setCookie, getCookie } from '../cookie';

// Мокаем глобальный fetch
global.fetch = jest.fn();

// Мокаем cookie-утилиты, чтобы контролировать их поведение
jest.mock('../cookie', () => ({
  setCookie: jest.fn(),
  getCookie: jest.fn()
}));

// Мокаем localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('burger-api', () => {
  const mockIngredients = [
    { _id: '1', name: 'Bun', type: 'bun' },
    { _id: '2', name: 'Sauce', type: 'sauce' }
  ];

  const mockOrder = {
    _id: 'order1',
    number: 123,
    status: 'done',
    name: 'Burger',
    createdAt: '',
    updatedAt: '',
    ingredients: ['1', '2']
  };

  const mockFeedsResponse = {
    success: true,
    orders: [mockOrder],
    total: 1,
    totalToday: 1
  };

  const mockAuthResponse = {
    success: true,
    user: { email: 'test@test.com', name: 'Test' },
    accessToken: 'access-token',
    refreshToken: 'refresh-token'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    (fetch as jest.Mock).mockReset();
  });

  describe('checkResponse', () => {
    // Не экспортируется напрямую, но тестируем через функции
  });

  describe('refreshToken', () => {
    it('успешно обновляет токен', async () => {
      const mockRefreshResponse = {
        success: true,
        refreshToken: 'new-refresh',
        accessToken: 'new-access'
      };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockRefreshResponse)
      });

      localStorageMock.setItem('refreshToken', 'old-refresh');

      const result = await api.refreshToken();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/token'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ token: 'old-refresh' })
        })
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'refreshToken',
        'new-refresh'
      );
      expect(setCookie).toHaveBeenCalledWith('accessToken', 'new-access');
      expect(result).toEqual(mockRefreshResponse);
    });

    it('отклоняет промис при неуспешном ответе', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ success: false })
      });

      await expect(api.refreshToken()).rejects.toEqual({ success: false });
    });
  });

  describe('fetchWithRefresh', () => {
    it('успешно выполняет запрос без необходимости обновления токена', async () => {
      const mockData = { success: true, data: 'test' };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockData)
      });

      const result = await api.fetchWithRefresh('https://test.com', {
        method: 'GET'
      });
      expect(result).toEqual(mockData);
    });

    it('при ошибке jwt expired обновляет токен и повторяет запрос', async () => {
      // Первый запрос: ошибка jwt expired
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: false,
          json: jest.fn().mockResolvedValue({ message: 'jwt expired' })
        })
        // Второй запрос после обновления токена: успех
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ success: true, data: 'retry' })
        });

      // Мокаем refreshToken
      jest.spyOn(api, 'refreshToken').mockResolvedValue({
        success: true,
        accessToken: 'new-access',
        refreshToken: 'new-refresh'
      });

      const options = {
        method: 'GET',
        headers: { authorization: 'old-token' }
      };
      const result = await api.fetchWithRefresh('https://test.com', options);

      expect(api.refreshToken).toHaveBeenCalled();
      // Проверим, что заголовок обновлён
      expect(options.headers).toEqual({ authorization: 'new-access' });
      expect(result).toEqual({ success: true, data: 'retry' });
    });

    it('пробрасывает ошибку, если refreshToken не помог', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue({ message: 'jwt expired' })
      });
      jest
        .spyOn(api, 'refreshToken')
        .mockRejectedValue(new Error('Refresh failed'));

      await expect(
        api.fetchWithRefresh('https://test.com', {})
      ).rejects.toThrow('Refresh failed');
    });
  });

  describe('getIngredientsApi', () => {
    it('успешно получает ингредиенты', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest
          .fn()
          .mockResolvedValue({ success: true, data: mockIngredients })
      });

      const result = await api.getIngredientsApi();
      expect(result).toEqual(mockIngredients);
    });

    it('отклоняет промис при неуспешном ответе', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ success: false })
      });

      await expect(api.getIngredientsApi()).rejects.toEqual({ success: false });
    });
  });

  describe('getFeedsApi', () => {
    it('успешно получает ленту заказов', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockFeedsResponse)
      });

      const result = await api.getFeedsApi();
      expect(result).toEqual(mockFeedsResponse);
    });
  });

  describe('getOrdersApi', () => {
    it('успешно получает заказы пользователя', async () => {
      (getCookie as jest.Mock).mockReturnValue('access-token');
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest
          .fn()
          .mockResolvedValue({ success: true, orders: [mockOrder] })
      });

      const result = await api.getOrdersApi();
      expect(result).toEqual([mockOrder]);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/orders'),
        expect.objectContaining({
          headers: expect.objectContaining({ authorization: 'access-token' })
        })
      );
    });
  });

  describe('orderBurgerApi', () => {
    it('успешно создаёт заказ', async () => {
      (getCookie as jest.Mock).mockReturnValue('access-token');
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          success: true,
          order: mockOrder,
          name: 'Burger'
        })
      });

      const result = await api.orderBurgerApi(['ing1', 'ing2']);
      expect(result).toEqual({
        success: true,
        order: mockOrder,
        name: 'Burger'
      });
    });
  });

  describe('getOrderByNumberApi', () => {
    it('успешно получает заказ по номеру', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest
          .fn()
          .mockResolvedValue({ success: true, orders: [mockOrder] })
      });

      const result = await api.getOrderByNumberApi(123);
      expect(result).toEqual({ success: true, orders: [mockOrder] });
    });
  });

  describe('registerUserApi', () => {
    it('успешно регистрирует пользователя', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockAuthResponse)
      });

      const result = await api.registerUserApi({
        email: 'test@test.com',
        password: '123',
        name: 'Test'
      });
      expect(result).toEqual(mockAuthResponse);
    });
  });

  describe('loginUserApi', () => {
    it('успешно логинит пользователя', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockAuthResponse)
      });

      const result = await api.loginUserApi({
        email: 'test@test.com',
        password: '123'
      });
      expect(result).toEqual(mockAuthResponse);
    });
  });

  describe('forgotPasswordApi', () => {
    it('успешно отправляет запрос на сброс пароля', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ success: true })
      });

      const result = await api.forgotPasswordApi({ email: 'test@test.com' });
      expect(result).toEqual({ success: true });
    });
  });

  describe('resetPasswordApi', () => {
    it('успешно сбрасывает пароль', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ success: true })
      });

      const result = await api.resetPasswordApi({
        password: 'new',
        token: 'token'
      });
      expect(result).toEqual({ success: true });
    });
  });

  describe('getUserApi', () => {
    it('успешно получает данные пользователя', async () => {
      (getCookie as jest.Mock).mockReturnValue('access-token');
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest
          .fn()
          .mockResolvedValue({ success: true, user: mockAuthResponse.user })
      });

      const result = await api.getUserApi();
      expect(result).toEqual({ success: true, user: mockAuthResponse.user });
    });
  });

  describe('updateUserApi', () => {
    it('успешно обновляет данные пользователя', async () => {
      (getCookie as jest.Mock).mockReturnValue('access-token');
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest
          .fn()
          .mockResolvedValue({ success: true, user: mockAuthResponse.user })
      });

      const result = await api.updateUserApi({ name: 'New Name' });
      expect(result).toEqual({ success: true, user: mockAuthResponse.user });
    });
  });

  describe('logoutApi', () => {
    it('успешно выполняет logout', async () => {
      localStorageMock.setItem('refreshToken', 'refresh');
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ success: true })
      });

      const result = await api.logoutApi();
      expect(result).toEqual({ success: true });
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/logout'),
        expect.objectContaining({
          body: JSON.stringify({ token: 'refresh' })
        })
      );
    });
  });
});
