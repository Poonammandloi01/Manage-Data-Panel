import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "../../utils/cn.js";

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === "success";
  const isError = toast.type === "error";

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-slideUp">
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md max-w-sm text-xs sm:text-sm font-medium",
          isSuccess && "bg-white/95 border-emerald-300 text-emerald-900 shadow-emerald-500/10",
          isError && "bg-white/95 border-rose-300 text-rose-900 shadow-rose-500/10",
          !isSuccess && !isError && "bg-white/95 border-slate-200 text-slate-800"
        )}
      >
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
        {isError && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
        {!isSuccess && !isError && <Info className="w-5 h-5 text-brand-600 shrink-0" />}

        <p className="flex-1 leading-snug">{toast.message}</p>

        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
