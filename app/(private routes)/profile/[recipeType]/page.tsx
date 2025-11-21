import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

import ProfilePageClient from './ProfilePageClient';
import getQueryClient from '@/lib/getQueryClient';
import { getOwnRecipes, getFavoriteRecipes } from '@/lib/api/clientApi';

interface RecipesResponse {
  page: number;
  perPage: number;
  totalRecipes: number;
  totalPages: number;
  recipes: any[];
}

export default async function Page({
  params,
}: {
  params: Promise<{ recipeType: 'own' | 'favorites' }>;
}) {
  const { recipeType } = await params;

  if (recipeType !== 'own' && recipeType !== 'favorites') {
    return notFound();
  }

  const queryClient = getQueryClient();
  const page = 1;

  await queryClient.prefetchQuery<RecipesResponse>({
    queryKey: ['recipes', recipeType, page],
    queryFn: () =>
      recipeType === 'own'
        ? getOwnRecipes({ page: String(page) })
        : getFavoriteRecipes({ page: String(page) }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfilePageClient recipeType={recipeType} />
    </HydrationBoundary>
  );
}
