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
    // Проверяем, что orderNumber валидный перед вызовом
    if (orderNumber) {
      dispatch(getOrderByNumberThunk(orderNumber));
    }
  }, [dispatch, orderNumber]); // Добавила orderNumber в зависимости

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

    // Функция для преобразования статуса в читаемый текст
    const getStatusText = (status: string): string => {
      switch (status) {
        case 'done':
          return 'Выполнен';
        case 'pending':
          return 'Готовится';
        case 'created':
          return 'Создан';
        default:
          return status;
      }
    };

    // Функция для получения класса цвета статуса
    const getStatusColorClass = (status: string): string => {
      switch (status) {
        case 'done':
          return 'text_color_success'; // Класс для зеленого цвета (#00CCCC)
        case 'pending':
        case 'created':
          return 'text_color_primary'; // Класс для обычного цвета
        default:
          return '';
      }
    };

    // Возвращаем структурированные данные заказа с добавлением статуса
    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
      // Добавляем преобразованный текст статуса и класс для цвета
      statusText: getStatusText(orderData.status),
      statusColorClass: getStatusColorClass(orderData.status)
    };
  }, [orderData, ingredients]);

  // Если данные еще не загружены, показываем прелоадер
  if (!orderInfo) {
    return <Preloader />;
  }

  // Рендерим UI компонент с подготовленной информацией
  return <OrderInfoUI orderInfo={orderInfo} />;
};
