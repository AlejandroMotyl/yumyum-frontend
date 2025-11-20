'use client';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import Loader from '@/components/Loader/Loader';
import RecipeDetails from '@/components/RecipeDetails/RecipeDetails';
import { getRecipeById } from '@/lib/api/clientApi';
import { useQuery } from '@tanstack/react-query';

const RecipeDetailsClient = ({ recipeId }: { recipeId: string }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => getRecipeById(recipeId),
    refetchOnMount: false,
  });

  return (
    <>
      {data && <RecipeDetails recipe={data} />}
      {isLoading && <Loader />}
      {!data && error && <ErrorMessage />}
    </>
  );
};

export default RecipeDetailsClient;
