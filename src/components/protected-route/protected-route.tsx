import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { selectIsAuthChecked, selectUser } from '../../services/user/UserSlice';

export const ProtectedRoute: FC<{ children: React.ReactElement }> = ({
  children
}) => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);
  const location = useLocation();

  // Пока проверка авторизации не завершена - показываем прелоадер
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Если пользователь авторизован - разрешаем доступ
  if (user) {
    return children;
  }

  // Перенаправляем неавторизованных пользователей на страницу входа
  return (
    <Navigate
      to='/login'
      state={{
        from: {
          ...location,
          background: location.state?.background,
          state: null
        }
      }}
      replace
    />
  );
};

export const UnAuthRoute: FC<{ children: React.ReactElement }> = ({
  children
}) => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);
  const location = useLocation();

  const backgroundLocation = location.state?.from?.background || null;
  const from = location.state?.from || { pathname: '/' };

  // Пока проверка авторизации не завершена - показываем прелоадер
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Если пользователь не авторизован - разрешаем доступ
  if (!user) {
    return children;
  }

  // Перенаправляем авторизованных пользователей на предыдущую страницу или главную
  return (
    <Navigate replace to={from} state={{ background: backgroundLocation }} />
  );
};
