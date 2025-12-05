"use client";

import Link from "next/link";
import { Menu, Settings } from "lucide-react";
import { motion } from "framer-motion";

export default function Topbar({ onMenu }: { onMenu?: () => void }) {
  const title = "MindsetDebugger";

  return (
    <header
      className="
        h-16 flex items-center justify-between
        px-4 md:px-8
        bg-white/90
        backdrop-blur-2xl
        border-b border-slate-200/80
        shadow-[0_6px_20px_rgba(180,190,205,0.18)]
      "
    >
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={onMenu}
          className="md:hidden p-2 rounded-xl hover:bg-slate-100 active:scale-95 transition"
        >
          <Menu size={24} className="text-slate-700" />
        </button>

        {/* MOBILE TITLE WITH ANIMATION */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.02 } },
          }}
          className="flex gap-[1px] md:hidden"
        >
          {title.split("").map((char, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { opacity: 0, y: 6 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="text-lg font-semibold text-slate-900 tracking-tight"
            >
              {char}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* RIGHT SIDE (DESKTOP ONLY) */}
      <div className="hidden md:flex items-center gap-5">

        {/* SETTINGS BUTTON */}
        <Link
          href="/dashboard/settings"
          className="
            p-2 rounded-xl 
            hover:bg-slate-100 
            transition-all 
            shadow-sm hover:shadow
          "
        >
          <Settings size={20} className="text-slate-600" />
        </Link>

        {/* AVATAR */}
        <Link
          href="/dashboard/settings"
          className="
            w-10 h-10 rounded-full
            border border-slate-300 
            cursor-pointer
            bg-gradient-to-br from-indigo-100 to-indigo-200
            shadow-inner 
            flex items-center justify-center
            font-semibold text-indigo-700
            hover:opacity-90 transition
          "
        >
          N
        </Link>
      </div>
    </header>
  );
}
