"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import { motion, AnimatePresence } from "framer-motion";
import MobileMenu from "@/components/layout/mobile-menu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="h-screen w-full flex bg-gradient-to-b from-white to-slate-50 text-foreground">

      {/* SIDEBAR DESKTOP */}
      <div className="hidden md:flex">
        <div className="h-screen w-64 border-r border-slate-200 bg-white shadow-sm fixed left-0 top-0">
          <Sidebar />
        </div>
      </div>

{/* MOBILE GRID MENU */}
<MobileMenu open={open} onClose={() => setOpen(false)} />

      {/* MAIN AREA */}
      <div className="flex flex-col flex-1 md:ml-64 h-screen">

        {/* FIXED TOPBAR */}
        <div className="sticky top-0 z-20 backdrop-blur-xl bg-white/70 border-b border-slate-200 shadow-sm">
          <Topbar onMenu={() => setOpen(true)} />
        </div>

        {/* FULL-WIDTH SCROLL AREA */}
        <div className="flex-1 overflow-y-auto">
          {/* Content wrapper */}
          <div className="w-full max-w-6xl mx-auto px-4 md:px-10 py-10 space-y-10">
            {children}
          </div>
        </div>

      </div>
    </div>
  );
}
