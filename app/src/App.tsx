import { useState, useMemo } from "react";
import { NavBar } from "./components/NavBar.tsx";
import { SideBar } from "./components/SideBar.tsx";
import { StatCard } from "./components/StatCard.tsx";
import { ToolBar } from "./components/ToolBar.tsx";
import { Pagination } from "./components/Pagination.tsx";
import PopUp from "./components/PopUp.tsx";
import { orders as initialOrders } from "./repository/order";
import { Order, Filters } from "./constants/constant.ts";
import { PriorityBars } from "./components/PriorityBar.tsx";
import "./assets/styles/main.scss";

const statusClass: Record<string, string> = {
  PENDING: "pending",
  PROCESSING: "process",
  SHIPPED: "shipped",
  COMPLETE: "complete",
  CANCELLED: "badge-cancel",
};

function App() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "",
    priority: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearches =
        !filters.search ||
        ["id", "customer", "product"].some((key) =>
          (o[key as keyof Order] as string)
            ?.toLowerCase()
            .includes(filters.search.toLowerCase()),
        );
      const matchesStatus = !filters.status || o.status === filters.status;
      const matchesPriority =
        !filters.priority || o.priority === filters.priority;

      return matchesSearches && matchesStatus && matchesPriority;
    });
  }, [orders, filters]);

  const counts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === "PENDING").length,
      processing: orders.filter((o) => o.status === "PROCESSING").length,
      shipped: orders.filter((o) => o.status === "SHIPPED").length,
      completed: orders.filter((o) => o.status === "COMPLETE").length,
      cancelled: orders.filter((o) => o.status === "CANCELLED").length,
      urgent: orders.filter((o) => o.urgent).length,
    };
  }, [orders]);

  const stats = useMemo(() => {
    return {
      total: counts.all,
      inProcess: counts.processing,
      urgent: counts.urgent,
    };
  }, [counts]);

  const pagedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const handleCancelOrder = (id: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: "CANCELLED", urgent: false } : o,
      ),
    );
  };

  const handleAddOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setIsModalOpen(false);
  };

  return (
    <>
      <NavBar />
      <div className="workspace">
        <SideBar counts={counts} />
        <main className="main">
          <div className="section-header">
            <div className="section-title-group">
              <span className="section-label"> ACTIVE ORDERS</span>
              <h1 className="section-title">OM Dashboard</h1>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setIsModalOpen(true)}
            >
              + New Order
            </button>
          </div>

          <div className="stats-row">
            <StatCard
              label={"Total Order"}
              value={stats.total}
              sub={"↑ 6 from yesterday"}
              color={"amber"}
            />
            <StatCard
              label={"IN PROCESS"}
              value={stats.inProcess}
              sub={"Avg 2.4 hrs/order"}
              color={"green"}
            />
            <StatCard
              label={"URGENT"}
              value={stats.urgent}
              sub={"Require immediate action"}
              color={"blue"}
            />
          </div>

          <ToolBar onFilterChange={setFilters} />

          <div className="table-wrap">
            <div className="table-head-row">
              <div className="th sorted">ORDER ID</div>
              <div className="th">CUSTOMER / PRODUCT</div>
              <div className="th">DATE</div>
              <div className="th">AMOUNT</div>
              <div className="th">PRIORITY</div>
              <div className="th">STATUS</div>
              <div className="th">ACTIONS</div>
            </div>
            {/* <div className="order-list"> */}
            {pagedOrders.map((o) => (
              <div
                key={o.id}
                className={`order-row ${o.urgent ? "urgent" : ""}`}
              >
                <div className="td order-id">{o.id}</div>
                <div className="td customer">
                  {o.customer} <span>{o.product}</span>
                </div>
                <div className="td">{o.date}</div>
                <div className="td amount">${o.amount.toLocaleString()}</div>
                <div className="td">
                  <PriorityBars priority={o.priority} />
                </div>
                <div className="td">
                  <span className={`badge ${statusClass[o.status]}`}>
                    <span className="badge-dot"></span>
                    {o.status}
                  </span>
                </div>
                <div className="td">
                  <div className="action-wrap">
                    <button className="action-btn" title="View">
                      ◉
                    </button>
                    <button className="action-btn" title="Edit">
                      ✎
                    </button>
                    <button
                      className="action-btn danger"
                      title="Cancel"
                      onClick={() => handleCancelOrder(o.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {pagedOrders.length === 0 && (
              <div
                style={{
                  padding: "40px",
                  textAlign: "center",
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "12px",
                  color: "var(--text-dim)",
                  letterSpacing: "2px",
                }}
              >
                NO ORDERS MATCH FILTER
              </div>
            )}
            {/* </div> */}
          </div>
          <Pagination
            totalItems={filteredOrders.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </main>
      </div>
      {isModalOpen && (
        <PopUp
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddOrder}
          nextId={`ORD-${7842 + orders.length}`}
        />
      )}
    </>
  );
}

export default App;
