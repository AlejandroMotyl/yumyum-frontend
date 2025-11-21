// import ProfileNavigation from '@/components/ProfileNavigation/ProfileNavigation';

// export default function ProfilePage() {
//   return (
//     <main>
//       <ProfileNavigation />
//     </main>
//   );
// }
// app/(private routes)/profile/[recipeType]/page.tsx
// app/(private routes)/profile/[recipeType]/page.tsx

'use client';

import { useParams, notFound } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

import 'izitoast/dist/css/iziToast.min.css';

import ProfileNavigation from '@/components/ProfileNavigation/ProfileNavigation';
import { RecipesList } from '@/components/RecipesList/RecipesList';
import {
  getOwnRecipes,
  getFavoriteRecipes,
  removeFavoriteRecipe,
} from '@/lib/api/clientApi';
import { Recipe, RecipeFavorite } from '@/types/recipe';

type RecipeType = 'own' | 'favorites';

interface RecipesResponse {
  page: number;
  perPage: number;
  totalRecipes: number;
  totalPages: number;
  recipes: Recipe[] | RecipeFavorite[];
}

export default function ProfilePage() {
  const params = useParams();
  const recipeType = params.recipeType as RecipeType;
  const queryClient = useQueryClient();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [page, setPage] = useState('1');

  if (recipeType !== 'own' && recipeType !== 'favorites') {
    notFound();
  }

  useEffect(() => {
    setRecipes([]);
    setPage('1');
  }, [recipeType]);

  const fetchFunction =
    recipeType === 'own' ? getOwnRecipes : getFavoriteRecipes;

  const { data, isLoading, error } = useQuery<RecipesResponse>({
    queryKey: ['recipes', recipeType, page],
    queryFn: () => fetchFunction({ page }),
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    if (data?.recipes && Array.isArray(data.recipes)) {
      const normalizedRecipes = data.recipes.map((recipe) => {
        if (
          'owner' in recipe &&
          recipe.owner &&
          typeof recipe.owner === 'object'
        ) {
          const favRecipe = recipe as RecipeFavorite;
          return {
            ...favRecipe,
            owner: favRecipe.owner._id,
          } as Recipe;
        }

        return recipe as Recipe;
      });

      setRecipes((prev) => [...prev, ...normalizedRecipes]);
    }
  }, [data]);

  const hasMore = data ? data.totalPages > Number(page) : false;

  const handleLoadMore = () => {
    const next = Number(page) + 1;
    setPage(String(next));
  };

  const handleRemoveFavorite = async (recipeId: string) => {
    try {
      await removeFavoriteRecipe(recipeId);
      import('izitoast').then(({ default: iziToast }) => {
        iziToast.success({
          title: 'Успіх',
          message: 'Рецепт видалено з улюблених',
          position: 'topRight',
          timeout: 3000,
        });
      });
      setRecipes((prev) => prev.filter((recipe) => recipe._id !== recipeId));

      queryClient.invalidateQueries({ queryKey: ['recipes', 'favorites'] });
    } catch (error) {
      import('izitoast').then(({ default: iziToast }) => {
        iziToast.error({
          title: 'Помилка',
          message: 'Не вдалося видалити рецепт',
          position: 'topRight',
          timeout: 3000,
        });
      });
      console.error('Error removing favorite:', error);
    }
  };

  const titles = {
    own: 'My Recipes',
    favorites: 'Saved Recipes',
  };

  if (error) {
    console.error('Error loading recipes:', error);
  }

  return (
    <main>
      <ProfileNavigation activeType={recipeType} />

      <RecipesList
        recipes={recipes}
        type={recipeType}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        onRemoveFavorite={
          recipeType === 'favorites' ? handleRemoveFavorite : undefined
        }
        title={titles[recipeType]}
        showFilters={false}
      />
    </main>
  );
}
