import Container from '../Container/Container';
import { Recipe } from '@/types/recipe';
import css from './RecipeDetails.module.css';

const RecipeDetails = ({ recipe }: { recipe: Recipe }) => {
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
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  return (
    <section>
      <Container>
        <h2 className={css.title}>{recipe.title}</h2>
        <div className={css.imgWrapper}>
          <img src={recipe.thumb} alt={recipe.title} />
        </div>
        <div className={css.generalInfoWrapper}>
          <h3>General information</h3>
          <div className={css.generalInfoWrapper}>
            <ul className={css.generalInfoList}>
              <li className={css.generalInfoItem}>
                Category:
                <span className={css.generalInfoSpan}>{recipe.category}</span>
              </li>
              <li className={css.generalInfoItem}>
                Cooking time:
                <span className={css.generalInfoSpan}>
                  {recipe.time} minutes
                </span>
              </li>
              <li className={css.generalInfoItem}>
                Caloric content:
                <span className={css.generalInfoSpan}>
                  Approximately {recipe.cals} kcal per serving
                </span>
              </li>
            </ul>
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
        </div>
        <div className={css.aboutWrapper}>
          <h3 className={css.aboutTitle}>About recipe</h3>
          <p className={css.aboutDescription}>{recipe.description}</p>
        </div>
        <div className={css.ingredientsWrapper}>
          <h3>Ingredients:</h3>
          <ul className={css.ingredientsList}>
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient.id} className={css.ingredientItem}>
                {ingredient.measure}
              </li>
            ))}
          </ul>
        </div>
        <div className={css.preparationWrapper}>
          <h3 className={css.preparationTitle}>Preparation Steps:</h3>
          <p className={css.preparationDescription}>{recipe.instructions}</p>
        </div>
      </Container>
    </section>
  );
};

export default RecipeDetails;
