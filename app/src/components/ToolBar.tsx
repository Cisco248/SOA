import "./_toolbar.scss";

interface Props {
  search_placeholder: string;
}

export const ToolBar = ({ search_placeholder }: Props) => {
  //   function filterOrders() {
  //     const q = document.getElementById("searchInput").value.toLowerCase();
  //     const status = document.getElementById("statusFilter").value;
  //     const prio = document.getElementById("priorityFilter").value;
  //     const result = orders.filter(
  //       (o) =>
  //         (!q ||
  //           o.id.toLowerCase().includes(q) ||
  //           o.customer.toLowerCase().includes(q) ||
  //           o.product.toLowerCase().includes(q)) &&
  //         (!status || o.status === status) &&
  //         (!prio || o.priority === prio),
  //     );
  //     document.getElementById("pageInfo").textContent =
  //       `SHOWING 1–${Math.min(result.length, 10)} OF ${result.length} ORDERS`;
  //     return renderOrders(result);
  //   }

  //   function exportOrders() {
  //     showToast("⬇ EXPORTING CSV...");
  //   }

  return (
    <div className="toolbar">
      <div className="search-wrap">
        <span className="search-icon">⌕</span>
        <input
          id="searchInput"
          className="search-input"
          placeholder={search_placeholder}
          //   onInput={filterOrders()}
        />
      </div>
      <select
        className="filter-select"
        id="statusFilter"
        //   onChange={filterOrders()}
      >
        <option value="">ALL STATUS</option>
        <option value="PENDING">PENDING</option>
        <option value="PROCESSING">PROCESSING</option>
        <option value="SHIPPED">SHIPPED</option>
        <option value="COMPLETE">COMPLETE</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>
      <select
        className="filter-select"
        id="priorityFilter"
        //   onChange={filterOrders()}
      >
        <option value="">ALL PRIORITY</option>
        <option value="HIGH">HIGH</option>
        <option value="MEDIUM">MEDIUM</option>
        <option value="LOW">LOW</option>
      </select>
      <button
        className="btn btn-ghost"
        // onClick={exportOrders()}
      >
        ⬇ Export
      </button>
    </div>
  );
};
