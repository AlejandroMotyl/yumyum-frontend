'use client';

import RecipeCard from '../RecipeCard/RecipeCard';
import LoadMoreBtn from '../LoadMoreBtn/LoadMoreBtn';
import { Recipe } from '@/types/recipe';
import { useSearchStore } from '@/lib/store/useSearchStore';
import { useQuery } from '@tanstack/react-query';
import { getAllRecipes } from '@/lib/api/clientApi';
import Loader from '../Loader/Loader';
import { useEffect, useState } from 'react';
import Filters from '../Filters/Filters';
import css from './RecipesList.module.css';
import Container from '../Container/Container';

export interface Props {
  recipes: Recipe[];
  hasMore: boolean;
  loadMore: () => void;
}

export function RecipesList() {
  const search = useSearchStore((state) => state.searchQuery) || null;
  // const category = useSearchStore((state) => state.searchQuery) || null;
  // const ingredient = useSearchStore((state) => state.searchQuery) || null;

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [page, setPage] = useState('1');
  // useEffect(() => {
  //   setRecipes([]);
  // }, [search, category, ingredient]);

  const { data, isLoading } = useQuery({
    queryKey: [
      'recipes',
      {
        page: page,
        // category: category,
        search: search,
        // ingredient: ingredient,
      },
    ],
    queryFn: () =>
      getAllRecipes({
        page: page,
        // category: category,
        search: search,
        // ingredient: ingredient,
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

  if (isLoading || !data) {
    return <Loader />;
  }

  return (
    <Container>
      <h1 className={css.titleRecipes}>Recipes</h1>

      <Filters />

      <ul className={css.listRecipes}>
        {recipes.map((recipe) => (
          <li key={recipe._id} className={css.oneRecipe}>
            <RecipeCard recipe={recipe} />
          </li>
        ))}
      </ul>

      {isLoading ? (
        <Loader />
      ) : (
        hasMore && (
          <div>
            <LoadMoreBtn onClick={loadMore} />
          </div>
        )
      )}
    </Container>
  );
}
