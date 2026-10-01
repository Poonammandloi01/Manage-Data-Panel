import React from "react";
import { ArrowRightLeft, Check, AlertCircle, Sparkles } from "lucide-react";
import { cn } from "../../utils/cn.js";

export const TARGET_FIELDS = [
  {
    key: "name",
    label: "Name",
    required: true,
    description: "Full name of candidate/contact",
    defaultMatch: ["name", "full name", "fullname", "candidate name", "student name", "person name"]
  },
  {
    key: "email",
    label: "Email",
    required: true,
    description: "Valid email address",
    defaultMatch: ["email", "email address", "e-mail", "mail", "email_id"]
  },
  {
    key: "phone",
    label: "Phone No.",
    required: true,
    description: "Contact phone/mobile number",
    defaultMatch: ["phone", "mobile", "contact", "phone number", "mobile number", "contact no", "mobile no", "phone no"]
  },
  {
    key: "address",
    label: "Address",
    required: false,
    description: "Location or physical address",
    defaultMatch: ["address", "location", "city", "state", "residential address"]
  },
  {
    key: "organisation",
    label: "Organisation",
    required: false,
    description: "Institute, company, or school",
    defaultMatch: ["organisation", "organization", "institute", "school", "company", "college", "university"]
  },
  {
    key: "type",
    label: "Category / Type",
    required: false,
    description: "Student, Teacher, Mentor, Job Seeker, Institute, Other",
    defaultMatch: ["type", "category", "role", "designation", "user type"]
  },
  {
    key: "linkStatus",
    label: "Link Status",
    required: false,
    description: "Pending or Sent (defaults to Pending)",
    defaultMatch: ["link status", "linkstatus", "link", "link_status"]
  },
  {
    key: "downloadStatus",
    label: "Download Status",
    required: false,
    description: "Pending, Downloaded, or Completed (defaults to Pending)",
    defaultMatch: ["download status", "downloadstatus", "download", "download_status"]
  },
  {
    key: "dateAdded",
    label: "Date Added",
    required: false,
    description: "Date of record creation (defaults to now)",
    defaultMatch: ["date added", "date", "dateadded", "added on", "created at", "timestamp"]
  }
];

export default function HeaderMapping({
  detectedColumns = [],
  mapping = {},
  onMappingChange
}) {
  const missingRequired = TARGET_FIELDS.filter(
    (field) => field.required && !mapping[field.key]
  );

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 font-heading">Header & Column Mapping</h3>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {detectedColumns.length} Excel Columns Detected
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Match detected spreadsheet headers to our database record attributes. Required fields are marked with <span className="text-rose-500">*</span>.
          </p>
        </div>

        {missingRequired.length > 0 ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Map required: {missingRequired.map((f) => f.label).join(", ")}</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
            <Check className="w-3.5 h-3.5" />
            <span>All required fields mapped</span>
          </div>
        )}
      </div>

      {/* Grid of Mapping Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {TARGET_FIELDS.map((target) => {
          const isMapped = !!mapping[target.key];

          return (
            <div
              key={target.key}
              className={cn(
                "p-3.5 rounded-xl border transition-colors bg-slate-50/60",
                isMapped
                  ? "border-emerald-200 bg-emerald-50/20"
                  : target.required
                  ? "border-amber-300 bg-amber-50/30"
                  : "border-slate-200"
              )}
            >
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-900 flex items-center gap-1">
                  {target.label}
                  {target.required && <span className="text-rose-500">*</span>}
                </label>
                {isMapped && (
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Mapped
                  </span>
                )}
              </div>

              <select
                value={mapping[target.key] || ""}
                onChange={(e) => onMappingChange(target.key, e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 shadow-2xs"
              >
                <option value="">-- Ignore / Not Mapped --</option>
                {detectedColumns.map((col) => (
                  <option key={col} value={col}>
                    Excel: "{col}"
                  </option>
                ))}
              </select>

              <p className="text-[11px] text-slate-500 mt-1.5 truncate" title={target.description}>
                {target.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
