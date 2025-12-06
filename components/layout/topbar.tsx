"use client";

import Link from "next/link";
import { Menu, Settings } from "lucide-react";

export default function Topbar({ onMenu }: { onMenu?: () => void }) {
  return (
    <div
      className="
        fixed top-6 right-6 left-6
        z-50 flex items-center justify-between
        md:justify-end
      "
    >
      {/* ===== MOBILE LEFT: MENU BUTTON ===== */}
      <button
        onClick={onMenu}
        className="
          md:hidden
          p-2 rounded-xl
          bg-white/80 backdrop-blur-xl
          border border-border
          shadow-[0_4px_14px_rgba(0,0,0,0.08)]
          active:scale-95 transition
        "
      >
        <Menu size={22} className="text-primary" />
      </button>

      {/* ===== RIGHT CLUSTER (DESKTOP + MOBILE) ===== */}
      <div
        className="
          flex items-center gap-3
          px-4 py-2
          rounded-2xl
          bg-white/80 backdrop-blur-xl
          border border-border
          shadow-[0_8px_20px_rgba(0,0,0,0.06)]
        "
      >
        {/* SETTINGS — icon visible always */}
        <Link
          href="/dashboard/settings"
          className="
            hidden md:flex
            p-2 rounded-xl
            hover:bg-primary-soft/70
            transition
          "
        >
          <Settings size={20} className="text-primary" />
        </Link>

        {/* AVATAR */}
        <Link
          href="/dashboard/settings"
          className="
            w-9 h-9 rounded-full 
            bg-primary-soft
            border border-primary/20
            shadow-inner
            flex items-center justify-center
            font-semibold text-primary
            hover:bg-primary/10
            transition
          "
        >
          N
        </Link>
      </div>
    </div>
  );
}
