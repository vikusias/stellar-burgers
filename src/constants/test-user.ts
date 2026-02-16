import { TUser } from '@utils-types';

// Тестовый пользователь (мужчина)
export const testUser: TUser = {
  name: 'Александр Сидоров',
  email: 'alex@example.com'
};

// Еще один тестовый пользователь (женщина)
export const anotherTestUser: TUser = {
  name: 'Елена Смирнова',
  email: 'elena@example.com'
};

// Мок-ответа при успешной авторизации (пользователь + токены)
export const testLoginResponse = {
  user: testUser,
  accessToken: 'Bearer test-access-token',
  refreshToken: 'test-refresh-token'
};
