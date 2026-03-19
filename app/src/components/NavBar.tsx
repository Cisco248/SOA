import { useEffect, useState } from "react";
import "./_navbar.scss";

type Props = {};

// function updateClock() {
// 	const now = new Date();
// 	const elmnt = document.getElementById("clock")
// 	if (elmnt) {
// 		elmnt.textContent = now.toTimeString().slice(0, 8);
// 	}
// }
// setInterval(updateClock, 1000);

export const NavBar = ({}: Props) => {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toTimeString().slice(0, 8));
    };

    updateClock();
    const id = setInterval(updateClock, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="site-title">Shop Order Management</span>
      </div>
      <div className="status-indicators">
        <div className="status-dot">
          <span className="dot green"></span>SYSTEM ONLINE
        </div>
        <div className="status-dot">
          <span className="dot amber"></span>14 PENDING
        </div>
        <div className="status-dot">
          <span className="red"></span>3 URGENT
        </div>
        <div className="clock" id="clock">
          {time}
        </div>
      </div>
    </header>
  );
};
