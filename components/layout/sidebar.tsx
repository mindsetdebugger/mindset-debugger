"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

import {
  Home,
  Search,
  BookText,
  LineChart,
  Target,
  Settings,
  LogOut,
  Infinity,
  NotebookTabs,
  Compass,
  UserStar,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = supabaseBrowser();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/auth");
  }

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
    <aside
      className="
        h-full w-full
        flex flex-col
        bg-white/90 backdrop-blur-xl
      "
    >
      {/* TOP LOGO */}
      <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-200/70">
        <Infinity className="w-6 h-6 text-indigo-600" />
        <span className="text-lg font-semibold tracking-tight text-slate-800">
          MindsetDebugger
        </span>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 flex flex-col px-3 py-6 gap-1">
        {menu.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onClose?.()}
              className={`
                relative flex items-center gap-3 px-3 py-2 rounded-xl
                text-sm transition-all duration-200
                ${
                  active
                    ? "text-indigo-700 font-medium"
                    : "text-slate-600 hover:text-slate-900"
                }
              `}
            >
              {/* ACTIVE BG HIGHLIGHT */}
              {active && (
                <motion.div
                  layoutId="sidebarActive"
                  className="
                    absolute inset-0 rounded-xl 
                    bg-indigo-50/70 
                    border border-indigo-100
                    shadow-sm
                  "
                />
              )}

              <item.icon
                size={18}
                className={`z-[1] ${
                  active ? "text-indigo-700" : "text-slate-500"
                }`}
              />

              <span className="z-[1]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT BUTTON */}
      <div className="px-3 py-6 border-t border-slate-200/70">
        <button
          onClick={handleLogout}
          className="
            w-full flex items-center gap-3 px-3 py-2 
            rounded-xl text-sm text-slate-600
            hover:text-red-600 hover:bg-red-50 
            transition-all
          "
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
