'use client';
import Container from '../Container/Container';
import { Recipe } from '@/types/recipe';
import css from './RecipeDetails.module.css';
import { getIngredientsProps } from '@/types/filter';
import { useAuthStore } from '@/lib/store/authStore';
import { useEffect, useState } from 'react';
import 'izitoast/dist/css/iziToast.min.css';
import {
  addFavoriteRecipe,
  removeFavoriteRecipe,
} from '@/lib/services/favorites';

interface RecipeDetailsProps {
  recipe: Recipe;
  ingredients: getIngredientsProps[];
}

const RecipeDetails = ({ recipe, ingredients }: RecipeDetailsProps) => {
  const [favorite, setFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const savedRecipes = useAuthStore((state) => state.user?.savedRecipes);

  const ingredientsMap = new Map(ingredients.map((ing) => [ing._id, ing]));

  useEffect(() => {
    const isSaved = savedRecipes?.includes(recipe._id) || false;
    if (!isSaved) {
      setFavorite(false);
    } else setFavorite(isSaved);
  }, [savedRecipes, recipe._id]);

  const getIngredientName = (id: string): string => {
    const ingredient = ingredientsMap.get(id);
    return ingredient?.name || 'Unknown ingredient';
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      return;
    }
    setIsLoading(true);

    try {
      if (!favorite) {
        addFavoriteRecipe(recipe._id);

        setFavorite(false);

        import('izitoast').then((iziToast) => {
          iziToast.default.success({
            title: 'Success',
            message: 'Successfully saved to favorites',
            position: 'topRight',
          });
        });
      } else {
        removeFavoriteRecipe(recipe._id);
        setFavorite(true);

        import('izitoast').then((iziToast) => {
          iziToast.default.success({
            title: 'Success',
            message: 'Removed from favorites',
            position: 'topRight',
          });
        });
      }
    } catch {
      import('izitoast').then((iziToast) => {
        iziToast.default.error({
          message: `Error toggling favorite!`,
          position: 'topRight',
        });
      });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <section>
      <Container>
        <div className={css.titleWrapper}>
          <div className={css.imgWrapper}>
            <picture>
              <source
                media="(min-width: 768px)"
                srcSet={recipe.thumb?.replace('preview', 'preview/large')}
              />
              <img
                className={css.titleImg}
                src={recipe.thumb}
                alt={recipe.title}
              />
            </picture>
          </div>
          <h2 className={css.title}>{recipe.title}</h2>
        </div>
        <div className={css.infoWrapper}>
          <div className={css.generalInfoContainer}>
            <div className={css.generalInfoWrapper}>
              <h3 className={css.generalInfoTitle}>General information</h3>
              <ul className={css.generalInfoList}>
                <li className={css.generalInfoItem}>
                  Category:&nbsp;
                  <span className={css.generalInfoSpan}>{recipe.category}</span>
                </li>
                <li className={css.generalInfoItem}>
                  Cooking time:&nbsp;
                  <span className={css.generalInfoSpan}>
                    {recipe.time} minutes
                  </span>
                </li>
                <li className={css.generalInfoItem}>
                  Caloric content:&nbsp;
                  <span className={css.generalInfoSpan}>
                    Approximately {recipe.cals} kcal per serving
                  </span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              className={css.favBtn}
              onClick={handleFavorite}
              disabled={isLoading}
            >
              {favorite ? (
                <>
                  <span className={css.favBtnTitle}>Unsave</span>
                  <svg className={css.favBtnIconUnsave} width="24" height="24">
                    <use href="/sprite-new.svg#icon-bookmark-filled-large" />
                  </svg>
                </>
              ) : (
                <>
                  <span className={css.favBtnTitle}>Save</span>
                  <svg className={css.favBtnIconSave} width="24" height="24">
                    <use href="/sprite-new.svg#icon-bookmark-filled-large" />
                  </svg>
                </>
              )}
            </button>
          </div>
          <div className={css.otherInfoWrapper}>
            <div className={css.aboutWrapper}>
              <h3 className={css.aboutTitle}>About recipe</h3>
              <p className={css.aboutDescription}>{recipe.description}</p>
            </div>
            <div className={css.ingredientsWrapper}>
              <h3 className={css.ingredientsTitle}>Ingredients:</h3>
              <ul className={css.ingredientsList}>
                {recipe.ingredients.map((ingredient) => (
                  <li key={ingredient.id} className={css.ingredientItem}>
                    • {getIngredientName(ingredient.id)} — {ingredient.measure}
                  </li>
                ))}
              </ul>
            </div>
            <div className={css.preparationWrapper}>
              <h3 className={css.preparationTitle}>Preparation Steps:</h3>
              <div className={css.preparationDescriptionWrapper}>
                {recipe.instructions.split('\r\n').map((step, index) => (
                  <p key={index} className={css.preparationDescription}>
                    {step}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default RecipeDetails;
