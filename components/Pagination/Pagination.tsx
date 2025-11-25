import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';
import { useEffect, useRef } from 'react';

interface PaginationProps {
  onChange: (page: number) => void;
  currentPage: number;
  totalPages: number;
  recipes: boolean;
}
const Pagination = ({
  onChange,
  currentPage,
  totalPages,
  recipes,
}: PaginationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ul = containerRef.current?.querySelector('ul');
    if (ul) {
      ul.removeAttribute('role');
    }
  }, [currentPage]);

  if (!totalPages || totalPages <= 1) {
    return <div className={css.paginationPlaceholder} />;
  }
  if (!recipes) {
    return <div className={css.paginationPlaceholder} />;
  }

  return (
    <div ref={containerRef}>
      <ReactPaginate
        pageCount={totalPages}
        pageRangeDisplayed={3}
        marginPagesDisplayed={1}
        onPageChange={({ selected }) => onChange(selected + 1)}
        forcePage={currentPage - 1}
        containerClassName={css.pagination}
        activeClassName={css.active}
        disabledClassName={css.disabled}
        nextLabel={
          <svg width="24" height="24" className={css.nextArrow}>
            <use href="/sprite-new.svg#icon-arrow-right-medium" />
          </svg>
        }
        previousLabel={
          <svg
            width="24"
            height="24"
            className={css.nextArrow}
            style={{ display: 'block' }}
          >
            <use href="/sprite-new.svg#icon-arrow-left-medium" />
          </svg>
        }
      />
    </div>
  );
};

export default Pagination;
