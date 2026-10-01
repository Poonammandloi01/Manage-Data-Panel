import React from "react";
import {
  Edit3,
  Trash2,
  Eye,
  AlertCircle,
  Inbox,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { cn } from "../../utils/cn.js";

// Badge helper components - Kiwi Kisan visual styling
const TypeBadge = ({ type }) => {
  const styles = {
    Student: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    Teacher: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
    Mentor: "bg-purple-50 text-purple-700 border-purple-200/80",
    "Job Seeker": "bg-amber-50 text-amber-800 border-amber-200/80",
    Institute: "bg-blue-50 text-blue-700 border-blue-200/80",
    Other: "bg-slate-100 text-slate-700 border-slate-200"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap shadow-2xs",
        styles[type] || styles.Other
      )}
    >
      {type || "Other"}
    </span>
  );
};

const LinkStatusBadge = ({ status }) => {
  const isSent = status === "Sent";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap shadow-2xs",
        isSent
          ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
          : "bg-amber-50 text-amber-800 border-amber-200/80"
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          isSent ? "bg-emerald-500" : "bg-amber-500"
        )}
      />
      {status || "Pending"}
    </span>
  );
};

const DownloadStatusBadge = ({ status }) => {
  const styles = {
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    Downloaded: "bg-sky-50 text-sky-700 border-sky-200/80",
    Pending: "bg-amber-50 text-amber-800 border-amber-200/80"
  };

  const dotColors = {
    Completed: "bg-emerald-500",
    Downloaded: "bg-sky-500",
    Pending: "bg-amber-500"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap shadow-2xs",
        styles[status] || styles.Pending
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          dotColors[status] || dotColors.Pending
        )}
      />
      {status || "Pending"}
    </span>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return "--";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "--";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  } catch {
    return "--";
  }
};

