import { useEffect, useState } from "react";

enum ToastType {
  info = "blue",
  failed = "red",
  warning = "amber",
  success = "green",
}

interface ToastProps {
  message: string;
  type: keyof typeof ToastType;
}

const Toast = ({ message, type }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  if (!isVisible) return null;

  return (
    <div
      className={`${ToastType[type]} ${isVisible ? "show" : "hide"} toast`}
      role="alert"
    >
      <div>{message}</div>
    </div>
  );
};

export default Toast;
