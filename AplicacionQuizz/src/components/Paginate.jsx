import React from 'react';

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages === 1) return null;

  let pages = [];
  if (currentPage <= 3) {
    pages = [1, 2, 3, 4].slice(0, totalPages);
  } else if (currentPage >= totalPages - 1) {
    pages = [totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  } else {
    pages = [currentPage - 1, currentPage, currentPage + 1, currentPage + 2].filter(
      (page) => page > 0 && page <= totalPages
    );
  }

  const handlePageChange = (page) => onPageChange(page);
  const handlePrev = () => currentPage > 1 && onPageChange(currentPage - 1);
  const handleNext = () => currentPage < totalPages && onPageChange(currentPage + 1);

  return (
    <nav>
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={handlePrev}>
            &laquo; Anterior
          </button>
        </li>
        {pages.map((page, index) => (
          <li key={index} className={`page-item ${currentPage === page ? 'active' : ''}`}>
            <button onClick={() => handlePageChange(page)} className="page-link">
              {page}
            </button>
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={handleNext}>
            Siguiente &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
