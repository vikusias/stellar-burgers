import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { selectIngredients } from '../../services/ingredients/IngredientsSlice';
import { selectOrderByNumber } from '../../services/orders/OrdersSlice';
import { getOrderByNumberThunk } from '../../services/orders/actions';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const orderNumber = Number(number);
  const dispatch = useDispatch();

  const orderData = useSelector(selectOrderByNumber);
  const ingredients: TIngredient[] = useSelector(selectIngredients);

  useEffect(() => {
    if (orderNumber) {
      dispatch(getOrderByNumberThunk(orderNumber));
    }
  }, [dispatch, orderNumber]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    // Создаем объект с информацией об ингредиентах и их количестве
    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, ingredientId) => {
        if (!acc[ingredientId]) {
          const ingredient = ingredients.find(
            (ing) => ing._id === ingredientId
          );
          if (ingredient) {
            acc[ingredientId] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[ingredientId].count++;
        }

        return acc;
      },
      {}
    );

    // Вычисляем общую стоимость заказа
    const total = Object.values(ingredientsInfo).reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    // Возвращаем полную информацию о заказе
    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
