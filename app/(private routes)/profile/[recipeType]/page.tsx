import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

import ProfilePageClient from './ProfilePageClient';
import getQueryClient from '@/lib/getQueryClient';
import { getOwnRecipes, getFavoriteRecipes } from '@/lib/api/serverApi';
import { Metadata } from 'next';
import { generateMetadataGlobal } from '@/utils/generateMetadataGlobal';

interface RecipesResponse {
  page: number;
  perPage: number;
  totalRecipes: number;
  totalPages: number;
  recipes: any[];
}

export async function generateMetadata(): Promise<Metadata> {
  const title = `YumYum Recipes - My Profile`;
  const description = `Browse your own recipes and manage your favorite recipes on your YumYum profile.`;
  return generateMetadataGlobal({
    title,
    description,
    image: {
      url: '/hero/hero-tablet.jpg',
      width: 1200,
      height: 630,
      alt: title,
    },
  });
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
