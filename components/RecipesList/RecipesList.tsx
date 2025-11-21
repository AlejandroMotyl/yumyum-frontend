// 'use client';

// import RecipeCard from '../RecipeCard/RecipeCard';
// import LoadMoreBtn from '../LoadMoreBtn/LoadMoreBtn';
// import { Recipe } from '@/types/recipe';
// import { useSearchStore } from '@/lib/store/useSearchStore';
// import { useQuery } from '@tanstack/react-query';
// import { getAllRecipes } from '@/lib/api/clientApi';
// import Loader from '../Loader/Loader';
// import { useEffect, useState } from 'react';
// import Filters from '../Filters/Filters';
// import css from './RecipesList.module.css';
// import Container from '../Container/Container';
// import { useFiltersStore } from '@/lib/store/useFiltersStore';

// export interface Props {
//   recipes: Recipe[];
//   hasMore: boolean;
//   loadMore: () => void;
// }

// export function RecipesList() {
//   const search = useSearchStore((state) => state.searchQuery) || null;
//   const category = useFiltersStore((state) => state.category) || null;
//   const ingredient = useFiltersStore((state) => state.ingredient) || null;

//   const [recipes, setRecipes] = useState<Recipe[]>([]);
//   const [page, setPage] = useState('1');
//   useEffect(() => {
//     setRecipes([]);
//   }, [search, category, ingredient]);

//   const { data, isLoading } = useQuery({
//     queryKey: [
//       'recipes',
//       {
//         page: page,
//         category: category,
//         search: search,
//         ingredient: ingredient,
//       },
//     ],
//     queryFn: () =>
//       getAllRecipes({
//         page: page,
//         category: category,
//         search: search,
//         ingredient: ingredient,
//       }),
//     placeholderData: (prev) => prev,
//   });

//   useEffect(() => {
//     if (data?.recipes) {
//       setRecipes((prev) => [...prev, ...data.recipes]);
//     }
//   }, [data]);

//   const hasMore = data ? data.totalPages > Number(page) : false;

//   const loadMore = () => {
//     const next = Number(page) + 1;
//     setPage(String(next));
//   };

//   if (isLoading || !data) {
//     return <Loader />;
//   }

//   return (
//     <Container>
//       <h1 className={css.titleRecipes}>Recipes</h1>

//       <Filters totalRecipes={data.totalRecipes} />

//       <ul className={css.listRecipes}>
//         {recipes.map((recipe) => (
//           <li key={recipe._id} className={css.oneRecipe}>
//             <RecipeCard recipe={recipe} />
//           </li>
//         ))}
//       </ul>

//       {isLoading ? (
//         <Loader />
//       ) : (
//         <div>
//           <LoadMoreBtn onClick={loadMore} disabled={!hasMore} />
//         </div>
//       )}
//     </Container>
//   );
// }
// components/RecipesList/RecipesList.tsx

'use client';

import RecipeCard from '../RecipeCard/RecipeCard';
import LoadMoreBtn from '../LoadMoreBtn/LoadMoreBtn';
import { Recipe } from '@/types/recipe';
import Loader from '../Loader/Loader';
import Filters from '../Filters/Filters';
import css from './RecipesList.module.css';
import Container from '../Container/Container';

interface RecipesListProps {
  recipes: Recipe[];
  isLoading?: boolean;
  totalRecipes?: number;
  hasMore?: boolean;
  onLoadMore?: () => void;
  title?: string;
  showFilters?: boolean;
  type?: 'default' | 'own' | 'favorites';
  onRemoveFavorite?: (recipeId: string) => Promise<void>;
}

export function RecipesList({
  recipes,
  isLoading = false,
  totalRecipes = 0,
  hasMore = false,
  onLoadMore,
  title = 'Recipes',
  showFilters = true,
  type = 'default',
  onRemoveFavorite,
}: RecipesListProps) {
  if (isLoading && recipes.length === 0) {
    return <Loader />;
  }

  return (
    <Container>
      <h1 className={css.titleRecipes}>{title}</h1>

      {showFilters && <Filters totalRecipes={totalRecipes} />}

      {recipes.length === 0 && !isLoading ? (
        <p className={css.noRecipes}>Рецептів не знайдено</p>
      ) : (
        <ul className={css.listRecipes}>
          {recipes.map((recipe) => (
            <li key={recipe._id} className={css.oneRecipe}>
              <RecipeCard
                recipe={recipe}
                type={type}
                onRemoveFavorite={onRemoveFavorite}
              />
            </li>
          ))}
        </ul>
      )}

      {isLoading && recipes.length > 0 ? (
        <Loader />
      ) : (
        hasMore &&
        onLoadMore && (
          <div>
            <LoadMoreBtn onClick={onLoadMore} disabled={false} />
          </div>
        )
      )}
    </Container>
  );
}
