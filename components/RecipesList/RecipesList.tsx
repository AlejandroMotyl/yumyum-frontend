'use client';

import RecipeCard from '../RecipeCard/RecipeCard';
import { Recipe } from '@/types/recipe';
import { useSearchStore } from '@/lib/store/useSearchStore';
import { useQuery } from '@tanstack/react-query';
import { getAllRecipes } from '@/lib/api/clientApi';
import Loader from '../Loader/Loader';
import { useEffect, useState } from 'react';
import Filters from '../Filters/Filters';
import css from './RecipesList.module.css';
import Container from '../Container/Container';
import { useFiltersStore } from '@/lib/store/useFiltersStore';
import NoResults from '../NoResults/NoResults';

export interface Props {
  recipes: Recipe[];
  hasMore: boolean;
  loadMore: () => void;
}

export function RecipesList() {
  const search = useSearchStore((state) => state.searchQuery) || null;
  const category = useFiltersStore((state) => state.category) || null;
  const ingredient = useFiltersStore((state) => state.ingredient) || null;

  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search, category, ingredient]);

  const { data, isLoading } = useQuery({
    queryKey: ['recipes', page, category, search, ingredient],
    queryFn: () =>
      getAllRecipes({
        page: String(page),
        category,
        search,
        ingredient,
      }),
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading || !data) {
    return <Loader />;
  }

  const isFound = data?.totalRecipes > 0;

  return (
    <Container>
      <h1 className={css.titleRecipes}>Recipes</h1>

      <Filters totalRecipes={data.totalRecipes} />

      {!isFound ? (
        <NoResults />
      ) : (
        <>
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
            <div>
              <LoadMoreBtn onClick={loadMore} disabled={!hasMore} />
            </div>
          )}
        </>
      )}
    </Container>
  );
}
