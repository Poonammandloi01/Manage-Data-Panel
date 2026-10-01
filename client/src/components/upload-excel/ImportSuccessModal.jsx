import React from "react";
import { CheckCircle2, AlertCircle, ArrowRight, RotateCcw, Database } from "lucide-react";
import { Link } from "react-router-dom";

export default function ImportSuccessModal({
  isOpen,
  onClose,
  result,
  onReset
}) {
  if (!isOpen || !result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200/90 shadow-2xl p-6 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900 font-heading">Import Complete!</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Spreadsheet records have been processed and saved to MongoDB.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Total</span>
            <span className="text-lg font-extrabold text-slate-900 font-heading">{result.totalProcessed || 0}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-700 block">Imported</span>
            <span className="text-lg font-extrabold text-emerald-700 font-heading">{result.importedCount || 0}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-rose-700 block">Failed</span>
            <span className="text-lg font-extrabold text-rose-700 font-heading">{result.failedCount || 0}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Upload Another File</span>
          </button>

          <Link
            to="/manage-data"
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-600/30 transition"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Go to Manage Data</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
