'use client';

import css from './NoResults.module.css';
import { useResetAll } from '@/lib/store/useResetAll';

const NoResults = () => {
  const resetAll = useResetAll();
  return (
    <div className={css.noResultsWrapper}>
      <h2 className={css.noResultsHeader}>
        We’re sorry! We were not able to find a match.
      </h2>
      <button className={css.resButton} type="button" onClick={resetAll}>
        Reset search and filters
      </button>
    </div>
  );
};

export default NoResults;
