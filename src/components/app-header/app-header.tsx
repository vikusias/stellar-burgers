import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectUser } from '../../services/user/UserSlice';
import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  Logo
} from '@zlden/react-developer-burger-ui-components';
import styles from './app-header.module.css';

export const AppHeader: FC = () => {
  const userName = useSelector(selectUser)?.name;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Левая часть навигации */}
        <nav className={styles.nav}>
          <div className={styles.navSection}>
            <NavLink
              to='/'
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.linkActive : ''}`
              }
              end
            >
              {({ isActive }) => (
                <>
                  <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
                  <span
                    className={`${styles.linkText} text text_type_main-default ml-2`}
                  >
                    Конструктор
                  </span>
                </>
              )}
            </NavLink>

            <NavLink
              to='/feed'
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.linkActive : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <ListIcon type={isActive ? 'primary' : 'secondary'} />
                  <span
                    className={`${styles.linkText} text text_type_main-default ml-2`}
                  >
                    Лента заказов
                  </span>
                </>
              )}
            </NavLink>
          </div>
        </nav>

        {/* Центр - логотип */}
        <div className={styles.logo}>
          <NavLink to='/'>
            {/* Добавляем className для Logo */}
            <Logo className={styles.logoIcon} />
          </NavLink>
        </div>

        {/* Правая часть - личный кабинет */}
        <div className={`${styles.navSection} ${styles.profileSection}`}>
          <NavLink
            to='/profile'
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.linkActive : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
                <span
                  className={`${styles.linkText} text text_type_main-default ml-2`}
                >
                  {userName || 'Личный кабинет'}
                </span>
              </>
            )}
          </NavLink>
        </div>
      </div>
    </header>
  );
};
