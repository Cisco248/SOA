import { useState, useEffect } from "react";
import Toast from "./Toast";
import type { Filters } from "../repository/order";
import "./_toolbar.scss";

export const ToolBar = ({ onFilterChange }: { onFilterChange: (filters: Filters) => void }) => {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "",
    priority: "",
  });

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "failed" | "info" | "warning";
  } | null>(null);

  const handleChanges = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;

    const keyMap: Record<string, keyof Filters> = {
      searchInput: "search",
      statusFilter: "status",
      priorityFilter: "priority",
    };

    const key = keyMap[id];
    if (key) {
      setFilters((prev: Filters) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleExport = () => {
    setToast({ message: "Data Export Successfully!", type: "success" });
  };

  return (
    <div className="toolbar">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="search-wrap">
        <span className="search-icon">⌕</span>
        <input
          id="searchInput"
          className="search-input"
          placeholder="SEARCH ORDER ID, CUSTOMER, PRODUCT..."
          value={filters.search}
          onChange={handleChanges}
        />
      </div>

      <select
        className="filter-select"
        id="statusFilter"
        value={filters.status}
        onChange={handleChanges}
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
        value={filters.priority}
        onChange={handleChanges}
      >
        <option value="">ALL PRIORITY</option>
        <option value="HIGH">HIGH</option>
        <option value="MEDIUM">MEDIUM</option>
        <option value="LOW">LOW</option>
      </select>

      <button className="btn btn-ghost" onClick={handleExport}>
        ⬇ Export
      </button>
    </div>
  );
};
