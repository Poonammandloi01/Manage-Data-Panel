import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileSpreadsheet,
  FileText,
  X,
  AlertCircle,
  FileCheck,
  CheckCircle2,
  Download
} from "lucide-react";
import { cn } from "../../utils/cn.js";

const ACCEPTED_EXTENSIONS = [".xlsx", ".xls", ".csv"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function FileUploadZone({
  selectedFile,
  onFileSelect,
  onFileRemove,
  isProcessing,
  error
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const validateAndSelect = (file) => {
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isValidExt = ACCEPTED_EXTENSIONS.some((ext) => fileName.endsWith(ext));

    if (!isValidExt) {
      onFileSelect(null, "Invalid file format. Please upload a .xlsx, .xls, or .csv file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      onFileSelect(null, "File is too large. Maximum supported size is 10MB.");
      return;
    }

    onFileSelect(file, null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isProcessing) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isProcessing) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="space-y-4">
      {/* Upload Box / Selected File Display */}
      {!selectedFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "relative p-8 md:p-12 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center group bg-white shadow-card",
            isDragOver
              ? "border-brand-500 bg-emerald-50/50 scale-[0.99]"
              : "border-slate-300 hover:border-brand-500 hover:bg-slate-50/70",
            isProcessing && "opacity-50 cursor-wait"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                validateAndSelect(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-brand-600 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-sm">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1 font-heading">
            Choose a spreadsheet file or drag & drop here
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mb-4">
            Supports <span className="text-brand-700 font-semibold">.XLSX</span>,{" "}
            <span className="text-brand-700 font-semibold">.XLS</span>, and{" "}
            <span className="text-brand-700 font-semibold">.CSV</span> files up to 10MB
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100/80 text-brand-700 border border-emerald-200 transition shadow-2xs">
            <FileSpreadsheet className="w-4 h-4 text-brand-600" />
            <span>Browse Files</span>
          </div>
        </div>
      ) : (
        /* Selected File Card */
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-card">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm truncate max-w-[280px] sm:max-w-md font-heading">
                  {selectedFile.name}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Ready to map
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Size: {formatFileSize(selectedFile.size)} • Type:{" "}
                {selectedFile.name.split(".").pop()?.toUpperCase()}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onFileRemove}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition self-start sm:self-auto shadow-2xs"
          >
            <X className="w-4 h-4" />
            <span>Remove File</span>
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2.5 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
