'use client';

import RecipeCard from '../RecipeCard/RecipeCard';
import { AnyRecipe, Recipe } from '@/types/recipe';
import { useSearchStore } from '@/lib/store/useSearchStore';
import { useQuery } from '@tanstack/react-query';
import { getAllRecipes } from '@/lib/api/clientApi';
import Loader from '../Loader/Loader';
import { useEffect, useState } from 'react';
import Filters from '../Filters/Filters';
import css from './RecipesList.module.css';

import { useFiltersStore } from '@/lib/store/useFiltersStore';
import Pagination from '../Pagination/Pagination';
import NoResults from '../NoResults/NoResults';

interface RecipesListProps {
  recipes?: AnyRecipe[];
  isLoadingExternal?: boolean;
  disableFetch?: boolean;
  externalTotalPages?: number;
  externalCurrentPage?: number;
  externalOnChangePage?: (page: number) => void;
}

export function RecipesList({
  recipes: externalRecipes,
  isLoadingExternal,
  disableFetch = false,
  externalTotalPages,
  externalCurrentPage,
  externalOnChangePage,
}: RecipesListProps) {
  const search = useSearchStore((state) => state.searchQuery) || null;
  const category = useFiltersStore((state) => state.category) || null;
  const ingredient = useFiltersStore((state) => state.ingredient) || null;

  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!disableFetch) {
      setPage(1);
    }
  }, [search, category, ingredient, disableFetch]);

  const { data, isLoading } = useQuery({
    queryKey: disableFetch
      ? []
      : ['recipes', page, category, search, ingredient],
    queryFn: () =>
      getAllRecipes({
        page: String(page),
        category,
        search,
        ingredient,
      }),
    enabled: !disableFetch,
  });

  const handlePageChange = (newPage: number) => {
    if (disableFetch && externalOnChangePage) {
      externalOnChangePage(newPage);
      return;
    }
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Выбираем данные: внешние (own/favorites) или внутренние (search)
  const recipes = externalRecipes ?? data?.recipes ?? [];
  const loading = isLoadingExternal ?? isLoading;
  const totalPages = externalTotalPages ?? data?.totalPages ?? 1;
  const currentPage = externalCurrentPage ?? page;

  const isEmpty = recipes.length < 1;

  return (
    <>
      {!externalRecipes && (
        <h1 className={css.titleRecipes}>
          {search ? `Search Results for "${search}"` : 'Recipes'}
        </h1>
      )}

      {!externalRecipes && <Filters totalRecipes={data?.totalRecipes ?? 0} />}

      {loading && !data ? (
        <Loader />
      ) : isEmpty ? (
        <NoResults />
      ) : (
        <>
          <ul className={css.listRecipes}>
            {recipes.map((recipe: AnyRecipe) => (
              <li key={recipe._id} className={css.oneRecipe}>
                <RecipeCard recipe={recipe} />
              </li>
            ))}
          </ul>

          <Pagination
            onChange={handlePageChange}
            currentPage={currentPage}
            totalPages={totalPages}
            recipes={recipes.length > 0}
          />
        </>
      )}
    </>
  );
}
