import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { loginUserThunk } from '../../services/user/actions';
import { selectUserLoading } from '../../services/user/UserSlice';

export const Login: FC = () => {
  const [email, setEmail] = useState('victoria0412@gmail.ru');
  const [password, setPassword] = useState('9087654321');
  const dispatch = useDispatch();
  const loading = useSelector(selectUserLoading);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (email.trim() && password.trim()) {
      dispatch(loginUserThunk({ email, password }));
    }
  };

  // Показываем прелоадер во время загрузки
  if (loading) {
    return <Preloader />;
  }

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
