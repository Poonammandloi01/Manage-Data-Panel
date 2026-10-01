import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Database,
  FileSpreadsheet,
  Share2,
  X,
  Sprout,
  Sparkles,
  Layers
} from "lucide-react";
import { cn } from "../utils/cn.js";

const navItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview & Analytics"
  },
  {
    name: "Manage Data",
    path: "/manage-data",
    icon: Database,
    description: "Records & Filters"
  },
  {
    name: "Upload Excel",
    path: "/upload-excel",
    icon: FileSpreadsheet,
    description: "Import & Mapping"
  },
  {
    name: "Social & Ads",
    path: "/social-ads",
    icon: Share2,
    description: "Campaign Metrics"
  }
];

export default function Sidebar({ isMobileOpen, setIsMobileOpen }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-[#0c2317] border-r border-[#193f2c] transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:h-full shrink-0 select-none shadow-xl",
          isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-[#193f2c] bg-[#091b12]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-lime-400 text-white shadow-md shadow-brand-500/30">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-white text-base">BlackCube Solutions</span>
              <span className="text-[10px] block font-bold text-lime-400 uppercase tracking-widest">Data Panel</span>
            </div>
          </div>

          <button
            type="button"
            className="p-1.5 rounded-lg text-emerald-300/70 hover:text-white hover:bg-emerald-950/80 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-emerald-400/80">
            Main Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group",
                    isActive
                      ? "bg-brand-600 text-white shadow-md shadow-brand-600/30 border border-brand-500/40"
                      : "text-emerald-100/75 hover:text-white hover:bg-[#133523] border border-transparent"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        "w-5 h-5 transition-colors",
                        isActive ? "text-white" : "text-emerald-300/80 group-hover:text-white"
                      )}
                    />
                    <div className="flex-1">
                      <span className="block leading-tight">{item.name}</span>
                    </div>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Status Card */}
        <div className="p-3 border-t border-[#193f2c] bg-[#091b12]">
          <div className="p-3 rounded-xl bg-[#112f20] border border-[#1d4a34] text-xs text-emerald-200/80">
            <div className="flex items-center gap-1.5 text-lime-400 font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BlackCube Solutions</span>
            </div>
            <p className="text-[11px] text-emerald-200/70 leading-relaxed font-medium">
              Real-time database sync & data management engine active.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
