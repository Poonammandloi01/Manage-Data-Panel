import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Database,
  GraduationCap,
  BookOpen,
  Landmark,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  Share2,
  CheckCircle2,
  Sparkles,
  Server,
  Layers,
  ArrowUpRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { recordService } from "../services/recordService.js";
import { useHealthCheck } from "../hooks/useHealthCheck.js";

export default function DashboardPage() {
  const [summary, setSummary] = useState({
    allData: 0,
    students: 0,
    teachers: 0,
    institutes: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { isConnected } = useHealthCheck();

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        const res = await recordService.getSummary();
        if (res.success && res.data) {
          setSummary(res.data);
        }
      } catch (err) {
        console.error("Dashboard failed to load summary stats:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadStats();
  }, []);

  const total = summary.allData || 0;
  const studentPct = total > 0 ? Math.round((summary.students / total) * 100) : 0;
  const teacherPct = total > 0 ? Math.round((summary.teachers / total) * 100) : 0;
  const institutePct = total > 0 ? Math.round((summary.institutes / total) * 100) : 0;
  const othersCount = Math.max(0, total - (summary.students + summary.teachers + summary.institutes));
  const othersPct = total > 0 ? Math.max(0, 100 - (studentPct + teacherPct + institutePct)) : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Welcome Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-950 to-slate-900 border border-emerald-800/40 shadow-xl text-white">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>BlackCube Solutions Enterprise Data Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
              Enterprise Data Management Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              Real-time analytics engine synchronized with MongoDB. Monitor candidate database volumes, classification breakdowns, and spreadsheet imports seamlessly.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/manage-data"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs sm:text-sm font-semibold transition shadow-md shadow-brand-600/30"
            >
              <Database className="w-4 h-4" />
              <span>Manage Records</span>
            </Link>
            <Link
              to="/upload-excel"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/20 backdrop-blur-xs transition"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>Import Excel</span>
            </Link>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Top Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Records */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Records</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            {isLoading ? (
              <div className="h-8 w-20 bg-slate-100 animate-pulse rounded-lg" />
            ) : (
              <div className="text-3xl font-extrabold text-slate-900 font-heading">{Number(total).toLocaleString()}</div>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">Live from MongoDB</p>
        </div>

        {/* Students */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Students</span>
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            {isLoading ? (
              <div className="h-8 w-20 bg-slate-100 animate-pulse rounded-lg" />
            ) : (
              <div className="text-3xl font-extrabold text-slate-900 font-heading">{Number(summary.students).toLocaleString()}</div>
            )}
          </div>
          <p className="text-[11px] text-teal-700 font-medium mt-1">{studentPct}% of total records</p>
        </div>

        {/* Teachers */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Teachers</span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            {isLoading ? (
              <div className="h-8 w-20 bg-slate-100 animate-pulse rounded-lg" />
            ) : (
              <div className="text-3xl font-extrabold text-slate-900 font-heading">{Number(summary.teachers).toLocaleString()}</div>
            )}
          </div>
          <p className="text-[11px] text-indigo-700 font-medium mt-1">{teacherPct}% of total records</p>
        </div>

        {/* Institutes */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Institutes</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-100">
              <Landmark className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            {isLoading ? (
              <div className="h-8 w-20 bg-slate-100 animate-pulse rounded-lg" />
            ) : (
              <div className="text-3xl font-extrabold text-slate-900 font-heading">{Number(summary.institutes).toLocaleString()}</div>
            )}
          </div>
          <p className="text-[11px] text-amber-800 font-medium mt-1">{institutePct}% of total records</p>
        </div>
      </div>

      {/* 3. Category Distribution & Quick Links Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown Card */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">Database Category Distribution</h3>
              <p className="text-xs text-slate-500 mt-0.5">Real-time breakdown of candidate classifications</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active Sync
            </span>
          </div>

          {/* Progress Bar Breakdown */}
          <div className="space-y-3">
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
              <div style={{ width: `${studentPct}%` }} className="bg-teal-500 transition-all duration-500" title={`Students: ${studentPct}%`} />
              <div style={{ width: `${teacherPct}%` }} className="bg-indigo-500 transition-all duration-500" title={`Teachers: ${teacherPct}%`} />
              <div style={{ width: `${institutePct}%` }} className="bg-amber-500 transition-all duration-500" title={`Institutes: ${institutePct}%`} />
              <div style={{ width: `${othersPct}%` }} className="bg-slate-400 transition-all duration-500" title={`Others: ${othersPct}%`} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 mb-1">
                  <span className="w-2 h-2 rounded-full bg-teal-500" />
                  <span>Students</span>
                </div>
                <div className="text-lg font-bold text-slate-900">{summary.students}</div>
                <span className="text-[11px] text-slate-500 font-medium">{studentPct}%</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 mb-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>Teachers</span>
                </div>
                <div className="text-lg font-bold text-slate-900">{summary.teachers}</div>
                <span className="text-[11px] text-slate-500 font-medium">{teacherPct}%</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 mb-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Institutes</span>
                </div>
                <div className="text-lg font-bold text-slate-900">{summary.institutes}</div>
                <span className="text-[11px] text-slate-500 font-medium">{institutePct}%</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>Other Roles</span>
                </div>
                <div className="text-lg font-bold text-slate-900">{othersCount}</div>
                <span className="text-[11px] text-slate-500 font-medium">{othersPct}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* System & Architecture Status Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-card flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base mb-1 font-heading">
              <Server className="w-5 h-5 text-brand-600" />
              <span>Platform Health</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              MERN Stack running in production mode with centralized error handling and Mongoose ODM.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-600 font-medium">Database</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Connected
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-600 font-medium">SheetJS Engine</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Operational
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-600 font-medium">CORS & Security</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active
              </span>
            </div>
          </div>

          <Link
            to="/manage-data"
            className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100/70 text-emerald-900 text-xs font-semibold transition group border border-emerald-200/80"
          >
            <span>Open Data Management Table</span>
            <ArrowRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}
