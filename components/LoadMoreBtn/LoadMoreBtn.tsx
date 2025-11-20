import css from './LoadMoreBtn.module.css';

interface LoadMoreBtnProps {
  onClick: () => void;
  disabled: boolean;
}

export default function LoadMoreBtn({ onClick, disabled }: LoadMoreBtnProps) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick();
    event.currentTarget.blur();
  };

  return (
    <button
      className={css.loadMoreBtn}
      onClick={handleClick}
      disabled={disabled}
    >
      Load More
    </button>
  );
}
