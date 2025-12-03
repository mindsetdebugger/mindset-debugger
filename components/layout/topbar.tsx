"use client";

import Link from "next/link";
import { Menu, Settings } from "lucide-react";
import { motion } from "framer-motion";

export default function Topbar({ onMenu }: { onMenu?: () => void }) {
  const title = "MindsetDebugger";

  return (
    <header
      className="
        h-14 flex items-center justify-between
        px-4 md:px-8
        bg-white/80 backdrop-blur-xl
        border-b border-slate-200
      "
    >
      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">

        {/* MOBILE MENU */}
        <button
          onClick={onMenu}
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 active:scale-95 transition"
        >
          <Menu size={22} className="text-slate-700" />
        </button>

        {/* ANIMATED TITLE (only on mobile) */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.03 } },
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
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="text-md font-semibold text-slate-800 tracking-tight"
            >
              {char}
            </motion.span>
          ))}
        </motion.div>

      </div>

      {/* RIGHT SIDE (DESKTOP ONLY) */}
      <div className="hidden md:flex items-center gap-4">

        {/* SETTINGS */}
        <Link
          href="/dashboard/settings"
          className="p-2 rounded-xl hover:bg-slate-100 transition"
        >
          <Settings size={20} className="text-slate-600" />
        </Link>

        {/* AVATAR */}
        <Link
          href="/dashboard/settings"
          className="
            w-9 h-9 rounded-full
            border border-slate-300 cursor-pointer
            bg-gradient-to-br from-indigo-200 to-indigo-300
            shadow-inner flex items-center justify-center
            font-semibold text-indigo-800
            hover:opacity-90 transition
          "
        >
          N
        </Link>
      </div>
    </header>
  );
}
