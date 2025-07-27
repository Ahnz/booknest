import { useEffect } from "react";
import { Toast } from "konsta/react";

interface CustomToastProps {
  message: string;
  type: "success" | "error";
  opened: boolean;
  onClose: () => void;
}

const ToastNotification: React.FC<CustomToastProps> = ({ message, type, opened, onClose }) => {
  useEffect(() => {
    if (opened) {
      const duration = type === "success" ? 2000 : 3000;
      const timer = setTimeout(() => onClose(), duration);
      return () => clearTimeout(timer);
    }
  }, [opened, onClose, type]);

  return (
    <Toast
      opened={opened}
      position="right"
      className={`mt-16 z-[30000] ${opened ? "animate-fade-in" : "animate-fade-out"} cursor-pointer`}
      colors={{
        bgIos: type === "success" ? "bg-green-500" : "bg-red-500",
        bgMaterial: type === "success" ? "bg-green-500" : "bg-red-500",
        textIos: "text-white",
        textMaterial: "text-white",
      }}
      onClick={onClose}
    >
      <div className="shrink">{message}</div>
    </Toast>
  );
};

export default ToastNotification;
