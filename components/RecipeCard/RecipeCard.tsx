'use client';

import { useState } from 'react';
import Image from 'next/image';
import css from './RecipeCard.module.css';
import Link from 'next/link';
import { AnyRecipe } from '@/types/recipe';
import { useAuthStore } from '@/lib/store/authStore';
import {
  addFavoriteRecipe,
  removeFavoriteRecipe,
} from '@/lib/services/favorites';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

interface RecipeCardProps {
  recipe: AnyRecipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { isAuthenticated, user } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const queryClient = useQueryClient();
  const pathname = usePathname();

  const isFavorite = user?.savedRecipes?.includes(recipe._id) ?? false;
  const hideFavorite = pathname === '/profile/own';

  const handleFavoriteClick = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    try {
      if (isFavorite) {
        await removeFavoriteRecipe(recipe._id);
        import('izitoast').then((iziToast) => {
          iziToast.default.success({
            title: 'Success',
            message: 'Removed from favorites',
            position: 'topRight',
          });
        });
      } else {
        await addFavoriteRecipe(recipe._id);
        import('izitoast').then((iziToast) => {
          iziToast.default.success({
            title: 'Success',
            message: 'Successfully saved to favorites',
            position: 'topRight',
          });
        });
      }
      // обновляем список избранного
      queryClient.invalidateQueries({ queryKey: ['recipes', 'favorites'] });
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    } catch (error) {
      import('izitoast').then((iziToast) => {
        iziToast.default.error({
          message: `Error toggling favorite!`,
          position: 'topRight',
        });
      });
    }
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

        {!hideFavorite && (
          <button
            className={`${css.favoriteButton} ${isFavorite ? css.active : ''}`}
            onClick={(e) => {
              e.currentTarget.blur();
              handleFavoriteClick();
            }}
            type="button"
          >
            <svg className={css.favoriteIcon} width="14" height="17">
              <use href={`/sprite.svg#favorite`}></use>
            </svg>
          </button>
        )}
      </div>

      {showAuthModal && (
        <ConfirmationModal
          title="Login Required"
          confirmButtonText="Login"
          cancelButtonText="Cancel"
          onConfirm={() => {
            setShowAuthModal(false);
          }}
          onCancel={() => {
            setShowAuthModal(false);
          }}
        />
      )}
    </>
  );
}
