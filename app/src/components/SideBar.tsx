import "./_sidebar.scss";

interface SideBarProps {
  counts: {
    all: number;
    pending: number;
    processing: number;
    shipped: number;
    completed: number;
    cancelled: number;
  };
}

export const SideBar = ({ counts }: SideBarProps) => {
  return (
    <nav className="sidebar">
      <div className="sidebar-section-label">Operations</div>
      <a className="nav-item active" href="#">
        <span className="nav-icon">◧</span> All Orders
        <span className="nav-badge">{counts.all}</span>
      </a>
      <a className="nav-item" href="#">
        <span className="nav-icon">◖</span> Pending
        <span className="nav-badge">{counts.pending}</span>
      </a>
      <a className="nav-item" href="#">
        <span className="nav-icon">⚙</span> In Processing
        <span className="nav-badge">{counts.processing}</span>
      </a>
      <a className="nav-item" href="#">
        <span className="nav-icon">▶</span> Shipped
        <span className="nav-badge green">{counts.shipped}</span>
      </a>
      <a className="nav-item" href="#">
        <span className="nav-icon">✔</span> Completed
        <span className="nav-badge green">{counts.completed}</span>
      </a>
      <a className="nav-item" href="#">
        <span className="nav-icon">✕</span> Cancelled
        <span className="nav-badge red">{counts.cancelled}</span>
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
