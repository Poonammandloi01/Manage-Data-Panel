import React from "react";
import { Menu, Activity, ShieldCheck, Server, Sparkles } from "lucide-react";
import { useHealthCheck } from "../hooks/useHealthCheck.js";

export default function Header({ onMenuClick, currentTitle }) {
  const { isLoading, isConnected, message } = useHealthCheck();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs shrink-0">
      {/* Mobile Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden focus:outline-none transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base md:text-lg font-bold text-slate-900 tracking-tight">
            {currentTitle || "Manage Data Panel"}
          </h1>
        </div>
      </div>

      {/* Right side status indicators */}
      <div className="flex items-center gap-2.5">
        {/* Backend API status badge */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            isLoading
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : isConnected
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-xs"
              : "bg-rose-50 text-rose-700 border-rose-200"
          }`}
          title={`Backend status: ${message}`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isLoading
                ? "bg-amber-500 animate-ping"
                : isConnected
                ? "bg-emerald-500"
                : "bg-rose-500"
            }`}
          />
          <span className="hidden sm:inline font-medium text-slate-500">API:</span>
          <span>{isLoading ? "Checking..." : isConnected ? "Online" : "Offline"}</span>
        </div>

        {/* BlackCube Solutions Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100/90 border border-slate-200/80 text-slate-700 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>BlackCube Solutions</span>
        </div>
      </div>
    </header>
  );
}
