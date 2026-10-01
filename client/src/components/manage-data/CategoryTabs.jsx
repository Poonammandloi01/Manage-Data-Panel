import React from "react";
import {
  Layers,
  GraduationCap,
  BookOpen,
  UserCheck,
  Briefcase,
  Landmark,
  MoreHorizontal
} from "lucide-react";
import { cn } from "../../utils/cn.js";

const categories = [
  { label: "All Data", value: "", icon: Layers },
  { label: "Students", value: "Student", icon: GraduationCap },
  { label: "Teachers", value: "Teacher", icon: BookOpen },
  { label: "Mentors", value: "Mentor", icon: UserCheck },
  { label: "Job Seekers", value: "Job Seeker", icon: Briefcase },
  { label: "Institutes", value: "Institute", icon: Landmark },
  { label: "Others", value: "Other", icon: MoreHorizontal }
];

export default function CategoryTabs({ activeCategory, onSelectCategory, disabled }) {
  return (
    <div className="border-b border-slate-200/90 -mx-4 px-4 md:-mx-6 md:px-6 overflow-x-auto no-scrollbar">
      <nav className="flex items-center gap-2 min-w-max pb-2" aria-label="Category tabs">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.value;

          return (
            <button
              key={cat.label}
              type="button"
              disabled={disabled}
              onClick={() => onSelectCategory(cat.value)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 border focus:outline-none select-none",
                isActive
                  ? "bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-600/25"
                  : "bg-white text-slate-600 border-slate-200/90 hover:bg-emerald-50/50 hover:text-brand-700 hover:border-emerald-300 shadow-2xs",
                disabled && "opacity-60 cursor-not-allowed"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 transition-colors",
                  isActive ? "text-white" : "text-slate-400 group-hover:text-brand-600"
                )}
              />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
