"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">

      {/* Sidebar DESKTOP */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* SIDEBAR MOBILE OVERLAY */}
      <AnimatePresence>
        {open && (
          <>
            {/* Dark background */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Mobile sidebar */}
            <motion.div
              className="fixed top-0 left-0 h-full w-72 z-50 md:hidden bg-background shadow-xl"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Sidebar onClose={() => setOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MAIN COLUMN */}
      <div className="flex flex-col flex-1">

        {/* Topbar controls mobile sidebar */}
        <Topbar onMenu={() => setOpen(true)} />

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
