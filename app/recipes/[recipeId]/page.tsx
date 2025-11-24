import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { getRecipeById } from '@/lib/api/clientApi';
import RecipeDetailsClient from './RecipeDetails.client';
import { Metadata } from 'next';
import { generateMetadataGlobal } from '@/utils/generateMetadataGlobal';

interface RecipeDetailsProps {
  params: Promise<{ recipeId: string }>;
}
//Description will be the first sentence of the recipe description
const getFirstSentence = (text: string): string => {
  const dotIndex = text.indexOf('.');
  return dotIndex > 0 ? text.slice(0, dotIndex + 1) : text;
};

export const generateMetadata = async ({
  params,
}: RecipeDetailsProps): Promise<Metadata> => {
  const { recipeId } = await params;
  const recipe = await getRecipeById(recipeId);
  return generateMetadataGlobal({
    title: recipe.title,
    description: getFirstSentence(recipe.description),
    path: `recipes/${recipeId}`,
    image: {
      url: recipe.thumb || '/img-default/default-img-tablet.jpg',
      width: 1200,
      height: 630,
      alt: recipe.title,
    },
  });
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
