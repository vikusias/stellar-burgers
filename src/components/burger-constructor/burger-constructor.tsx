import { FC, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { BurgerConstructorUI } from '@ui';
import { TConstructorIngredient } from '@utils-types';
import {
  clearBurger,
  selectBurgerConstructor
} from '../../services/slices/ConstructorSlice';
import {
  selectNewOrder,
  selectOrderRequest,
  setNewOrder
} from '../../services/orders/OrdersSlice';
import { postUserBurderThunk } from '../../services/orders/actions';
import { selectUser } from '../../services/user/UserSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector(selectUser);
  const userBurger = useSelector(selectBurgerConstructor);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectNewOrder).order;

  // Проверка возможности оформления заказа
  const canCreateOrder = userBurger.bun && !orderRequest;

  // Расчет стоимости бургера
  const price = useMemo(() => {
    const bunCost = userBurger.bun ? userBurger.bun.price * 2 : 0;
    const ingredientsCost = userBurger.ingredients.reduce(
      (total: number, ingredient: TConstructorIngredient) =>
        total + ingredient.price,
      0
    );
    return bunCost + ingredientsCost;
  }, [userBurger]);

  const handleOrderClick = useCallback(() => {
    if (!canCreateOrder) return;

    // Если пользователь не авторизован - перенаправляем на страницу входа
    if (!user) {
      navigate('/login', {
        replace: true,
        state: {
          from: {
            ...location,
            background: location.state?.background,
            state: null
          }
        }
      });
      return;
    }

    // Формируем ID ингредиентов для заказа
    const orderIngredients = [
      userBurger.bun!._id,
      ...userBurger.ingredients.map((ingredient) => ingredient._id),
      userBurger.bun!._id
    ];

    // Отправляем заказ и очищаем конструктор
    dispatch(postUserBurderThunk(orderIngredients)).then(() =>
      dispatch(clearBurger())
    );

    // Навигация после оформления заказа
    const from = location.state?.from || { pathname: '/' };
    const backgroundLocation = location.state?.from?.background || null;

    navigate(from, {
      replace: true,
      state: { background: backgroundLocation }
    });
  }, [canCreateOrder, user, userBurger, dispatch, navigate, location]);

  const handleCloseOrderModal = useCallback(() => {
    dispatch(setNewOrder(false));
  }, [dispatch]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={userBurger}
      orderModalData={orderModalData}
      onOrderClick={handleOrderClick}
      closeOrderModal={handleCloseOrderModal}
    />
  );
};
