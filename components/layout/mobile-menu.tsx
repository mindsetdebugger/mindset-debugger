"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import {
  Home,
  Search,
  BookText,
  LineChart,
  NotebookTabs,
  UserStar,
  Compass,
  Settings,
} from "lucide-react";

export default function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const menu = [
    { href: "/dashboard", label: "Home", icon: Home, color: "text-indigo-600 bg-indigo-100/70" },
    { href: "/dashboard/insights", label: "Insights", icon: Search, color: "text-purple-600 bg-purple-100/70" },
    { href: "/dashboard/trends", label: "Trends", icon: LineChart, color: "text-blue-600 bg-blue-100/70" },
    { href: "/dashboard/compass", label: "Compass", icon: Compass, color: "text-teal-600 bg-teal-100/70" },
    { href: "/dashboard/coach", label: "Coach", icon: UserStar, color: "text-pink-600 bg-pink-100/70" },
    { href: "/dashboard/notes", label: "Notes", icon: NotebookTabs, color: "text-orange-600 bg-orange-100/70" },
    { href: "/dashboard/history", label: "History", icon: BookText, color: "text-emerald-600 bg-emerald-100/70" },
    { href: "/dashboard/settings", label: "Settings", icon: Settings, color: "text-slate-600 bg-slate-200/70" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0 z-[99] bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* FULLSCREEN OVERLAY PANEL */}
          <motion.div
            className="
              fixed inset-0 z-[100]
              bg-white/85 backdrop-blur-xl
              px-6 pt-20 pb-12
              overflow-y-auto
            "
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={onClose}
              className="
                absolute top-6 right-6
                p-3 rounded-2xl
                bg-white border border-slate-200
                shadow-sm active:scale-95 transition
                z-[120]
              "
            >
              <X className="w-5 h-5 text-slate-700" />
            </button>

            {/* GRID */}
          <div className="grid grid-cols-2 gap-3 mt-4">
  {menu.map((item) => (
    <Link
      key={item.href}
      href={item.href}
      onClick={onClose}
      className="
        flex flex-col items-center justify-center
        rounded-2xl bg-white/90
        border border-slate-200/60
        shadow-[0_3px_10px_rgba(0,0,0,0.04)]
        py-4 px-3
        transition active:scale-95
      "
    >
      <div
        className={`
          w-10 h-10 rounded-xl mb-2
          flex items-center justify-center
          shadow-inner
          ${item.color}
        `}
      >
        <item.icon className="w-5 h-5" />
      </div>

      <span className="text-xs font-medium text-slate-800">
        {item.label}
      </span>
    </Link>
  ))}
</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
