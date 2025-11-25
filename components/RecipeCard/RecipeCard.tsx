'use client';

import { useState, useEffect, useRef } from 'react';
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
import { usePathname, useRouter } from 'next/navigation';
import { showError, showSuccess } from '@/utils/toast';
import { deleteMyRecipe } from '@/lib/api/clientApi';
import Loader from '@/components/Loader/Loader';

interface RecipeCardProps {
  recipe: AnyRecipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { isAuthenticated, user } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingAddFavorite, setShowLoadingAddFavorite] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = usePathname();

  const ownerId =
    typeof recipe.owner === 'object' ? recipe.owner._id : recipe.owner;
  const isFavorite = user?.savedRecipes?.includes(recipe._id) ?? false;
  const isMyRecipe = user?._id === ownerId;
  const isOwnRecipesPage = pathname === '/profile/own';
  const showDeleteButton = isMyRecipe && isOwnRecipesPage;

  const [optimisticFavorite, setOptimisticFavorite] = useState(isFavorite);
  const isUpdating = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!isUpdating.current) {
      setOptimisticFavorite(isFavorite);
    }
  }, [isFavorite]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    const previousState = optimisticFavorite;
    isUpdating.current = true;
    setIsLoading(true);

    try {
      if (previousState) {
        setShowLoadingAddFavorite(true);
        await removeFavoriteRecipe(recipe._id);
        timeoutRef.current = setTimeout(() => {
          setOptimisticFavorite(false);
          setShowLoadingAddFavorite(false);
          queryClient.invalidateQueries({ queryKey: ['recipes', 'favorites'] });
          queryClient.invalidateQueries({ queryKey: ['recipes'] });
          isUpdating.current = false;
        }, 600);
        await showSuccess('Removed from favorites');
      } else {
        setShowLoadingAddFavorite(true);
        await addFavoriteRecipe(recipe._id);
        timeoutRef.current = setTimeout(() => {
          setOptimisticFavorite(true);
          setShowLoadingAddFavorite(false);
          queryClient.invalidateQueries({ queryKey: ['recipes', 'favorites'] });
          queryClient.invalidateQueries({ queryKey: ['recipes'] });
          isUpdating.current = false;
        }, 600);
        await showSuccess('Recipe saved to favorites');
      }
    } catch {
      setOptimisticFavorite(previousState);
      isUpdating.current = false;
      await showError('Error toggling favorite!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isAuthenticated || !isMyRecipe) return;
    setIsLoading(true);

    try {
      setShowLoadingAddFavorite(true);
      setOptimisticFavorite(false); // оптимистично сразу
      await deleteMyRecipe({ recipeId: recipe._id });
      await new Promise((resolve) => setTimeout(resolve, 600));
      await queryClient.invalidateQueries({
        queryKey: ['recipes', 'favorites'],
      });
      await queryClient.invalidateQueries({ queryKey: ['recipes'] });
      await showSuccess('Recipe deleted successfully');
    } catch (error) {
      setOptimisticFavorite(true);
      await showError('Error deleting recipe!');
    } finally {
      setShowLoadingAddFavorite(false);
      isUpdating.current = false;
      setIsLoading(false);
    }
  };

  return (
    <>
      <Image
        src={recipe.thumb || '/img-default/default-img-desktop.jpg'}
        alt={recipe.title}
        width={300}
        height={300}
        className={css.img}
      />

      <div className={css.titleWrapper}>
        <h2 className={css.title}>{recipe.title}</h2>
        <div className={css.timeWrapper}>
          <svg className={css.timeIcon} width="24" height="24">
            <use href="/sprite-new.svg#icon-clock-medium"></use>
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
          <span className="visually-hidden"> about {recipe.title}</span>
        </Link>

        {showDeleteButton ? (
          <button
            type="button"
            className={css.deleteBtn}
            onClick={handleDelete}
            disabled={isLoading}
            aria-label="Delete this recipe from favorites"
          >
            <svg className={css.deleteBtnIcon} width="24" height="24">
              <use href="/sprite-new.svg#icon-bin-medium" />
            </svg>
          </button>
        ) : (
          <button
            className={`${css.favoriteButton} ${optimisticFavorite ? css.active : ''}`}
            onClick={handleFavorite}
            type="button"
            disabled={isLoading}
            aria-label={
              optimisticFavorite ? 'Remove from favorites' : 'Add to favorites'
            }
          >
            <svg className={css.favoriteIcon} width="14" height="17">
              <use href="/sprite-new.svg#favorite"></use>
            </svg>
          </button>
        )}
      </div>

      {showAuthModal && (
        <ConfirmationModal
          title="Error while saving"
          paragraph="To save this recipe, you need to authorize first"
          confirmButtonText="Log in"
          confirmSecondButtonText="Register"
          onConfirm={() => {
            setShowAuthModal(false);
            router.push('/auth/login');
          }}
          onConfirmSecond={() => {
            router.push('/auth/register');
            setShowAuthModal(false);
          }}
          onClose={() => {
            setShowAuthModal(false);
          }}
          confirmButtonVariant="Login"
          confirmSecondButtonVariant="Register"
          reverseOrder
        />
      )}
      {showLoadingAddFavorite && (
        <div className={css.loadingOverlay}>
          <Loader />
        </div>
      )}
    </>
  );
}
