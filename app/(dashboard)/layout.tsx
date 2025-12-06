"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import MobileMenu from "@/components/layout/mobile-menu";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useEntriesStore } from "@/lib/store/useEntriesStore";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  // Reset store when auth user changes
  useEffect(() => {
    const supabase = supabaseBrowser();
    const { reset } = useEntriesStore.getState();

    const { data: listener } =
      supabase.auth.onAuthStateChange(() => reset());

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex bg-dashboard relative">
      {/* =============================== */}
      {/* DESKTOP SIDEBAR */}
      {/* =============================== */}
      <aside
        className="
          hidden md:block 
          fixed left-6 top-6 bottom-6 
          w-60 z-40
        "
      >
        <div
          className="
            h-full w-full
            rounded-3xl bg-white/80 backdrop-blur-xl
            border border-border
            shadow-[0_4px_30px_rgba(0,0,0,0.06)]
            overflow-hidden
            flex flex-col
          "
        >
          <Sidebar />
        </div>
      </aside>

      {/* =============================== */}
      {/* MOBILE MENU OVERLAY (Reflectly style) */}
      {/* =============================== */}
      <MobileMenu open={open} onClose={() => setOpen(false)} />

      {/* =============================== */}
      {/* MAIN AREA */}
      {/* =============================== */}
      <div
        className="
          flex-1 flex flex-col 
          md:ml-[18rem]  /* space for sidebar */
        "
      >
        {/* =============================== */}
        {/* FLOATING TOPBAR (desktop) */}
        {/* =============================== */}
        <Topbar onMenu={() => setOpen(true)} />

        {/* =============================== */}
        {/* SCROLLABLE CONTENT */}
        {/* =============================== */}
        <main
          className="
            flex-1 overflow-y-auto
            px-4 md:px-12 
            pt-28 pb-24     /* top spacing for floating bar */
            max-w-6xl w-full 
            mx-auto
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
}
