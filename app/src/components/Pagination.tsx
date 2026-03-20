interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ 
  totalItems, 
  itemsPerPage, 
  currentPage, 
  onPageChange 
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePageClick = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="pagination">
      <span className="page-info">
        {totalItems > 0
          ? `SHOWING ${startItem}–${endItem} OF ${totalItems} RESULTS`
          : "NO RESULTS FOUND"}
      </span>

      <div className="page-btns">
        <button
          className="page-btn"
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ◀
        </button>

        {pageNumbers.map((number) => (
          <button
            key={number}
            className={`page-btn ${currentPage === number ? "active" : ""}`}
            onClick={() => handlePageClick(number)}
          >
            {number}
          </button>
        ))}

        <button
          className="page-btn"
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          ▶
        </button>
      </div>
    </div>
  );
};
