// components/HomeRecipesSection/HomeRecipesSection.tsx

'use client';

import { RecipesList } from '../RecipesList/RecipesList';
import { useSearchStore } from '@/lib/store/useSearchStore';
import { useFiltersStore } from '@/lib/store/useFiltersStore';
import { useQuery } from '@tanstack/react-query';
import { getAllRecipes } from '@/lib/api/clientApi';
import { useEffect, useState } from 'react';
import { Recipe } from '@/types/recipe';

export function HomeRecipesSection() {
  const search = useSearchStore((state) => state.searchQuery) || null;
  const category = useFiltersStore((state) => state.category) || null;
  const ingredient = useFiltersStore((state) => state.ingredient) || null;

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [page, setPage] = useState('1');

  useEffect(() => {
    setRecipes([]);
    setPage('1');
  }, [search, category, ingredient]);

  const { data, isLoading } = useQuery({
    queryKey: [
      'recipes',
      {
        page: page,
        category: category,
        search: search,
        ingredient: ingredient,
      },
    ],
    queryFn: () =>
      getAllRecipes({
        page: page,
        category: category,
        search: search,
        ingredient: ingredient,
      }),
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    if (data?.recipes) {
      setRecipes((prev) => [...prev, ...data.recipes]);
    }
  }, [data]);

  const hasMore = data ? data.totalPages > Number(page) : false;

  const loadMore = () => {
    const next = Number(page) + 1;
    setPage(String(next));
  };

  return (
    <RecipesList
      recipes={recipes}
      isLoading={isLoading}
      totalRecipes={data?.totalRecipes || 0}
      hasMore={hasMore}
      onLoadMore={loadMore}
      title="Recipes"
      showFilters={true}
      type="default"
    />
  );
}
