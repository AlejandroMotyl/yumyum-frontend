// 'use client';

// import { useState } from 'react';
// import Image from 'next/image';
// import css from './RecipeCard.module.css';
// import Link from 'next/link';
// import { Recipe } from '@/types/recipe';

// interface RecipeCardProps {
//   recipe: Recipe;
// }

// export default function RecipeCard({ recipe }: RecipeCardProps) {
//   const [isFavorite, setIsFavorite] = useState(false);

//   return (
//     <>
//       <Image
//         src={
//           recipe?.thumb ? recipe.thumb : '/img-default/default-img-desktop.jpg'
//         }
//         alt={recipe.title}
//         width={300}
//         height={300}
//         className={css.img}
//       />

//       <div className={css.titleWrapper}>
//         <h2 className={css.title}>{recipe.title}</h2>
//         <div className={css.timeWrapper}>
//           <svg className={css.timeIcon} width="15" height="15">
//             <use href="/sprite.svg#clock"></use>
//           </svg>
//           <span className={css.recipeTime}>{recipe.time}</span>
//         </div>
//       </div>

//       <div className={css.descriptionWrapper}>
//         <p className={css.description}>{recipe.description}</p>
//         <p className={css.descriptionCals}>~{recipe.cals} cals</p>
//       </div>

//       <div className={css.buttonWrapper}>
//         <Link href={`/recipes/${recipe._id}`} className={css.button}>
//           Learn more
//         </Link>

//         <button
//           className={`${css.favoriteButton} ${isFavorite ? css.active : ''}`}
//           onClick={(e) => {
//             e.currentTarget.blur();
//             setIsFavorite(!isFavorite);
//           }}
//           type="button"
//         >
//           <svg className={css.favoriteIcon} width="14" height="17">
//             <use href={`/sprite.svg#favorite`}></use>
//           </svg>
//         </button>
//       </div>
//     </>
//   );
// }
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';

import 'izitoast/dist/css/iziToast.min.css';

import { Recipe } from '@/types/recipe';
import { addFavoriteRecipe, removeFavoriteRecipe } from '@/lib/api/clientApi';
import css from './RecipeCard.module.css';

interface RecipeCardProps {
  recipe: Recipe;
  type?: 'default' | 'own' | 'favorites';
  onRemoveFavorite?: (recipeId: string) => Promise<void>;
}

export default function RecipeCard({
  recipe,
  type = 'default',
  onRemoveFavorite,
}: RecipeCardProps) {
  const queryClient = useQueryClient();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFavorite = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      if (isFavorite) {
        await removeFavoriteRecipe(recipe._id);
        setIsFavorite(false);

        import('izitoast').then(({ default: iziToast }) => {
          iziToast.success({
            title: 'Успіх',
            message: 'Рецепт видалено з улюблених',
            position: 'topRight',
            timeout: 3000,
          });
        });
      } else {
        await addFavoriteRecipe(recipe._id);
        setIsFavorite(true);
        import('izitoast').then(({ default: iziToast }) => {
          iziToast.success({
            title: 'Успіх',
            message: 'Рецепт додано до улюблених',
            position: 'topRight',
            timeout: 3000,
          });
        });
      }

      queryClient.invalidateQueries({ queryKey: ['recipes', 'favorites'] });
    } catch (error) {
      import('izitoast').then(({ default: iziToast }) => {
        iziToast.error({
          title: 'Помилка',
          message: 'Не вдалося виконати операцію',
          position: 'topRight',
          timeout: 3000,
        });
      });

      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromFavorites = async () => {
    if (isLoading || !onRemoveFavorite) return;

    setIsLoading(true);

    try {
      await onRemoveFavorite(recipe._id);
    } catch (error) {
      console.error('Error in handleRemoveFromFavorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderActionButton = () => {
    if (type === 'own') {
      return null;
    }

    if (type === 'favorites') {
      return (
        <button
          className={`${css.favoriteButton} ${css.active} ${css.removeButton}`}
          onClick={(e) => {
            e.currentTarget.blur();
            handleRemoveFromFavorites();
          }}
          disabled={isLoading}
          type="button"
          title="Видалити з улюблених"
        >
          <svg className={css.favoriteIcon} width="14" height="17">
            <use href="/sprite.svg#favorite"></use>
          </svg>
        </button>
      );
    }

    return (
      <button
        className={`${css.favoriteButton} ${isFavorite ? css.active : ''}`}
        onClick={(e) => {
          e.currentTarget.blur();
          handleToggleFavorite();
        }}
        disabled={isLoading}
        type="button"
        title={isFavorite ? 'Видалити з улюблених' : 'Додати до улюблених'}
      >
        <svg className={css.favoriteIcon} width="14" height="17">
          <use href="/sprite.svg#favorite"></use>
        </svg>
      </button>
    );
  };

  return (
    <>
      <Image
        src={
          recipe?.thumb ? recipe.thumb : '/img-default/default-img-desktop.jpg'
        }
        alt={recipe.title}
        width={300}
        height={300}
        className={css.img}
      />

      <div className={css.titleWrapper}>
        <h2 className={css.title}>{recipe.title}</h2>
        <div className={css.timeWrapper}>
          <svg className={css.timeIcon} width="15" height="15">
            <use href="/sprite.svg#clock"></use>
          </svg>
          <span className={css.recipeTime}>{recipe.time}</span>
        </div>
      </div>

      <div className={css.descriptionWrapper}>
        <p className={css.description}>{recipe.description}</p>
        <p className={css.descriptionCals}>~{recipe.cals} cals</p>
      </div>

      <div className={css.buttonWrapper}>
        <Link href={`/recipes/${recipe._id}`} className={css.button}>
          Learn more
        </Link>

        {renderActionButton()}
      </div>
    </>
  );
}
