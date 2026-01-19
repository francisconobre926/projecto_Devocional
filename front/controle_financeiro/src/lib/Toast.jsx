import { useEffect } from "react";
import { Check, X } from "lucide-react";

export default function Toast({ toast, setToast }) {
  // Auto-hide do toast após 3 segundos
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000); // 3 segundos
      return () => clearTimeout(timer);
    }
  }, [toast, setToast]);

  if (!toast) return null;

  return (
    <div
      className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ${
        toast.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
      }`}
    >
      <div className="flex items-center gap-2">
        {toast.type === "success" ? <Check size={20} /> : <X size={20} />}
        <span className="font-medium">{toast.message}</span>
      </div>
    </div>
  );
}
