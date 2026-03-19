import "./_pagination.scss";

type Props = {};

function Pagination({}: Props) {
  return (
    <div className="pagination">
      <span className="page-info" id="pageInfo">
        SHOWING 1–10 OF 47 ORDERS
      </span>
      <div className="page-btns">
        <button className="page-btn">◀</button>
        <button className="page-btn active">1</button>
        <button className="page-btn">2</button>
        <button className="page-btn">3</button>
        <button className="page-btn">▶</button>
      </div>
    </div>
  );
}

export default Pagination;
