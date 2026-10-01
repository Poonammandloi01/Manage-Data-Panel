import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout.jsx";
import {
  DashboardPage,
  ManageDataPage,
  UploadExcelPage,
  SocialAdsPage,
  NotFoundPage
} from "./pages/index.js";

export default function App() {
  return (
    <Routes>
      {/* Main Layout wrapper */}
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="manage-data" element={<ManageDataPage />} />
        <Route path="upload-excel" element={<UploadExcelPage />} />
        <Route path="social-ads" element={<SocialAdsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
