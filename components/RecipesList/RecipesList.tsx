'use client';

import RecipeCard from '../RecipeCard/RecipeCard';
import { AnyRecipe } from '@/types/recipe';
import { useSearchStore } from '@/lib/store/useSearchStore';
import { useQuery } from '@tanstack/react-query';
import { getAllRecipes } from '@/lib/api/clientApi';
import Loader from '../Loader/Loader';
import { useEffect, useRef, useState } from 'react';
import Filters from '../Filters/Filters';
import css from './RecipesList.module.css';

import { useFiltersStore } from '@/lib/store/useFiltersStore';
import Pagination from '../Pagination/Pagination';
import NoResults from '../NoResults/NoResults';
import PageTransition from '../PageTransition/PageTransition';
import { div } from 'motion/react-client';

interface RecipesListProps {
  recipes?: AnyRecipe[];
  isLoadingExternal?: boolean;
  disableFetch?: boolean;
  externalTotalPages?: number;
  externalCurrentPage?: number;
  externalTotalRecipes?: number;
  externalOnChangePage?: (page: number) => void;
}

export function RecipesList({
  recipes: externalRecipes,
  isLoadingExternal,
  disableFetch = false,
  externalTotalPages,
  externalCurrentPage,
  externalTotalRecipes,
  externalOnChangePage,
}: RecipesListProps) {
  const search = useSearchStore((state) => state.searchQuery) || null;
  const category = useFiltersStore((state) => state.category) || null;
  const ingredient = useFiltersStore((state) => state.ingredient) || null;

  const [page, setPage] = useState(1);
  const listRef = useRef<HTMLHeadingElement | null>(null);

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
      listRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    setPage(newPage);
    listRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Выбираем данные: внешние (own/favorites) или внутренние (search)
  const recipes = externalRecipes ?? data?.recipes ?? [];
  const loading = isLoadingExternal ?? isLoading;
  const totalPages = externalTotalPages ?? data?.totalPages ?? 1;
  const currentPage = externalCurrentPage ?? page;

  const isEmpty = recipes.length < 1;

  return (
    <PageTransition>
      {!externalRecipes && (
        <h2 className={css.titleRecipes} ref={listRef}>
          {search ? `Search Results for "${search}"` : 'Recipes'}
        </h2>
      )}

      <div className={css.filterWrapper}>
        <Filters
          totalRecipes={data?.totalRecipes ?? externalTotalRecipes ?? 0}
        />
      </div>

      {loading && !data ? (
        <Loader />
      ) : isEmpty ? (
        <PageTransition>
          <NoResults />
        </PageTransition>
      ) : (
        <div className={css.listWrapper}>
          <PageTransition>
            <ul className={css.listRecipes}>
              {recipes.map((recipe: AnyRecipe) => (
                <li key={recipe._id} className={css.oneRecipe}>
                  <RecipeCard recipe={recipe} />
                </li>
              ))}
            </ul>
          </PageTransition>

          <Pagination
            onChange={handlePageChange}
            currentPage={currentPage}
            totalPages={totalPages}
            recipes={recipes.length > 0}
          />
        </div>
      )}
    </PageTransition>
  );
}
