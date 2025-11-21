'use client';

// import { useParams, notFound } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import ProfileNavigation from '@/components/ProfileNavigation/ProfileNavigation';
import { RecipesList } from '@/components/RecipesList/RecipesList';
import { getOwnRecipes, getFavoriteRecipes } from '@/lib/api/clientApi';

import Container from '@/components/Container/Container';
import css from './ProfilePageClient.module.css';

type RecipeType = 'own' | 'favorites';

export default function ProfilePageClient({
  recipeType,
}: {
  recipeType: RecipeType;
}) {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['recipes', recipeType, page],
    queryFn: async () => {
      return recipeType === 'own'
        ? await getOwnRecipes({ page: String(page) })
        : await getFavoriteRecipes({ page: String(page) });
    },
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container>
      <div className={css.wrapper}>
        <h1 className={css.title}>My profile</h1>
        <ProfileNavigation />
        <RecipesList
          recipes={data?.recipes ?? []}
          isLoadingExternal={isLoading}
          disableFetch={true}
          externalTotalPages={data?.totalPages ?? 1}
          externalCurrentPage={page}
          externalOnChangePage={handlePageChange}
        />
      </div>
    </Container>
  );
}
