'use client';
import css from './SearchBox.module.css';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useSearchStore } from '../../lib/store/useSearchStore';

const SearchBox = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  const globalSearchQuery = useSearchStore((state) => state.searchQuery);
  const setGlobalSearchQuery = useSearchStore((state) => state.setSearchQuery);

  useEffect(() => {
    setSearchQuery(globalSearchQuery);
  }, [globalSearchQuery]);

  const searchSchema = Yup.object().shape({
    search: Yup.string()
      .trim()
      .min(3, 'Must be at least 3 characters')
      .required('Search field is required'),
  });

  const validateSearch = async (query: string) => {
    try {
      await searchSchema.validate({ search: query });
      setError('');
      return true;
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setError(err.message);
      }
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await validateSearch(searchQuery);

    if (isValid) {
      setGlobalSearchQuery(searchQuery.trim());
    }

    (e.target as HTMLFormElement).querySelector('button')?.blur();
  };

  return (
    <form className={css.heroForm} onSubmit={handleSubmit}>
      <div className={css.inputWrapper}>
        <input
          className={`${css.heroInput} ${error ? css.heroInputError : ''}`}
          type="text"
          placeholder="Search recipes"
          value={searchQuery}
          onChange={handleChange}
        />
        {error && <p className={css.errorText}>{error}</p>}
      </div>
      <button className={css.heroBtn} type="submit">
        Search
      </button>
    </form>
  );
};

export default SearchBox;
