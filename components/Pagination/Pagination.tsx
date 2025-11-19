import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

interface PaginationProps {
  onChange: (page: number) => void;
  currentPage: number;
  totalPages: number;
}
const Pagination = ({ onChange, currentPage, totalPages }: PaginationProps) => {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  return (
    <ReactPaginate
      pageCount={totalPages}
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      onPageChange={({ selected }) => onChange(selected + 1)}
      forcePage={currentPage - 1}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
    />
  );
};

export default Pagination;
