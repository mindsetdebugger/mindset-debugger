"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/dashboard/insights", label: "Insights", icon: Search },
    { href: "/dashboard/trends", label: "Trends", icon: LineChart },
    { href: "/dashboard/compass", label: "Compass", icon: Compass },
    { href: "/dashboard/coach", label: "Coach", icon: UserStar },
    { href: "/dashboard/notes", label: "Notes", icon: NotebookTabs },
    { href: "/dashboard/history", label: "History", icon: BookText },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* CONTENT */}
          <motion.div
            className="
              fixed inset-0 z-50
              flex flex-col
              bg-white/90 backdrop-blur-xl
              p-6
            "
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-3 rounded-xl bg-white shadow-sm"
            >
              <X className="w-5 h-5 text-slate-700" />
            </button>

            {/* GRID MENU */}
            <div className="grid grid-cols-2 gap-4 mt-12">
              {menu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="
                    flex flex-col items-center justify-center
                    rounded-2xl bg-white shadow-sm border border-slate-200
                    py-6 px-3
                    active:scale-95 transition-all
                    hover:bg-slate-50
                  "
                >
                  <item.icon className="w-7 h-7 text-indigo-600 mb-2" />
                  <span className="text-sm font-medium text-slate-700">
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
