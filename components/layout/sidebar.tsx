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
        w-64 h-screen
        border-r border-slate-200
        bg-white/80 backdrop-blur-xl
        flex flex-col
      "
    >

      {/* PERFECTLY ALIGNED HEADER */}
      <div className="h-14 flex items-center gap-2 px-6 border-b border-slate-200">
        <Infinity className="w-5 h-5 text-indigo-600" />
        <span className="text-base font-semibold tracking-tight text-slate-800">
          MindsetDebugger
        </span>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menu.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onClose?.()}
              className={`
                relative flex items-center gap-3 px-3 py-2 rounded-lg 
                text-sm transition-colors duration-150
                ${
                  active
                    ? "bg-indigo-50 text-indigo-700 font-medium"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }
              `}
            >
              {/* ACTIVE INDICATOR */}
              {active && (
                <motion.div
                  layoutId="activeRoute"
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-r bg-indigo-600"
                />
              )}

              <item.icon
                size={18}
                className={`${active ? "text-indigo-700" : "text-slate-500"}`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="px-4 py-4 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="
            flex items-center gap-3 px-3 py-2 w-full text-left
            rounded-lg hover:bg-red-50 hover:text-red-600
            text-slate-600 transition
          "
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
