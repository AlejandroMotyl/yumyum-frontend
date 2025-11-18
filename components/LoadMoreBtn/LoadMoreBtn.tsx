import css from './LoadMoreBtn.module.css';

interface LoadMoreBtnProps {
  onClick: () => void;
}

export default function LoadMoreBtn({ onClick }: LoadMoreBtnProps) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick();
    event.currentTarget.blur();
  };

  return (
    <button className={css.loadMoreBtn} onClick={handleClick}>
      Load More
    </button>
  );
}
