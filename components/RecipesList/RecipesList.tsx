'use client';

import RecipeCard from '../RecipeCard/RecipeCard';
import LoadMoreBtn from '../LoadMoreBtn/LoadMoreBtn';
import { Recipe } from '@/types/recipe';

export interface Props {
  recipes: Recipe[];
  hasMore: boolean;
  loadMore: () => void;
}

export function RecipesList({ recipes, hasMore, loadMore }: Props) {
  return (
    <div>
      <ul>
        {recipes.map((recipe: any) => (
          <li key={recipe._id}>
            <RecipeCard recipe={recipe} />
          </li>
        ))}
      </ul>

      {hasMore && (
        <div>
          <LoadMoreBtn onClick={loadMore} />
        </div>
      )}
    </div>
  );
}
