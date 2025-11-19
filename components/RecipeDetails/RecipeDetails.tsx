import Container from '../Container/Container';
import { Recipe } from '@/types/recipe';
import css from './RecipeDetails.module.css';
import { getIngredientsProps } from '@/types/filter';

interface RecipeDetailsProps {
  recipe: Recipe;
  ingredients: getIngredientsProps[];
}

const RecipeDetails = ({ recipe, ingredients }: RecipeDetailsProps) => {
  const ingredientsMap = new Map(ingredients.map((ing) => [ing._id, ing]));

  const getIngredientName = (id: string): string => {
    const ingredient = ingredientsMap.get(id);
    return ingredient?.name || 'Unknown ingredient';
  };

  //   const handleFavorite = async () => {
  //     setLoading(true);

  //     try {
  //       if (favorite) {
  //         // await removeFavoriteRecipe(recipe._id);
  //         console.log('Removing from favorites:', recipe._id);
  //         setFavorite(false);
  //       } else {
  //         // await addFavoriteRecipe(recipe._id);
  //         console.log('Adding to favorites:', recipe._id);
  //         setFavorite(true);
  //       }
  //     } catch (error) {
  //       console.error('Error toggling favorite:', error);
  //     } finally
  //       setLoading(false);
  //     }
  //   };

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
            <button className={css.favBtn}>Save</button>
            {/* <button
              className={css.generalInfoBtn}
              onClick={handleFavorite}
              type="button"
            >
              {favorite ? (
                <>
                  <span>Unsave</span>
                  <svg className={css.generalInfoBtnIcon}>
                    <use href="#icon-unsave" />
                  </svg>
                </>
              ) : (
                <>
                  <span>Save</span>
                  <svg className={css.generalInfoBtnIcon}>
                    <use href="#icon-save" />
                  </svg>
                </>
              )}
            </button> */}
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
