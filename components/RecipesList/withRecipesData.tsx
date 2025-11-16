'use client';

import { getAllRecipes } from '@/lib/api/clientApi';
import { useQueryParams } from '@/hooks/useQueryParams';
import { SearchParams } from '@/constants';
import { useQuery } from '@tanstack/react-query';
import Loader from '../Loader/Loader';
import { Props, RecipesList } from './RecipesList';

export function withRecipesData<P extends object>(
  WrappedComponent: React.ComponentType<P & Props>,
) {
  return function RecipesDataProvider(props: P) {
    const { get, set } = useQueryParams();

    const search = get(SearchParams.Search);
    const category = get(SearchParams.Category);
    const ingredient = get(SearchParams.Ingredient);
    const page = get(SearchParams.Page) ?? '1';

    const { data, isLoading } = useQuery({
      queryKey: ['recipes', page, search, category, ingredient],
      queryFn: () => getAllRecipes({ page, search, category, ingredient }),
    });

    const hasMore = data ? data.totalPages > Number(page) : false;

    const loadMore = () => {
      const next = Number(page) + 1;
      set(SearchParams.Page, String(next));
    };

    if (isLoading || !data) {
      return <Loader />;
    }

    return (
      <WrappedComponent
        {...props}
        recipes={data.recipes}
        hasMore={hasMore}
        loadMore={loadMore}
      />
    );
  };
}

export const RecipesListWithData = withRecipesData(RecipesList);
