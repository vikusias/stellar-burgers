import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { selectIngredients } from '../../services/ingredients/IngredientsSlice';
import { useParams } from 'react-router-dom';
import { selectOrderByNumber } from '../../services/orders/OrdersSlice';
import { getOrderByNumberThunk } from '../../services/orders/actions';

// Компонент для отображения деталей заказа в модальном окне
// Используется при клике на заказ в ленте заказов
export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const orderNumber = Number(number);

  const orderData = useSelector(selectOrderByNumber);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrderByNumberThunk(orderNumber));
  }, []);

  const ingredients: TIngredient[] = useSelector(selectIngredients);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    // Преобразуем массив ID ингредиентов в объект с информацией о каждом ингредиенте
    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    // Возвращаем структурированные данные заказа
    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  // Если данные еще не загружены, показываем прелоадер
  if (!orderInfo) {
    return <Preloader />;
  }

  // Рендерим UI компонент с подготовленной информацией
  return <OrderInfoUI orderInfo={orderInfo} />;
};
