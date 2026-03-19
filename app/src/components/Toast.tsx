import { useEffect } from "react";

interface Props {}

let toastTimer: number;

const Toast = (props: Props) => {
  useEffect(() => {
    const showToast = (msg: string, type: string = "green") => {
      const el: HTMLElement | null = document.getElementById("toast");

      if (el) {
        el.textContent = msg;
        el.style.borderLeftColor =
          type === "red" ? "var(--red)" : "var(--green)";
        el.style.color = type === "red" ? "var(--red)" : "var(--green)";
        el.classList.add("show");
        toastTimer = setTimeout(() => el.classList.remove("show"), 3000);
      }
      clearTimeout(toastTimer);
      return () => showToast;
    };
  }, []);
  return (
    <div className="toast" id="toast">
      <div className="msg"></div>
    </div>
  );
};

export default Toast;
