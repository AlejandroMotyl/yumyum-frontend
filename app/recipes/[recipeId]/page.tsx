import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { getRecipeById } from '@/lib/api/clientApi';
import RecipeDetailsClient from './RecipeDetails.client';

interface RecipeDetailsProps {
  params: Promise<{ recipeId: string }>;
}

// export const generateMetadata = async ({
//   params,
// }: RecipeDetailsProps): Promise<Metadata> => {
//   const { id } = await params;
//   const note = await getRecipeById(id);
//   return {
//     title: note.title,
//     description: note.content.slice(0, 15) + '..',
//     openGraph: {
//       title: note.title,
//       description: note.content.slice(0, 15) + '..',
//       url: `https://09-auth-five-theta.vercel.app/notes/${id}`,
//       images: [
//         {
//           url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
//           width: 1200,
//           height: 630,
//           alt: note.title,
//         },
//       ],
//     },
//   };
// };

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
