import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { getRecipeById } from '@/lib/api/clientApi';
import RecipeDetailsClient from './RecipeDetails.client';
import { Metadata } from 'next';

interface RecipeDetailsProps {
  params: Promise<{ recipeId: string }>;
}

export const generateMetadata = async ({
  params,
}: RecipeDetailsProps): Promise<Metadata> => {
  const { recipeId } = await params;
  const recipe = await getRecipeById(recipeId);
  return {
    title: recipe.title,
    description: recipe.description.slice(0, 30) + '..',
    openGraph: {
      title: recipe.title,
      description: recipe.description.slice(0, 30) + '..',
      url: `https://nodejs-hw-zdyd.onrender.com/api/recipes/${recipeId}`,
      images: [
        {
          url: recipe.thumb || '/public/img-default/default-img-tablet.jpg',
          width: 1200,
          height: 630,
          alt: recipe.title,
        },
      ],
    },
  };
};

const RecipeDetailsPage = async ({ params }: RecipeDetailsProps) => {
  const { recipeId } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => getRecipeById(recipeId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RecipeDetailsClient recipeId={recipeId} />
    </HydrationBoundary>
  );
};

export default RecipeDetailsPage;
