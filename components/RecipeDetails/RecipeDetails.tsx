import { Recipe } from '@/types/recipe';
import Container from '../Container/Container';
import css from './RecipeDetails.module.css';

const RecipeDetails = (recipe: Recipe) => {
  return (
    <section>
      <Container>
        <h2 className={css.title}>{recipe.title}</h2>
        <div className={css.imgWrapper}>
          <img src={recipe.thumb} alt={recipe.title} />
        </div>
        <div className={css.generalInfoWrapper}>
          <h3>General information</h3>
          <ul className={css.generalInfoList}>
            <li className={css.generalInfoItem}>
              Category:
              <span className={css.generalInfoSpan}>{recipe.category}</span>
            </li>
            <li className={css.generalInfoItem}>
              Cooking time:
              <span className={css.generalInfoSpan}>{recipe.time} minutes</span>
            </li>
            <li className={css.generalInfoItem}>
              Caloric content:
              <span className={css.generalInfoSpan}>
                Approximately {recipe.cals} kcal per serving
              </span>
            </li>
          </ul>
        </div>
      </Container>
    </section>
  );
};

export default RecipeDetails;
