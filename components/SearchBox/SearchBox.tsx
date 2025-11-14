import css from './SearchBox.module.css';

interface SearchBoxProps {
  onSearch: (query: string) => void;
}

const SearchBox = ({ onSearch }: SearchBoxProps) => {
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
