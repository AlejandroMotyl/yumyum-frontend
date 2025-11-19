'use client';
import Loader from '@/components/Loader/Loader';
import RecipeDetails from '@/components/RecipeDetails/RecipeDetails';
import { getRecipeById } from '@/lib/api/clientApi';
import { useQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

const RecipeDetailsClient = ({ recipeId }: { recipeId: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => getRecipeById(recipeId),
    refetchOnMount: false,
  });

  return (
    <>
      {data && <RecipeDetails recipe={data} />}
      {isLoading && <Loader />}
      {!data && notFound()}
    </>
  );
};

export default RecipeDetailsClient;
