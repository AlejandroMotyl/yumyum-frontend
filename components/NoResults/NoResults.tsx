import css from './NoResults.module.css';
import Container from '../Container/Container';

const NoResults = () => {
  return (
    <div className={css.noResultsWrapper}>
      <h2 className={css.noResultsHeader}>
        We’re sorry! We were not able to find a match.
      </h2>
      <button className={css.resButton} type="button">
        Reset search and filters
      </button>
    </div>
  );
};

export default NoResults;
