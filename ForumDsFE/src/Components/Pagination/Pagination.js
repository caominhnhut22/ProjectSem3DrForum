import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ totalQuestions, pageSize, currentPage, setCurrentPage }) => {
  const totalPages = Math.ceil(totalQuestions / pageSize);

  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Adjust the maximum number of pages to show

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const leftBound = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      const rightBound = Math.min(totalPages, leftBound + maxPagesToShow - 1);

      if (leftBound > 1) {
        pageNumbers.push(1, '...'); // Show ellipsis if there are pages before the first one
      }

      for (let i = leftBound; i <= rightBound; i++) {
        pageNumbers.push(i);
      }

      if (rightBound < totalPages) {
        pageNumbers.push('...', totalPages); // Show ellipsis if there are pages after the last one
      }
    }

    return pageNumbers;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className='pagination-container'>
      {currentPage > 1 && (
        <button className='pagination-button' onClick={() => handlePageChange(currentPage - 1)}>
          <FaChevronLeft />
        </button>
      )}

      {getPageNumbers().map((pageNumber, index) => (
        <button
          key={index}
          className={`pagination-button ${pageNumber === currentPage ? 'active' : ''}`}
          onClick={() => handlePageChange(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}

      {currentPage < totalPages && (
        <button className='pagination-button' onClick={() => handlePageChange(currentPage + 1)}>
          <FaChevronRight />
        </button>
      )}
    </div>
  );
};

export default Pagination;
