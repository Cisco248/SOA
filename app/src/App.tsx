import { NavBar } from "./components/NavBar.tsx";
import { SideBar } from "./components/SideBar.tsx";
import { StatCard } from "./components/StatCard.tsx";
import { ToolBar } from "./components/ToolBar.tsx";
import Pagination from "./components/Pagination.tsx";
import "./assets/styles/main.scss";

// document.querySelectorAll(".nav-item").forEach((item) => {
//   item.addEventListener("click", (e) => {
//     e.preventDefault();
//     document
//       .querySelectorAll(".nav-item")
//       .forEach((n) => n.classList.remove("active"));
//     item.classList.add("active");
//   });
// });

// function priorityBars(p) {
//   const n = levels[p] || 1;
//   const isHigh = p === "HIGH";
//   let html = '<div class="priority-bar">';
//   for (let i = 1; i <= 3; i++) {
//     html += `<div class="priority-segment${i <= n ? " filled" + (isHigh ? " red" : "") : ""}"></div>`;
//   }
//   html += `</div>`;
//   return html;
// }

// function renderOrders(data) {
//   const list = document.getElementById("orderList");
//   if (!data.length) {
//     list.innerHTML = `<div style="padding:40px;text-align:center;font-family:'Share Tech Mono',monospace;font-size:12px;color:var(--text-dim);letter-spacing:2px;">NO ORDERS MATCH FILTER</div>`;
//     return;
//   }
//   list.innerHTML = data
//     .map(
//       (o) => `
//         <div class="order-row${o.urgent ? " urgent" : ""}" onclick="viewOrder('${o.id}')">
//             <div class="td order-id">${o.id}</div>
//             <div class="td customer">${o.customer}<br>
//                 <span style="font-size:11px;color:var(--text-dim);font-weight:400">${o.product}</span>
//             </div>
//             <div class="td" style="font-family:'Share Tech Mono',monospace;font-size:11px">${o.date}</div>
//             <div class="td amount">$${o.amount.toLocaleString()}</div>
//             <div class="td">${priorityBars(o.priority)}</div>
//             <div class="td"><span class="badge ${statusClass[o.status]}"><span class="badge-dot"></span>${o.status}</span></div>
//             <div class="td">
//                 <div class="action-wrap">
//                     <button class="action-btn" title="View" onclick="event.stopPropagation();viewOrder('${o.id}')">◉</button>
//                     <button class="action-btn" title="Edit" onclick="event.stopPropagation();editOrder('${o.id}')">✎</button>
//                     <button class="action-btn danger" title="Cancel" onclick="event.stopPropagation();cancelOrder('${o.id}')">✕</button>
//                 </div>
//             </div>
//         </div>
//     `,
//     )
//     .join("");
// }

// const orderManager = new ExternalModel();
// const openORD = orderManager.Open("#modal-overlay");
// window.openORD = openORD;

// renderOrders(orders);
// filterOrders();

function App() {
  return (
    <>
      <NavBar />
      <div className="workspace">
        <SideBar />
        <main className="main">
          <div className="section-header">
            <div className="section-title-group">
              <span className="section-label"> ACTIVE ORDERS</span>
              <h1 className="section-title">Order Management</h1>
            </div>
            <button className="btn btn-primary" onClick={undefined}>
              + New Order
            </button>
          </div>

          <div className="stats-row">
            <StatCard
              label={"Total Order"}
              value={47}
              sub={"↑ 6 from yesterday"}
              color={"amber"}
            />
            <StatCard
              label={"Total Order"}
              value={47}
              sub={"↑ 6 from yesterday"}
              color={"green"}
            />
            <StatCard
              label={"IN PROCESS"}
              value={18}
              sub={"Avg 2.4 hrs/order"}
              color={"red"}
            />
            <StatCard
              label={"URGENT"}
              value={3}
              sub={"Require immediate action"}
              color={"blue"}
            />
          </div>

          <ToolBar search_placeholder="SEARCH ORDER ID, CUSTOMER, PRODUCT..." />

          <div className="table-wrap">
            <div className="table-head-row">
              <div className="th sorted">ORDER ID ↕</div>
              <div className="th">CUSTOMER / PRODUCT</div>
              <div className="th">DATE</div>
              <div className="th">AMOUNT</div>
              <div className="th">PRIORITY</div>
              <div className="th">STATUS</div>
              <div className="th">ACTIONS</div>
            </div>
            <div id="orderList"></div>
            <Pagination />
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
