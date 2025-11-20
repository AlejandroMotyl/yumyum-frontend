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
import { useFiltersStore } from '@/lib/store/useFiltersStore';
import Pagination from '../Pagination/Pagination';
import Pagination from '../Pagination/Pagination';

export function RecipesList() {
  const search = useSearchStore((state) => state.searchQuery) || null;
  const category = useFiltersStore((state) => state.category) || null;
  const ingredient = useFiltersStore((state) => state.ingredient) || null;

  const [page, setPage] = useState(1);

  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
    setPage(1);
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
        page: String(page),
        page: String(page),
        category: category,
        search: search,
        ingredient: ingredient,
      }),
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (isLoading || !data) {
    return <Loader />;
  }

  const recipes = data?.recipes || [];

  const recipes = data?.recipes || [];

  return (
    <Container>
      <h1 className={css.titleRecipes}>Recipes</h1>

      <Filters totalRecipes={data.totalRecipes} />

      <ul className={css.listRecipes}>
        {recipes.map((recipe: Recipe) => (
        {recipes.map((recipe: Recipe) => (
          <li key={recipe._id} className={css.oneRecipe}>
            <RecipeCard recipe={recipe} />
          </li>
        ))}
      </ul>

      {isLoading ? (
        <Loader />
      ) : (
<<<<<<< HEAD
        <Pagination
          onChange={handlePageChange}
          currentPage={page}
          totalPages={data.totalPages}
          recipes={recipes.length > 0}
        />
=======
        <div>
          <LoadMoreBtn onClick={loadMore} disabled={!hasMore} />
        </div>
>>>>>>> b351bc05f4c5ad94f7aafddaaa7f0e306efbb5ec
      )}
    </Container>
  );
}
