import React from "react";
import {
  Search,
  X,
  RotateCcw,
  RefreshCw,
  Plus,
  Calendar,
  Filter
} from "lucide-react";
import { cn } from "../../utils/cn.js";

export default function FilterToolbar({
  search,
  setSearch,
  linkStatus,
  setLinkStatus,
  downloadStatus,
  setDownloadStatus,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onResetFilters,
  onRefresh,
  onOpenAddModal,
  isRefreshing,
  hasActiveFilters
}) {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-3.5">
      {/* Top row: Search input + Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search Box */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone number..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50/70 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 transition-all font-medium"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200 transition"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition shadow-2xs"
              title="Reset all active filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/90 transition disabled:opacity-50 shadow-2xs"
            title="Refresh records from database"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isRefreshing && "animate-spin text-brand-600")} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/25 transition-all hover:shadow-brand-600/40 active:scale-[0.98] focus:ring-2 focus:ring-brand-500/40"
          >
            <Plus className="w-4 h-4" />
            <span>Add Record</span>
          </button>
        </div>
      </div>

      {/* Bottom row: Filter Dropdowns & Date selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
        {/* Link Status Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Link Status
          </label>
          <select
            value={linkStatus}
            onChange={(e) => setLinkStatus(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50/70 border border-slate-300 rounded-xl text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="">All Link Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Sent">Sent</option>
          </select>
        </div>

        {/* Download Status Filter */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Download Status
          </label>
          <select
            value={downloadStatus}
            onChange={(e) => setDownloadStatus(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50/70 border border-slate-300 rounded-xl text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="">All Download Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Downloaded">Downloaded</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Start Date */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Start Date (From)
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50/70 border border-slate-300 rounded-xl text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        {/* End Date */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            End Date (To)
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50/70 border border-slate-300 rounded-xl text-xs text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
      </div>
    </div>
  );
}
