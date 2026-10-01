import React, { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  XCircle,
  FileSpreadsheet,
  Loader2,
  Filter
} from "lucide-react";
import { cn } from "../../utils/cn.js";

export default function ImportPreviewTable({
  previewRows = [],
  validCount = 0,
  invalidCount = 0,
  onCancel,
  onImport,
  isImporting = false
}) {
  const [filterMode, setFilterMode] = useState("all"); // "all" | "valid" | "invalid"

  const filteredRows = previewRows.filter((row) => {
    if (filterMode === "valid") return row.isValid;
    if (filterMode === "invalid") return !row.isValid;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Status Banner & Actions */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Statistics Pill */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200">
            <FileSpreadsheet className="w-4 h-4 text-brand-600" />
            <span>Total Rows: {previewRows.length}</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Valid: {validCount}</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            <span>Invalid: {invalidCount}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isImporting}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onImport}
            disabled={validCount === 0 || isImporting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-600/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isImporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Importing to MongoDB...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                <span>Import {validCount} Valid Records</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter Tabs for preview */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setFilterMode("all")}
            className={cn(
              "px-3 py-1.5 rounded-lg font-semibold transition",
              filterMode === "all"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            All Rows ({previewRows.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("valid")}
            className={cn(
              "px-3 py-1.5 rounded-lg font-semibold transition",
              filterMode === "valid"
                ? "bg-emerald-600 text-white shadow-2xs"
                : "text-slate-600 hover:text-emerald-700"
            )}
          >
            Valid ({validCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("invalid")}
            className={cn(
              "px-3 py-1.5 rounded-lg font-semibold transition",
              filterMode === "invalid"
                ? "bg-rose-600 text-white shadow-2xs"
                : "text-slate-600 hover:text-rose-700"
            )}
          >
            Invalid ({invalidCount})
          </button>
        </div>

        <p className="text-[11px] text-slate-500 font-medium">
          Showing {filteredRows.length} rows in preview
        </p>
      </div>

      {/* Preview Table */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-card overflow-hidden">
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-3 w-12 text-center">Row</th>
                <th className="py-3 px-3 w-28 text-center">Status</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Organisation</th>
                <th className="py-3 px-4">Link Status</th>
                <th className="py-3 px-4">Download Status</th>
                <th className="py-3 px-4">Validation Errors</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRows.map((row) => (
                <tr
                  key={row.rowNumber}
                  className={cn(
                    "transition-colors",
                    row.isValid
                      ? "hover:bg-emerald-50/40"
                      : "bg-rose-50/40 hover:bg-rose-50/70"
                  )}
                >
                  {/* Row # */}
                  <td className="py-3 px-3 text-center font-mono text-slate-500">
                    {row.rowNumber}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-3 text-center">
                    {row.isValid ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Valid</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <XCircle className="w-3 h-3 text-rose-500" />
                        <span>Invalid</span>
                      </span>
                    )}
                  </td>

                  {/* Name */}
                  <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                    {row.data.name || <span className="text-rose-500 italic">Missing</span>}
                  </td>

                  {/* Email */}
                  <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                    {row.data.email || <span className="text-rose-500 italic">Missing</span>}
                  </td>

                  {/* Phone */}
                  <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                    {row.data.phone || <span className="text-rose-500 italic">Missing</span>}
                  </td>

                  {/* Type */}
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 border border-slate-200 text-slate-700">
                      {row.data.type || "Student"}
                    </span>
                  </td>

                  {/* Organisation */}
                  <td className="py-3 px-4 truncate max-w-[150px] font-medium" title={row.data.organisation}>
                    {row.data.organisation || "--"}
                  </td>

                  {/* Link Status */}
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {row.data.linkStatus || "Pending"}
                    </span>
                  </td>

                  {/* Download Status */}
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {row.data.downloadStatus || "Pending"}
                    </span>
                  </td>

                  {/* Validation Errors */}
                  <td className="py-3 px-4">
                    {row.errors.length > 0 ? (
                      <div className="space-y-0.5">
                        {row.errors.map((err, i) => (
                          <div
                            key={i}
                            className="text-[11px] text-rose-600 flex items-center gap-1 font-medium"
                          >
                            <span className="w-1 h-1 rounded-full bg-rose-500 shrink-0" />
                            <span>{err}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[11px] text-emerald-600 font-medium">Ready</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
