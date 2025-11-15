import css from './SearchBox.module.css';

const SearchBox = () => {
  return (
    <form className={css.heroForm}>
      <input
        className={css.heroInput}
        type="text"
        placeholder="Search recipes"
      />
      <button className={css.heroBtn} type="submit">
        Search
      </button>
    </form>
  );
};

export default SearchBox;
