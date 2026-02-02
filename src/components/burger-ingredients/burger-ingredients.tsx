import { useState, useRef, useEffect, FC, useMemo, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { TIngredient, TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../services/ingredients/IngredientsSlice';

export const BurgerIngredients: FC = () => {
  const ingredients: TIngredient[] = useSelector(selectIngredients);

  // Фильтрация ингредиентов по категориям с использованием useMemo
  const { buns, mains, sauces } = useMemo(() => {
    const buns = ingredients.filter((ing: TIngredient) => ing.type === 'bun');
    const mains = ingredients.filter((ing: TIngredient) => ing.type === 'main');
    const sauces = ingredients.filter(
      (ing: TIngredient) => ing.type === 'sauce'
    );

    return { buns, mains, sauces };
  }, [ingredients]);

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');

  // Рефы для заголовков категорий
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  // Наблюдатели за видимостью категорий
  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewFilling] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  // Обновление активной вкладки при скролле
  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  // Обработчик клика по вкладке
  const handleTabClick = useCallback((tab: string) => {
    const tabMode = tab as TTabMode;
    setCurrentTab(tabMode);

    // Прокрутка к соответствующей категории
    const refMap = {
      bun: titleBunRef,
      main: titleMainRef,
      sauce: titleSaucesRef
    };

    const currentRef = refMap[tabMode];
    if (currentRef?.current) {
      currentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={handleTabClick}
    />
  );
};
