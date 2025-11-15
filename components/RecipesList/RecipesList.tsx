'use client';

import { useEffect, useState } from 'react';
import RecipeCard from '../RecipeCard/RecipeCard';
import LoadMoreBtn from '../LoadMoreBtn/LoadMoreBtn';
import { Recipe } from '@/types/recipe';
import { getAllRecipes } from '@/lib/api/clientApi';

const ITEMS_PER_PAGE = 12;

export default function RecipesList() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchRecipes = async () => {
    const data = await getAllRecipes(page, ITEMS_PER_PAGE);
    if (data.length < ITEMS_PER_PAGE) setHasMore(false);
    setRecipes((prev) => [...prev, ...data]);
  };

  useEffect(() => {
    fetchRecipes();
  }, [page]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div>
      <ul>
        {recipes.map((recipe) => (
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
