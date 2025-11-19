'use client';

import RecipeCard from '../RecipeCard/RecipeCard';
import LoadMoreBtn from '../LoadMoreBtn/LoadMoreBtn';
import { Recipe } from '@/types/recipe';
import { useSearchStore } from '@/lib/store/useSearchStore';
import { useMutation, useInfiniteQuery } from '@tanstack/react-query';
import {
  addToFavorite,
  getAllRecipes,
  removeFromFavorite,
} from '@/lib/api/clientApi';
import Loader from '../Loader/Loader';
import { useState } from 'react';
import Filters from '../Filters/Filters';
import css from './RecipesList.module.css';
import Container from '../Container/Container';
import { useFiltersStore } from '@/lib/store/useFiltersStore';
import { AuthModal } from '../AuthModal/AuthModal';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import iziToast from 'izitoast';

export interface Props {
  recipes: Recipe[];
  hasMore: boolean;
  loadMore: () => void;
}

export function RecipesList() {
  const search = useSearchStore((state) => state.searchQuery) || null;
  const category = useFiltersStore((state) => state.category) || null;
  const ingredient = useFiltersStore((state) => state.ingredient) || null;
  const router = useRouter();
  const { user, addSavedRecipe, removeSavedRecipe } = useAuthStore();

  const [isOpenAuthModal, setIsOpenAuthModal] = useState(false);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['recipes', { search, category, ingredient }],
      initialPageParam: 1,
      queryFn: ({ pageParam = 1 }) =>
        getAllRecipes({
          page: pageParam.toString(),
          search,
          category,
          ingredient,
        }),
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.totalPages > allPages.length) {
          return allPages.length + 1;
        }
        return undefined;
      },
    });

  const { mutateAsync: mutateAddToFavorite } = useMutation({
    mutationKey: ['recipes'],
    mutationFn: addToFavorite,
    onSuccess(_, variables) {
      addSavedRecipe(variables.recipeId);
      // iziToast.success({
      //   title: 'Success',
      //   message: data.message || 'Successfully saved to favorites',
      //   position: 'topRight',
      // });
    },
    onError(error) {
      iziToast.error({
        title: 'Error',
        message: error?.message || 'Something went wrong',
        position: 'topRight',
      });
    },
  });

  const { mutateAsync: mutateRemoveFromFavorite } = useMutation({
    mutationKey: ['recipes'],
    mutationFn: removeFromFavorite,
    onSuccess(_, variables) {
      removeSavedRecipe(variables.recipeId);
    },
    onError(error) {
      iziToast.error({
        title: 'Error',
        message: error?.message || 'Something went wrong',
        position: 'topRight',
      });
    },
  });
  const recipes = data?.pages.flatMap((p) => p.recipes) ?? [];

  const handleOpenAuthModal = () => {
    setIsOpenAuthModal(true);
  };

  const handleCloseAuthModal = () => {
    setIsOpenAuthModal(false);
  };
  const handleNavigateLogin = () => {
    handleCloseAuthModal();
    router.push('/auth/login');
  };
  const handleNavigateRegister = () => {
    handleCloseAuthModal();
    router.push('/auth/register');
  };

  const handleFavoriteClick = (recipeId: string) => {
    if (!user) {
      handleOpenAuthModal();
      return;
    }
    const userHasRecipe = user?.savedRecipes.includes(recipeId);

    if (userHasRecipe) {
      mutateRemoveFromFavorite({ recipeId });
    } else {
      mutateAddToFavorite({ recipeId });
    }
  };

  if (isLoading || !data) {
    return <Loader />;
  }

  return (
    <Container>
      <h1 className={css.titleRecipes}>Recipes</h1>

      <Filters totalRecipes={recipes.length} />

      <ul className={css.listRecipes}>
        {recipes.map((recipe) => (
          <li key={recipe._id} className={css.oneRecipe}>
            <RecipeCard
              recipe={recipe}
              isFavorite={Boolean(
                user && user.savedRecipes.includes(recipe._id),
              )}
              onFavoriteClick={handleFavoriteClick}
            />
          </li>
        ))}
      </ul>

      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <LoadMoreBtn
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
          />
        </div>
      )}
      {isOpenAuthModal && (
        <AuthModal
          onLogin={handleNavigateLogin}
          onRegister={handleNavigateRegister}
          onClose={handleCloseAuthModal}
        />
      )}
    </Container>
  );
}
