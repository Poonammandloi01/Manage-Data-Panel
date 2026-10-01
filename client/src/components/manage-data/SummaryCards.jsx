import React from "react";
import { Database, GraduationCap, BookOpen, Landmark, ArrowUpRight } from "lucide-react";
import { cn } from "../../utils/cn.js";

const cardsConfig = [
  {
    key: "allData",
    title: "All Data",
    icon: Database,
    accentColor: "from-brand-600 to-emerald-500",
    iconBg: "bg-emerald-50 text-brand-700 border-emerald-200/80",
    badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    description: "Total database volume"
  },
  {
    key: "students",
    title: "Students",
    icon: GraduationCap,
    accentColor: "from-teal-600 to-emerald-500",
    iconBg: "bg-teal-50 text-teal-700 border-teal-200/80",
    badgeBg: "bg-teal-50 text-teal-700 border-teal-200",
    description: "Registered student entries"
  },
  {
    key: "teachers",
    title: "Teachers",
    icon: BookOpen,
    accentColor: "from-indigo-600 to-violet-500",
    iconBg: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
    badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
    description: "Instructors & faculty"
  },
  {
    key: "institutes",
    title: "Institutes",
    icon: Landmark,
    accentColor: "from-amber-600 to-orange-500",
    iconBg: "bg-amber-50 text-amber-700 border-amber-200/80",
    badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
    description: "Educational institutions"
  }
];

export default function SummaryCards({ summary, isLoading }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cardsConfig.map((card) => {
        const Icon = card.icon;
        const count = summary ? summary[card.key] ?? 0 : 0;

        return (
          <div
            key={card.key}
            className="relative overflow-hidden p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card hover:shadow-card-hover hover:border-slate-300 transition-all duration-200 group"
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {card.title}
              </span>
              <div
                className={cn(
                  "p-2.5 rounded-xl border transition-transform duration-200 group-hover:scale-105 shadow-2xs",
                  card.iconBg
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>

            {/* Main Count */}
            <div className="mt-3">
              {isLoading ? (
                <div className="h-9 w-24 bg-slate-100 animate-pulse rounded-lg my-1" />
              ) : (
                <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {Number(count).toLocaleString()}
                </div>
              )}
            </div>

            {/* Footer description */}
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <span className="truncate font-medium">{card.description}</span>
              <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Live DB
              </span>
            </div>

            {/* Subtle glow border at bottom */}
            <div
              className={cn(
                "absolute bottom-0 left-0 right-0 h-1 opacity-75 group-hover:opacity-100 transition-opacity bg-gradient-to-r",
                card.accentColor
              )}
            />
          </div>
        );
      })}
    </div>
  );
}
