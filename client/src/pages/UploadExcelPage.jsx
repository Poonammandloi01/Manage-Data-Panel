import React, { useState, useEffect, useMemo } from "react";
import * as XLSX from "xlsx";
import {
  FileSpreadsheet,
  Download,
  Sparkles,
  HelpCircle,
  FileCheck2,
  AlertTriangle
} from "lucide-react";
import { recordService } from "../services/recordService.js";
import {
  FileUploadZone,
  HeaderMapping,
  ImportPreviewTable,
  ImportSuccessModal,
  TARGET_FIELDS
} from "../components/upload-excel/index.js";
import Toast from "../components/common/Toast.jsx";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function UploadExcelPage() {
  // File & Raw Parse State
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileError, setFileError] = useState(null);
  const [rawRows, setRawRows] = useState([]);
  const [detectedColumns, setDetectedColumns] = useState([]);

  // Mapping State
  const [mapping, setMapping] = useState({});

  // Import Request State
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => setToast({ message, type });

  // Handle file selection and parsing via SheetJS
  const handleFileSelect = async (file, error) => {
    if (error) {
      setFileError(error);
      setSelectedFile(null);
      setRawRows([]);
      setDetectedColumns([]);
      setMapping({});
      return;
    }

    if (!file) return;

    try {
      setIsProcessing(true);
      setFileError(null);
      setSelectedFile(file);

      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array", cellDates: true });

      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error("No worksheets found in the uploaded file.");
      }

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Convert to JSON with empty strings for missing cells
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      if (!jsonData || jsonData.length === 0) {
        throw new Error("The spreadsheet is empty or has no data rows.");
      }

      // Extract detected columns from the first 10 rows
      const columnSet = new Set();
      jsonData.slice(0, 10).forEach((row) => {
        Object.keys(row).forEach((col) => {
          if (col && typeof col === "string" && !col.startsWith("__EMPTY")) {
            columnSet.add(col.trim());
          }
        });
      });

      const cols = Array.from(columnSet);
      if (cols.length === 0) {
        throw new Error("Could not detect any column headers in the spreadsheet.");
      }

      setDetectedColumns(cols);
      setRawRows(jsonData);

      // Auto-detect mappings using heuristics
      const initialMapping = {};
      TARGET_FIELDS.forEach((target) => {
        const matchedCol = cols.find((col) => {
          const lower = col.toLowerCase().replace(/[^a-z0-9]/g, "");
          return target.defaultMatch.some((pattern) => {
            const cleanPattern = pattern.toLowerCase().replace(/[^a-z0-9]/g, "");
            return lower === cleanPattern || lower.includes(cleanPattern);
          });
        });
        if (matchedCol) {
          initialMapping[target.key] = matchedCol;
        }
      });

      setMapping(initialMapping);
      showToast(`Spreadsheet parsed: ${jsonData.length} rows detected`, "info");
    } catch (err) {
      console.error("SheetJS Parsing error:", err);
      setFileError(err.message || "Failed to parse spreadsheet file.");
      setSelectedFile(null);
      setRawRows([]);
      setDetectedColumns([]);
      setMapping({});
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset/Remove Selected File
  const handleReset = () => {
    setSelectedFile(null);
    setIsProcessing(false);
    setFileError(null);
    setRawRows([]);
    setDetectedColumns([]);
    setMapping({});
    setImportResult(null);
    setIsSuccessModalOpen(false);
  };

  // Handle mapping adjustment
  const handleMappingChange = (targetKey, columnName) => {
    setMapping((prev) => ({
      ...prev,
      [targetKey]: columnName
    }));
  };

  // Compute validation and preview rows based on active mapping
  const previewRows = useMemo(() => {
    if (!rawRows || rawRows.length === 0) return [];

    const seenEmails = new Set();

    return rawRows.map((rawRow, idx) => {
      const rowNumber = idx + 1;
      const errors = [];

      // Extract mapped fields
      const name = mapping.name ? String(rawRow[mapping.name] || "").trim() : "";
      const email = mapping.email ? String(rawRow[mapping.email] || "").trim().toLowerCase() : "";
      const phone = mapping.phone ? String(rawRow[mapping.phone] || "").trim() : "";
      const address = mapping.address ? String(rawRow[mapping.address] || "").trim() : "";
      const organisation = mapping.organisation ? String(rawRow[mapping.organisation] || "").trim() : "";
      const type = mapping.type ? String(rawRow[mapping.type] || "").trim() : "Student";
      const linkStatus = mapping.linkStatus ? String(rawRow[mapping.linkStatus] || "").trim() : "Pending";
      const downloadStatus = mapping.downloadStatus ? String(rawRow[mapping.downloadStatus] || "").trim() : "Pending";
      const dateAdded = mapping.dateAdded ? rawRow[mapping.dateAdded] : new Date();

      // Check if row is entirely blank
      const isBlank = !name && !email && !phone && !address && !organisation;
      if (isBlank) {
        errors.push("Empty row");
      } else {
        // Validate Required Fields
        if (!name) errors.push("Missing Name");
        if (!email) {
          errors.push("Missing Email");
        } else if (!emailRegex.test(email)) {
          errors.push(`Invalid email format: "${email}"`);
        } else if (seenEmails.has(email)) {
          errors.push(`Duplicate email in file: "${email}"`);
        } else {
          seenEmails.add(email);
        }

        if (!phone) errors.push("Missing Phone number");
      }

      return {
        rowNumber,
        isValid: errors.length === 0,
        errors,
        data: {
          name,
          email,
          phone,
          address,
          organisation,
          type: type || "Student",
          linkStatus: linkStatus || "Pending",
          downloadStatus: downloadStatus || "Pending",
          dateAdded: dateAdded || new Date()
        }
      };
    });
  }, [rawRows, mapping]);

  const validRows = useMemo(() => previewRows.filter((r) => r.isValid), [previewRows]);
  const invalidRows = useMemo(() => previewRows.filter((r) => !r.isValid), [previewRows]);

  // Execute Import to MongoDB
  const handleImport = async () => {
    if (validRows.length === 0) {
      showToast("No valid records to import", "error");
      return;
    }

    try {
      setIsImporting(true);
      const recordsToImport = validRows.map((r) => r.data);
      const response = await recordService.importRecords(recordsToImport);

      if (response.success && response.data) {
        setImportResult(response.data);
        setIsSuccessModalOpen(true);
        showToast(
          `Successfully imported ${response.data.importedCount} records to MongoDB!`,
          "success"
        );
      }
    } catch (err) {
      showToast(err.message || "Bulk import failed", "error");
    } finally {
      setIsImporting(false);
    }
  };

  // Helper to download sample Excel/CSV template
  const handleDownloadSample = (format = "xlsx") => {
    const sampleData = [
      {
        "Full Name": "Aarav Sharma",
        "Email Address": "aarav.sharma@example.com",
        "Phone Number": "+91 9876543210",
        Address: "Connaught Place, New Delhi",
        Organisation: "Delhi University",
        Category: "Student",
        "Link Status": "Pending",
        "Download Status": "Pending"
      },
      {
        "Full Name": "Dr. Sunita Rao",
        "Email Address": "sunita.rao@institute.edu",
        "Phone Number": "+91 9822334455",
        Address: "Koramangala, Bengaluru",
        Organisation: "Indian Institute of Science",
        Category: "Teacher",
        "Link Status": "Sent",
        "Download Status": "Downloaded"
      },
      {
        "Full Name": "Global Tech Academy",
        "Email Address": "admissions@globaltech.ac.in",
        "Phone Number": "+91 1122334455",
        Address: "Sector 62, Noida",
        Organisation: "Global Tech Education",
        Category: "Institute",
        "Link Status": "Sent",
        "Download Status": "Completed"
      }
    ];

    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sample_Records");

    if (format === "csv") {
      XLSX.writeFile(wb, "manage_data_sample.csv", { bookType: "csv" });
    } else {
      XLSX.writeFile(wb, "manage_data_sample.xlsx", { bookType: "xlsx" });
    }
    showToast(`Sample ${format.toUpperCase()} template downloaded`, "info");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Success Modal */}
      <ImportSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        result={importResult}
        onReset={handleReset}
      />

      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              SheetJS / XLSX Engine
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Upload Excel & CSV Datasets
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Import spreadsheets, review column mappings, validate rows, and commit verified records directly into MongoDB.
          </p>
        </div>

        {/* Sample Download Dropdown/Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleDownloadSample("xlsx")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs transition"
            title="Download sample .xlsx spreadsheet"
          >
            <Download className="w-3.5 h-3.5 text-brand-600" />
            <span>Sample .XLSX</span>
          </button>
          <button
            type="button"
            onClick={() => handleDownloadSample("csv")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs transition"
            title="Download sample .csv file"
          >
            <Download className="w-3.5 h-3.5 text-teal-600" />
            <span>Sample .CSV</span>
          </button>
        </div>
      </div>

      {/* 2. File Upload Zone */}
      <FileUploadZone
        selectedFile={selectedFile}
        onFileSelect={handleFileSelect}
        onFileRemove={handleReset}
        isProcessing={isProcessing}
        error={fileError}
      />

      {/* 3. Header & Column Mapping Section */}
      {selectedFile && detectedColumns.length > 0 && (
        <HeaderMapping
          detectedColumns={detectedColumns}
          mapping={mapping}
          onMappingChange={handleMappingChange}
        />
      )}

      {/* 4. Preview Table & Commit Action */}
      {selectedFile && previewRows.length > 0 && (
        <ImportPreviewTable
          previewRows={previewRows}
          validCount={validRows.length}
          invalidCount={invalidRows.length}
          onCancel={handleReset}
          onImport={handleImport}
          isImporting={isImporting}
        />
      )}
    </div>
  );
}
