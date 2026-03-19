import "./_sidebar.scss";

interface Props {}

export const SideBar = (props: Props) => {
  return (
    <nav className="sidebar">
      <div className="sidebar-section-label">Operations</div>
      <a className="nav-item active" href="#">
        <span className="nav-icon">◧</span> All Orders
        <span className="nav-badge">47</span>
      </a>
      <a className="nav-item" href="#">
        <span className="nav-icon">⧖</span> Pending
        <span className="nav-badge">14</span>
      </a>
      <a className="nav-item" href="#">
        <span className="nav-icon">⚙</span> In Processing
        <span className="nav-badge">18</span>
      </a>
      <a className="nav-item" href="#">
        <span className="nav-icon">▶</span> Shipped
        <span className="nav-badge green">9</span>
      </a>
      <a className="nav-item" href="#">
        <span className="nav-icon">✔</span> Completed
        <span className="nav-badge green">6</span>
      </a>
      <a className="nav-item" href="#">
        <span className="nav-icon">✕</span> Cancelled
        <span className="nav-badge red">3</span>
      </a>

      <div className="sidebar-section-label">Tools</div>
      <a className="nav-item" href="#">
        <span className="nav-icon">⊞</span> Inventory
      </a>
      <a className="nav-item" href="#">
        <span className="nav-icon">⊕</span> Suppliers
      </a>
      <a className="nav-item" href="#">
        <span className="nav-icon">▤</span> Reports
      </a>
      <a className="nav-item" href="#">
        <span className="nav-icon">◈</span> Settings
      </a>
    </nav>
  );
};
