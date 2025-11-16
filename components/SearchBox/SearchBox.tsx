'use client';
import css from './SearchBox.module.css';
import { useState } from 'react';
import * as Yup from 'yup';
import { useSearchStore } from '../../lib/store/useSearchStore';

const SearchBox = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  const setGlobalSearchQuery = useSearchStore((state) => state.setSearchQuery);

  const searchSchema = Yup.object().shape({
    search: Yup.string()
      .trim()
      .min(3, '3 characters minimum')
      .required('The field cannot be empty'),
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
      setSearchQuery('');
    }
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