export default function DataTable({
  records = [],
  isLoading,
  error,
  currentPage,
  limit,
  sortBy,
  sortOrder,
  onSort,
  onViewRecord,
  onEditRecord,
  onDeleteRecord,
  onResetFilters,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectRow
}) {
  const isAllSelected =
    records.length > 0 && records.every((r) => selectedIds.includes(r._id));
  const isSomeSelected =
    records.some((r) => selectedIds.includes(r._id)) && !isAllSelected;

  const renderSortIcon = (field) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-60 group-hover:opacity-100 transition" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 text-brand-600 font-bold" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-brand-600 font-bold" />
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white shadow-card overflow-hidden transition-all duration-200">
      {/* Table Responsive Wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          {/* Table Header */}
          <thead>
            <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider select-none">
              <th className="py-3.5 px-4 w-10 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isSomeSelected;
                  }}
                  onChange={onToggleSelectAll}
                  disabled={isLoading || records.length === 0}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500/30 cursor-pointer disabled:cursor-not-allowed h-4 w-4 accent-brand-600"
                />
              </th>
              <th className="py-3.5 px-3 w-14 text-center">S.N.</th>
              <th
                onClick={() => onSort("name")}
                className="py-3.5 px-4 cursor-pointer hover:text-brand-700 transition group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Name</span>
                  {renderSortIcon("name")}
                </div>
              </th>
              <th
                onClick={() => onSort("email")}
                className="py-3.5 px-4 cursor-pointer hover:text-brand-700 transition group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Email</span>
                  {renderSortIcon("email")}
                </div>
              </th>
              <th className="py-3.5 px-4">Phone No.</th>
              <th className="py-3.5 px-4">Address</th>
              <th className="py-3.5 px-4">Organisation</th>
              <th
                onClick={() => onSort("type")}
                className="py-3.5 px-4 cursor-pointer hover:text-brand-700 transition group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Type</span>
                  {renderSortIcon("type")}
                </div>
              </th>
              <th
                onClick={() => onSort("linkStatus")}
                className="py-3.5 px-4 cursor-pointer hover:text-brand-700 transition group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Link Status</span>
                  {renderSortIcon("linkStatus")}
                </div>
              </th>
              <th
                onClick={() => onSort("downloadStatus")}
                className="py-3.5 px-4 cursor-pointer hover:text-brand-700 transition group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Download Status</span>
                  {renderSortIcon("downloadStatus")}
                </div>
              </th>
              <th
                onClick={() => onSort("createdAt")}
                className="py-3.5 px-4 cursor-pointer hover:text-brand-700 transition group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Added On</span>
                  {renderSortIcon("createdAt")}
                </div>
              </th>
              <th className="py-3.5 px-4 text-center w-28">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 text-slate-700 font-normal">
            {/* 1. Loading State */}
            {isLoading &&
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-4 text-center">
                    <div className="w-4 h-4 bg-slate-200 rounded mx-auto" />
                  </td>
                  <td className="py-4 px-3 text-center">
                    <div className="w-6 h-4 bg-slate-200 rounded mx-auto" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-28 h-4 bg-slate-200 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-36 h-4 bg-slate-200 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-24 h-4 bg-slate-200 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-32 h-4 bg-slate-200 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-28 h-4 bg-slate-200 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-16 h-5 bg-slate-200 rounded-full" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-20 h-5 bg-slate-200 rounded-full" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-24 h-5 bg-slate-200 rounded-full" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="w-20 h-4 bg-slate-200 rounded" />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="w-16 h-7 bg-slate-200 rounded mx-auto" />
                  </td>
                </tr>
              ))}

            {/* 2. Error State */}
            {!isLoading && error && (
              <tr>
                <td colSpan={12} className="py-14 px-4 text-center">
                  <div className="max-w-md mx-auto flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 border border-rose-200">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-semibold text-slate-900">Failed to load records</h4>
                    <p className="text-xs text-slate-500 mt-1 mb-4">{error}</p>
                    <button
                      type="button"
                      onClick={onResetFilters}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold border border-slate-300 transition"
                    >
                      Reset & Reload
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {/* 3. Empty State */}
            {!isLoading && !error && records.length === 0 && (
              <tr>
                <td colSpan={12} className="py-16 px-4 text-center">
                  <div className="max-w-md mx-auto flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-brand-600 flex items-center justify-center mb-3 border border-emerald-100">
                      <Inbox className="w-7 h-7" />
                    </div>
                    <h4 className="text-base font-semibold text-slate-900">No records found</h4>
                    <p className="text-xs text-slate-500 mt-1 mb-4">
                      No data matches your current search or category filter. Try clearing your filters or adding a new record.
                    </p>
                    <button
                      type="button"
                      onClick={onResetFilters}
                      className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-600/20 transition"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {/* 4. Successful Data Rows */}
            {!isLoading &&
              !error &&
              records.map((record, index) => {
                const serialNumber = (currentPage - 1) * limit + index + 1;
                const isSelected = selectedIds.includes(record._id);

                return (
                  <tr
                    key={record._id}
                    className={cn(
                      "group hover:bg-emerald-50/40 transition-colors",
                      isSelected && "bg-emerald-50/70"
                    )}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelectRow(record._id)}
                        className="rounded border-slate-300 text-brand-600 focus:ring-brand-500/30 cursor-pointer h-4 w-4 accent-brand-600"
                      />
                    </td>

                    {/* S.N. */}
                    <td className="py-3.5 px-3 text-center text-xs font-medium text-slate-500">
                      {serialNumber}
                    </td>

                    {/* Name */}
                    <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {record.name}
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-xs whitespace-nowrap">
                      <span title={record.email} className="truncate max-w-[180px] inline-block">
                        {record.email}
                      </span>
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-mono text-xs">
                      {record.phone || "--"}
                    </td>

                    {/* Address */}
                    <td className="py-3.5 px-4 text-xs text-slate-500 max-w-[180px] truncate" title={record.address || "No address provided"}>
                      {record.address || "--"}
                    </td>

                    {/* Organisation */}
                    <td className="py-3.5 px-4 text-xs text-slate-700 max-w-[160px] truncate font-medium" title={record.organisation || "No organisation"}>
                      {record.organisation || "--"}
                    </td>

                    {/* Type Badge */}
                    <td className="py-3.5 px-4">
                      <TypeBadge type={record.type} />
                    </td>

                    {/* Link Status */}
                    <td className="py-3.5 px-4">
                      <LinkStatusBadge status={record.linkStatus} />
                    </td>

                    {/* Download Status */}
                    <td className="py-3.5 px-4">
                      <DownloadStatusBadge status={record.downloadStatus} />
                    </td>

                    {/* Date Added */}
                    <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                      {formatDate(record.dateAdded || record.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => onViewRecord(record)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditRecord(record)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-700 hover:bg-emerald-50 transition"
                          title="Edit Record"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteRecord(record)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
