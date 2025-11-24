'use client';
import Loader from '@/components/Loader/Loader';
import PageTransition from '@/components/PageTransition/PageTransition';
import RecipeDetails from '@/components/RecipeDetails/RecipeDetails';
import { getIngredients, getRecipeById } from '@/lib/api/clientApi';
import { useQuery } from '@tanstack/react-query';
import { notFound } from 'next/navigation';

const RecipeDetailsClient = ({ recipeId }: { recipeId: string }) => {
  const { data: recipe, isLoading: isRecipeLoading } = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => getRecipeById(recipeId),
    refetchOnMount: false,
  });

  const { data: ingredients, isLoading: isIngredientsLoading } = useQuery({
    queryKey: ['ingredients'],
    queryFn: () => getIngredients(),
    refetchOnMount: false,
  });

  if (isRecipeLoading || isIngredientsLoading) {
    return <Loader />;
  }

  if (!recipe || !ingredients) {
    return notFound();
  }

  return (
    <PageTransition>
      <RecipeDetails recipe={recipe} ingredients={ingredients} />
    </PageTransition>
  );
};

export default RecipeDetailsClient;
