'use client';

import RecipeCard from '../RecipeCard/RecipeCard';
import LoadMoreBtn from '../LoadMoreBtn/LoadMoreBtn';
import { getAllRecipes } from '@/lib/api/clientApi';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useQuery } from '@tanstack/react-query';
import Loader from '../Loader/Loader';
import { SearchParams } from '@/constants';

export default function RecipesList() {
  const { get, set } = useQueryParams();

  const search = get(SearchParams.Search);
  const category = get(SearchParams.Category);
  const ingredient = get(SearchParams.Ingredient);
  const page = get(SearchParams.Page) ?? '1';

  const { data } = useQuery({
    queryKey: ['recipes', page, search, category, ingredient],
    queryFn: () => getAllRecipes({ page, search, category, ingredient }),
  });

  const hasMore = data && data.totalPages > Number(page);

  const handleLoadMore = () => {
    const calculateNextPage = Number(page) + 1;
    set(SearchParams.Page, String(calculateNextPage));
  };

  if (!data) {
    return <Loader />;
  }

  return (
    <div>
      <ul>
        {data.recipes.map((recipe) => (
          <li key={recipe._id}>
            <RecipeCard recipe={recipe} />
          </li>
        ))}
      </ul>

      {hasMore && (
        <div>
          <LoadMoreBtn onClick={handleLoadMore} />
        </div>
      )}
    </div>
  );
}
