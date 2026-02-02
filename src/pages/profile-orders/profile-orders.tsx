import { FC, useEffect, useCallback } from 'react';
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { selectUser } from '../../services/user/UserSlice';
import {
  selectNewOrder,
  selectUserOrders
} from '../../services/orders/OrdersSlice';
import { getUserOrdersThunk } from '../../services/orders/actions';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const orders: TOrder[] = useSelector(selectUserOrders);
  const newOrder = useSelector(selectNewOrder);

  // Загрузка заказов пользователя
  const loadUserOrders = useCallback(() => {
    if (user) {
      dispatch(getUserOrdersThunk());
    }
  }, [dispatch, user]);

  // Эффект для загрузки заказов при изменении пользователя или нового заказа
  useEffect(() => {
    loadUserOrders();
  }, [loadUserOrders, newOrder]);

  return <ProfileOrdersUI orders={orders} />;
};
