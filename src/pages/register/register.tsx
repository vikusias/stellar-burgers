import { FC, SyntheticEvent, useState, useCallback } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { registerUserThunk } from '../../services/user/actions';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();

      // Проверяем, что все поля заполнены
      if (userName.trim() && email.trim() && password.trim()) {
        dispatch(
          registerUserThunk({
            name: userName,
            email: email,
            password: password
          })
        );
      }
    },
    [userName, email, password, dispatch]
  );

  return (
    <RegisterUI
      errorText=''
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
