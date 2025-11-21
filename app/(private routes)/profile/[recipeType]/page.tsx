'use client';

import { useParams, notFound } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import ProfileNavigation from '@/components/ProfileNavigation/ProfileNavigation';
import { RecipesList } from '@/components/RecipesList/RecipesList';
import { getOwnRecipes, getFavoriteRecipes } from '@/lib/api/clientApi';
import { Recipe, RecipeFavorite } from '@/types/recipe';
import css from './page.module.css';
import Container from '@/components/Container/Container';

type RecipeType = 'own' | 'favorites';

interface RecipesResponse {
  page: number;
  perPage: number;
  totalRecipes: number;
  totalPages: number;
  recipes: (Recipe | RecipeFavorite)[];
}

export default function ProfilePage() {
  const params = useParams();
  const recipeType = params.recipeType as RecipeType;

  const [page, setPage] = useState(1);

  if (recipeType !== 'own' && recipeType !== 'favorites') {
    notFound();
  }

  const { data, isLoading } = useQuery<RecipesResponse>({
    queryKey: ['recipes', recipeType, page],
    queryFn: async () => {
      //  гарантируем единый тип результата
      const result =
        recipeType === 'own'
          ? await getOwnRecipes({ page: String(page) })
          : await getFavoriteRecipes({ page: String(page) });

      return {
        ...result,
        recipes: result.recipes,
      };
    },
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container>
      <h2 className={css.title}>My profile</h2>
      <ProfileNavigation />

      <RecipesList
        recipes={data?.recipes ?? []} // ← now always AnyRecipe[]
        isLoadingExternal={isLoading}
        disableFetch={true}
        externalTotalPages={data?.totalPages ?? 1}
        externalCurrentPage={page}
        externalOnChangePage={handlePageChange}
      />
    </Container>
  );
}
