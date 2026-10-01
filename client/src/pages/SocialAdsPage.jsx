import React, { useState } from "react";
import {
  Share2,
  BarChart3,
  Target,
  DollarSign,
  TrendingUp,
  Users,
  Eye,
  MousePointerClick,
  Sparkles,
  ArrowUpRight,
  Filter
} from "lucide-react";
import { cn } from "../utils/cn.js";

const campaigns = [
  {
    id: "CAMP-101",
    name: "Summer 2026 Student Enrollment",
    platform: "Google Ads",
    status: "Active",
    spend: "$4,250",
    impressions: "128,400",
    clicks: "6,420",
    ctr: "5.0%",
    cpc: "$0.66",
    conversions: "412",
    cvr: "6.4%"
  },
  {
    id: "CAMP-102",
    name: "Faculty & Teacher Hiring Drive",
    platform: "LinkedIn",
    status: "Active",
    spend: "$2,800",
    impressions: "45,200",
    clicks: "1,850",
    ctr: "4.1%",
    cpc: "$1.51",
    conversions: "148",
    cvr: "8.0%"
  },
  {
    id: "CAMP-103",
    name: "Campus Partnership Outreach",
    platform: "Meta (Instagram)",
    status: "Active",
    spend: "$1,950",
    impressions: "92,100",
    clicks: "3,680",
    ctr: "4.0%",
    cpc: "$0.53",
    conversions: "220",
    cvr: "6.0%"
  },
  {
    id: "CAMP-104",
    name: "Tech Mentorship Webinar Ads",
    platform: "YouTube",
    status: "Paused",
    spend: "$1,200",
    impressions: "64,000",
    clicks: "1,920",
    ctr: "3.0%",
    cpc: "$0.63",
    conversions: "95",
    cvr: "4.9%"
  }
];

export default function SocialAdsPage() {
  const [platformFilter, setPlatformFilter] = useState("All");

  const filteredCampaigns = campaigns.filter(
    (c) => platformFilter === "All" || c.platform.includes(platformFilter)
  );

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Share2 className="w-3.5 h-3.5" />
              Campaign Performance
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Social & Ads Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track student acquisition funnels, advertisement spend, click-through rates, and lead conversions.
          </p>
        </div>

        {/* Total Ad Spend Badge */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-card">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Spend</span>
            <span className="text-lg font-extrabold text-slate-900 font-heading">$10,200</span>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Impressions</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading mt-3">329,700</div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 inline-block">↑ 14.8% vs last month</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Clicks</span>
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-100">
              <MousePointerClick className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading mt-3">13,870</div>
          <span className="text-[11px] text-teal-700 font-medium mt-1 inline-block">Avg. CTR 4.2%</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Conversions</span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading mt-3">875 Leads</div>
          <span className="text-[11px] text-indigo-700 font-medium mt-1 inline-block">6.3% Conversion Rate</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Avg. Cost / Lead</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading mt-3">$11.65</div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 inline-block">Within target ROI</span>
        </div>
      </div>

      {/* 3. Campaign Table & Filter */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-card overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-heading">Active Ad Campaigns</h3>
            <p className="text-xs text-slate-500 mt-0.5">Performance breakdown by promotional channel</p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 shadow-2xs"
            >
              <option value="All">All Platforms</option>
              <option value="Google">Google Ads</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Meta">Meta (Instagram)</option>
              <option value="YouTube">YouTube</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider select-none">
                <th className="py-3.5 px-4">Campaign Name</th>
                <th className="py-3.5 px-4">Platform</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Spend</th>
                <th className="py-3.5 px-4">Impressions</th>
                <th className="py-3.5 px-4">Clicks</th>
                <th className="py-3.5 px-4">CTR</th>
                <th className="py-3.5 px-4">CPC</th>
                <th className="py-3.5 px-4">Conversions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredCampaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-emerald-50/40 transition">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                    {camp.name}
                    <span className="block text-[11px] font-mono text-slate-400 font-normal">
                      {camp.id}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    {camp.platform}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border",
                        camp.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      )}
                    >
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          camp.status === "Active" ? "bg-emerald-500" : "bg-slate-400"
                        )}
                      />
                      {camp.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{camp.spend}</td>
                  <td className="py-3.5 px-4 text-slate-600">{camp.impressions}</td>
                  <td className="py-3.5 px-4 text-slate-600">{camp.clicks}</td>
                  <td className="py-3.5 px-4 text-teal-700 font-semibold">{camp.ctr}</td>
                  <td className="py-3.5 px-4 text-slate-600">{camp.cpc}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">{camp.conversions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
