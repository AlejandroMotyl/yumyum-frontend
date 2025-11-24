'use client';

// import { useParams, notFound } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useRef } from 'react';
import ProfileNavigation from '@/components/ProfileNavigation/ProfileNavigation';
import { RecipesList } from '@/components/RecipesList/RecipesList';
import { getOwnRecipes, getFavoriteRecipes } from '@/lib/api/clientApi';

import Container from '@/components/Container/Container';
import css from './ProfilePageClient.module.css';

import { useFiltersStore } from '@/lib/store/useFiltersStore';
type RecipeType = 'own' | 'favorites';

export default function ProfilePageClient({
  recipeType,
}: {
  recipeType: RecipeType;
}) {
  const [page, setPage] = useState(1);
  const listRef = useRef<HTMLHeadingElement | null>(null);

  const category = useFiltersStore((state) => state.category) || null;
  const ingredient = useFiltersStore((state) => state.ingredient) || null;

  useEffect(() => {
    setPage(1);
  }, [category, ingredient]);

  const { data, isLoading } = useQuery({
    queryKey: ['recipes', recipeType, page, category, ingredient],
    queryFn: async () => {
      return recipeType === 'own'
        ? await getOwnRecipes({
            page: String(page),
            category,
            ingredient,
          })
        : await getFavoriteRecipes({
            page: String(page),
            category,
            ingredient,
          });
    },
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    listRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Container>
      <div className={css.wrapper}>
        <h1 className={css.title} ref={listRef}>
          My profile
        </h1>
        <ProfileNavigation />
        <RecipesList
          recipes={data?.recipes ?? []}
          isLoadingExternal={isLoading}
          disableFetch={true}
          externalTotalPages={data?.totalPages ?? 1}
          externalTotalRecipes={data?.totalRecipes ?? 0}
          externalCurrentPage={page}
          externalOnChangePage={handlePageChange}
        />
      </div>
    </Container>
  );
}
