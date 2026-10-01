import React, { useState } from "react";
import { X, Copy, Check, Mail, Phone, MapPin, Building, Calendar, Tag, Activity } from "lucide-react";

export default function ViewRecordModal({ isOpen, onClose, record }) {
  const [copiedField, setCopiedField] = useState(null);

  if (!isOpen || !record) return null;

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/70">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-heading">Record Details</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">ID: {record._id}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs sm:text-sm">
          {/* Name & Type */}
          <div className="flex items-start justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">Full Name</span>
              <h4 className="text-lg font-bold text-slate-900 mt-0.5 font-heading">{record.name}</h4>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
              {record.type}
            </span>
          </div>

          {/* Email */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-200">
            <div className="flex items-center gap-2.5 min-w-0">
              <Mail className="w-4 h-4 text-brand-600 shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Email</span>
                <span className="text-xs text-slate-800 font-mono font-medium truncate">{record.email}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(record.email, "email")}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
              title="Copy email"
            >
              {copiedField === "email" ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Phone */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-200">
            <div className="flex items-center gap-2.5 min-w-0">
              <Phone className="w-4 h-4 text-brand-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Phone</span>
                <span className="text-xs text-slate-800 font-mono font-medium">{record.phone}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(record.phone, "phone")}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
              title="Copy phone"
            >
              {copiedField === "phone" ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Organisation & Address */}
          <div className="grid grid-cols-1 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-50/50 border border-slate-200">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <Building className="w-3.5 h-3.5 text-brand-600" />
                <span className="text-[11px] uppercase font-semibold">Organisation</span>
              </div>
              <p className="text-xs text-slate-800 font-medium">{record.organisation || "Not specified"}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/50 border border-slate-200">
              <div className="flex items-center gap-2 text-slate-500 mb-1">
                <MapPin className="w-3.5 h-3.5 text-brand-600" />
                <span className="text-[11px] uppercase font-semibold">Address</span>
              </div>
              <p className="text-xs text-slate-800 font-medium">{record.address || "Not specified"}</p>
            </div>
          </div>

          {/* Status grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">Link Status</span>
              <span className="font-semibold text-slate-800">{record.linkStatus || "Pending"}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">Download Status</span>
              <span className="font-semibold text-slate-800">{record.downloadStatus || "Pending"}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
