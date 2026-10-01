import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Database,
  Sparkles,
  Download,
  Trash2,
  CheckSquare,
  AlertCircle
} from "lucide-react";
import { recordService } from "../services/recordService.js";
import {
  SummaryCards,
  CategoryTabs,
  FilterToolbar,
  DataTable,
  Pagination,
  RecordModal,
  ViewRecordModal,
  DeleteConfirmModal
} from "../components/manage-data/index.js";
import Toast from "../components/common/Toast.jsx";

export default function ManageDataPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Summary Data State
  const [summary, setSummary] = useState({
    allData: 0,
    students: 0,
    teachers: 0,
    institutes: 0
  });
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);

  // Records Table State
  const [records, setRecords] = useState([]);
  const [isRecordsLoading, setIsRecordsLoading] = useState(true);
  const [recordsError, setRecordsError] = useState(null);

  // Filter & Query States initialized from URL params if present
  const [activeCategory, setActiveCategory] = useState(searchParams.get("type") || "");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get("search") || "");
  const [linkStatus, setLinkStatus] = useState(searchParams.get("linkStatus") || "");
  const [downloadStatus, setDownloadStatus] = useState(searchParams.get("downloadStatus") || "");
  const [startDate, setStartDate] = useState(searchParams.get("startDate") || "");
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "createdAt");
  const [sortOrder, setSortOrder] = useState(searchParams.get("sortOrder") || "desc");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page"), 10) || 1);
  const [limit, setLimit] = useState(parseInt(searchParams.get("limit"), 10) || 10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Selection State
  const [selectedIds, setSelectedIds] = useState([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Modal States
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [deletingRecord, setDeletingRecord] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalError, setModalError] = useState(null);

  // Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Sync URL search params
  useEffect(() => {
    const params = {};
    if (currentPage > 1) params.page = currentPage;
    if (limit !== 10) params.limit = limit;
    if (debouncedSearch) params.search = debouncedSearch;
    if (activeCategory) params.type = activeCategory;
    if (linkStatus) params.linkStatus = linkStatus;
    if (downloadStatus) params.downloadStatus = downloadStatus;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (sortBy !== "createdAt") params.sortBy = sortBy;
    if (sortOrder !== "desc") params.sortOrder = sortOrder;

    setSearchParams(params, { replace: true });
  }, [
    currentPage,
    limit,
    debouncedSearch,
    activeCategory,
    linkStatus,
    downloadStatus,
    startDate,
    endDate,
    sortBy,
    sortOrder,
    setSearchParams
  ]);

  // Global keyboard listener for Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsRecordModalOpen(false);
        setEditingRecord(null);
        setViewingRecord(null);
        setDeletingRecord(null);
        setIsBulkDeleteModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Debounce search input by 350ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch Summary Statistics from MongoDB
  const fetchSummary = useCallback(async () => {
    try {
      setIsSummaryLoading(true);
      const res = await recordService.getSummary();
      if (res.success && res.data) {
        setSummary(res.data);
      }
    } catch (err) {
      console.error("Failed to load summary stats:", err);
    } finally {
      setIsSummaryLoading(false);
    }
  }, []);

  // Fetch Paginated & Filtered Records from Backend
  const fetchRecords = useCallback(async () => {
    try {
      setIsRecordsLoading(true);
      setRecordsError(null);

      const params = {
        page: currentPage,
        limit,
        search: debouncedSearch,
        type: activeCategory,
        linkStatus,
        downloadStatus,
        startDate,
        endDate,
        sortBy,
        sortOrder
      };

      const res = await recordService.getRecords(params);
      if (res.success) {
        setRecords(res.data || []);
        if (res.pagination) {
          setTotalPages(res.pagination.totalPages || 1);
          setTotalRecords(res.pagination.totalRecords || 0);
        }
      }
    } catch (err) {
      setRecordsError(err.message || "Could not fetch records from server");
      setRecords([]);
    } finally {
      setIsRecordsLoading(false);
    }
  }, [
    currentPage,
    limit,
    debouncedSearch,
    activeCategory,
    linkStatus,
    downloadStatus,
    startDate,
    endDate,
    sortBy,
    sortOrder
  ]);

  // Initial load
  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Handle Category Tab Switch
  const handleSelectCategory = (categoryValue) => {
    setActiveCategory(categoryValue);
    setCurrentPage(1);
    setSelectedIds([]);
  };

  // Handle Column Sorting
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  // Reset All Filters
  const handleResetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setActiveCategory("");
    setLinkStatus("");
    setDownloadStatus("");
    setStartDate("");
    setEndDate("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setCurrentPage(1);
    setSelectedIds([]);
    showToast("Filters reset to default", "info");
  };

  const hasActiveFilters = Boolean(
    search ||
      activeCategory ||
      linkStatus ||
      downloadStatus ||
      startDate ||
      endDate
  );

  // Checkbox Selection
  const handleToggleSelectAll = () => {
    if (records.every((r) => selectedIds.includes(r._id))) {
      setSelectedIds([]);
    } else {
      setSelectedIds(records.map((r) => r._id));
    }
  };

  const handleToggleSelectRow = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Create or Update Record Handler
  const handleSaveRecord = async (formData) => {
    try {
      setIsSubmitting(true);
      setModalError(null);
      if (editingRecord?._id) {
        await recordService.updateRecord(editingRecord._id, formData);
        showToast("Record updated successfully!");
      } else {
        await recordService.createRecord(formData);
        showToast("Record created successfully!");
      }
      setIsRecordModalOpen(false);
      setEditingRecord(null);
      setModalError(null);
      // Refresh list & summary counts
      fetchRecords();
      fetchSummary();
    } catch (err) {
      const errMsg = err.message || (err.errors ? err.errors.join(", ") : "Failed to save record");
      setModalError(errMsg);
      showToast(errMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Record Handler
  const handleConfirmDelete = async () => {
    if (!deletingRecord?._id) return;
    try {
      setIsDeleting(true);
      await recordService.deleteRecord(deletingRecord._id);
      showToast(`Record "${deletingRecord.name}" deleted successfully!`);
      setDeletingRecord(null);
      setSelectedIds((prev) => prev.filter((id) => id !== deletingRecord._id));
      // Refresh list & summary counts
      fetchRecords();
      fetchSummary();
    } catch (err) {
      showToast(err.message || "Failed to delete record", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Bulk Delete Handler
  const handleConfirmBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      setIsBulkDeleting(true);
      const res = await recordService.bulkDelete(selectedIds);
      showToast(`Successfully deleted ${res.data?.deletedCount || selectedIds.length} records!`);
      setSelectedIds([]);
      setIsBulkDeleteModalOpen(false);
      // Refresh list & summary counts
      fetchRecords();
      fetchSummary();
    } catch (err) {
      showToast(err.message || "Failed to delete selected records", "error");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
              <Database className="w-3.5 h-3.5" />
              Live MongoDB Data
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Manage Data Panel
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor records, filter candidates, update link and download statuses in real-time.
          </p>
        </div>

        {/* Header Badges & Bulk Action Bar */}
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-semibold animate-fadeIn shadow-2xs">
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              <span>{selectedIds.length} Selected</span>
              <button
                type="button"
                onClick={() => setIsBulkDeleteModalOpen(true)}
                className="ml-2 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition text-xs shadow-2xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Four Summary Cards (All Data, Students, Teachers, Institutes) */}
      <SummaryCards summary={summary} isLoading={isSummaryLoading} />

      {/* 3. Category Tabs */}
      <CategoryTabs
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        disabled={isRecordsLoading}
      />

      {/* 4. Filter and Search Toolbar */}
      <FilterToolbar
        search={search}
        setSearch={setSearch}
        linkStatus={linkStatus}
        setLinkStatus={(val) => {
          setLinkStatus(val);
          setCurrentPage(1);
        }}
        downloadStatus={downloadStatus}
        setDownloadStatus={(val) => {
          setDownloadStatus(val);
          setCurrentPage(1);
        }}
        startDate={startDate}
        setStartDate={(val) => {
          setStartDate(val);
          setCurrentPage(1);
        }}
        endDate={endDate}
        setEndDate={(val) => {
          setEndDate(val);
          setCurrentPage(1);
        }}
        onResetFilters={handleResetFilters}
        onRefresh={() => {
          fetchSummary();
          fetchRecords();
          showToast("Data refreshed", "info");
        }}
        onOpenAddModal={() => {
          setEditingRecord(null);
          setIsRecordModalOpen(true);
        }}
        isRefreshing={isRecordsLoading || isSummaryLoading}
        hasActiveFilters={hasActiveFilters}
      />

      {/* 5. Main Records Data Table */}
      <DataTable
        records={records}
        isLoading={isRecordsLoading}
        error={recordsError}
        currentPage={currentPage}
        limit={limit}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        onViewRecord={(record) => setViewingRecord(record)}
        onEditRecord={(record) => {
          setEditingRecord(record);
          setIsRecordModalOpen(true);
        }}
        onDeleteRecord={(record) => setDeletingRecord(record)}
        onResetFilters={handleResetFilters}
        selectedIds={selectedIds}
        onToggleSelectAll={handleToggleSelectAll}
        onToggleSelectRow={handleToggleSelectRow}
      />

      {/* 6. Pagination Controls */}
      {records.length > 0 && !isRecordsLoading && !recordsError && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          limit={limit}
          onPageChange={(page) => setCurrentPage(page)}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setCurrentPage(1);
          }}
          disabled={isRecordsLoading}
        />
      )}

      {/* Modals */}
      <RecordModal
        isOpen={isRecordModalOpen}
        onClose={() => {
          setIsRecordModalOpen(false);
          setEditingRecord(null);
          setModalError(null);
        }}
        onSubmit={handleSaveRecord}
        initialData={editingRecord}
        isSubmitting={isSubmitting}
        serverError={modalError}
      />

      <ViewRecordModal
        isOpen={!!viewingRecord}
        onClose={() => setViewingRecord(null)}
        record={viewingRecord}
      />

      <DeleteConfirmModal
        isOpen={!!deletingRecord}
        onClose={() => setDeletingRecord(null)}
        onConfirm={handleConfirmDelete}
        recordName={deletingRecord?.name}
        isDeleting={isDeleting}
      />

      <DeleteConfirmModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        recordName={`${selectedIds.length} selected records`}
        isDeleting={isBulkDeleting}
      />
    </div>
  );
}
