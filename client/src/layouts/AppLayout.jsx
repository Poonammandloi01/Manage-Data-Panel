import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";

const routeTitles = {
  "/dashboard": "Dashboard Overview",
  "/manage-data": "Manage Data Records",
  "/upload-excel": "Excel / CSV Import",
  "/social-ads": "Social & Ads Analytics"
};

export default function AppLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const currentTitle = routeTitles[location.pathname] || "Manage Data Panel";

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-y-auto">
        <Header onMenuClick={() => setIsMobileOpen(true)} currentTitle={currentTitle} />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
