import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectUser } from '../../services/user/UserSlice';
import styles from './app-header.module.css';

export const AppHeader: FC = () => {
  const userName = useSelector(selectUser)?.name;

  return (
    <>
      {/* Навигация сверху */}
      <nav className={styles.nav}>
        <div className={styles.navSection}>
          <NavLink
            to='/'
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
            end
          >
            Конструктор
          </NavLink>
          <NavLink
            to='/feed'
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            Лента заказов
          </NavLink>
        </div>

        <div className={styles.logo}>{/* Логотип будет в AppHeaderUI */}</div>

        <div className={styles.navSection}>
          <NavLink
            to='/profile'
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            <span>{userName || 'Личный кабинет'}</span>
          </NavLink>
        </div>
      </nav>

      {/* Оставляем AppHeaderUI для отображения имени пользователя */}
      <AppHeaderUI userName={userName ? userName : ''} />
    </>
  );
};
