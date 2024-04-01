import { useEffect, useState } from "react";

const Pagination = ({ totalPages, currentPage, setCurrentPage }) => {
  const [isRefetching, setRefetching] = useState(false);

  const getPageNumbers = () => {
    const delta = 2;
    const left = currentPage - delta;
    const right = currentPage + delta + 1;
    let range = [];
    let rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i < right)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };
  const handlePageChange = async (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const pageNumbers = getPageNumbers();

  return (
    <div>
      <ul className="flex space-x-5 my-8">
        {pageNumbers.map((number, index) => (
          <li
            key={index}
            className={`page-item${currentPage === number ? " active" : ""}`}
          >
            {typeof number === "number" ? (
              <button
                type="button"
                className={`px-4 py-2 rounded-sm text-lg hover:bg-green-500 hover:text-white transition-colors shadow-md ${
                  currentPage === number
                    ? "bg-green-500 text-white"
                    : "bg-slate-100 text-black"
                }`}
                onClick={() => handlePageChange(number)}
              >
                {number}
              </button>
            ) : (
              <span className="ellipsis">...</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Pagination;
