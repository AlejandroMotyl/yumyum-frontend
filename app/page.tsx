import Hero from '@/components/Hero/Hero';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { getAllRecipes } from '@/lib/api/clientApi';
import { RecipesList } from '@/components/RecipesList/RecipesList';
import Container from '@/components/Container/Container';
import PageTransition from '@/components/PageTransition/PageTransition';

export async function generateMetadata() {
  const title = `YumYum Recipes`;

  const description = `Browse thousands of delicious YumYum recipes — filter by category, ingredient, or keyword.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: 'yumyum-frontend.vercel.app/',
      images: [
        {
          url: '/hero/hero-tablet.jpg',
          width: 1200,
          height: 630,
          alt: 'YumYum Recipes',
        },
      ],
    },
  };
}

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [
      'recipes',
      { page: '1', category: null, search: null, ingredient: null },
    ],
    queryFn: () => getAllRecipes({ page: '1' }),
  });

  return (
    <>
      <PageTransition>
        <Hero />
      </PageTransition>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Container>
          <RecipesList />
        </Container>
      </HydrationBoundary>
    </>
  );
}
