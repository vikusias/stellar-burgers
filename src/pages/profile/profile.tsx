import { FC, SyntheticEvent, useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { ProfileUI } from '@ui-pages';
import { TRegisterData } from '@api';
import { updateUserThunk } from '../../services/user/actions';
import { selectUser } from '../../services/user/UserSlice';

export const Profile: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [formValue, setFormValue] = useState<Partial<TRegisterData>>({
    name: '',
    email: '',
    password: ''
  });

  // Инициализация формы данными пользователя
  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  }, [user]);

  // Проверка изменений в форме
  const isFormChanged = useCallback(() => {
    if (!user) return false;

    return (
      formValue.name !== user.name ||
      formValue.email !== user.email ||
      !!formValue.password
    );
  }, [formValue, user]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (isFormChanged() && user) {
      dispatch(updateUserThunk(formValue));
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValue((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Если пользователь не загружен, не рендерим компонент
  if (!user) {
    return null;
  }

  return (
    <ProfileUI
      formValue={{
        name: formValue.name || '',
        email: formValue.email || '',
        password: formValue.password || ''
      }}
      isFormChanged={isFormChanged()}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
