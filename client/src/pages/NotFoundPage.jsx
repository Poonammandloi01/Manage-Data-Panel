import React from "react";
import { Link } from "react-router-dom";
import { Compass, Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-brand-600 flex items-center justify-center mb-6 shadow-card">
        <Compass className="w-8 h-8 animate-pulse" />
      </div>

      <span className="text-sm font-semibold uppercase tracking-wider text-brand-700 mb-2">
        404 Error
      </span>
      <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3 font-heading">
        Page Not Found
      </h1>
      <p className="text-sm md:text-base text-slate-500 max-w-md mb-8">
        The page you are looking for does not exist or has been moved. Use the navigation to find your way back.
      </p>

      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition shadow-sm shadow-brand-600/30"
      >
        <Home className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
}
