"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  Sun,
  Moon,
  Monitor,
  Bell,
  Palette,
  Globe,
  User,
  Upload,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

/* Fade-in animation */
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function SettingsPage() {
  /* USER */
  const [username, setUsername] = useState("Ivan");
  const [email, setEmail] = useState("ivan@example.com");

  /* THEME */
  const { theme, setTheme } = useTheme();

  /* LANGUAGE */
  const [language, setLanguage] = useState("en");

  /* AVATAR */
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  /* NOTIFICATIONS */
  const [notifications, setNotifications] = useState({
    weeklyReport: true,
    aiTips: true,
    updates: false,
  });

  return (
    <motion.div
      className="space-y-12 px-4 md:px-10 py-12 relative"
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.05 }}
    >
      {/* Glow background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute w-[700px] h-[700px] bg-indigo-400/30 blur-[180px] -top-40 -left-40" />
        <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-[160px] bottom-0 right-0" />
      </div>

      {/* HEADER */}
      <motion.div variants={fadeIn}>
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <User className="text-indigo-600 h-7 w-7" />
          User Settings
        </h1>
        <p className="text-slate-600 max-w-xl">
          Customize your experience, appearance, notifications, and more.
        </p>
      </motion.div>

      {/* ---------------------------- PROFILE ---------------------------- */}
      <motion.div variants={fadeIn}>
        <Card className="rounded-2xl shadow-lg border backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="text-indigo-600" />
              Profile & Avatar
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className="relative">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    className="w-24 h-24 rounded-full object-cover border shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                    No image
                  </div>
                )}
              </div>

              <div className="flex-1">
                <Label className="text-sm">Upload Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="mt-2"
                />

                <Button
                  disabled={!avatarFile}
                  className="mt-2 flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Save Avatar
                </Button>
              </div>
            </div>

            {/* Name */}
            <div>
              <Label>Name</Label>
              <Input
                className="mt-1"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Email */}
            <div>
              <Label>Email</Label>
              <Input
                className="mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button className="w-full md:w-auto mt-2">Save Profile</Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* ---------------------------- PASSWORD ---------------------------- */}
      <motion.div variants={fadeIn}>
        <Card className="rounded-2xl shadow-lg border backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <LockIcon />
              Change Password
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <Label>New Password</Label>
              <Input type="password" className="mt-1" />
            </div>

            <div>
              <Label>Confirm Password</Label>
              <Input type="password" className="mt-1" />
            </div>

            <Button className="w-full md:w-auto">Update Password</Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* ---------------------------- THEME ---------------------------- */}
      <motion.div variants={fadeIn}>
        <Card className="rounded-2xl shadow-lg border backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Palette className="text-indigo-600" />
              Appearance (Theme)
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <RadioGroup
              value={theme}
              onValueChange={(t) => setTheme(t)}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {/* LIGHT */}
              <ThemeOption
                id="light"
                icon={<Sun className="h-5 w-5" />}
                label="Light"
                active={theme === "light"}
              />

              {/* DARK */}
              <ThemeOption
                id="dark"
                icon={<Moon className="h-5 w-5" />}
                label="Dark"
                active={theme === "dark"}
              />

              {/* SYSTEM */}
              <ThemeOption
                id="system"
                icon={<Monitor className="h-5 w-5" />}
                label="System"
                active={theme === "system"}
              />
            </RadioGroup>

            <Button className="w-full md:w-auto">Apply Theme</Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* ---------------------------- LANGUAGE ---------------------------- */}
      <motion.div variants={fadeIn}>
        <Card className="rounded-2xl shadow-lg border backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="text-indigo-600" />
              Language
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <Label>Select Language</Label>

            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full md:w-60">
                <SelectValue placeholder="Choose language" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hr">Hrvatski</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>

            <Button className="w-full md:w-auto">Save Language</Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* ---------------------------- NOTIFICATIONS ---------------------------- */}
      <motion.div variants={fadeIn}>
        <Card className="rounded-2xl shadow-lg border backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="text-indigo-600" />
              Notifications
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <NotificationToggle
              title="Weekly AI Report"
              desc="Summary every Sunday."
              value={notifications.weeklyReport}
              onChange={(v) =>
                setNotifications((s) => ({ ...s, weeklyReport: v }))
              }
            />

            <NotificationToggle
              title="AI Insight Suggestions"
              desc="Smart improvement tips."
              value={notifications.aiTips}
              onChange={(v) =>
                setNotifications((s) => ({ ...s, aiTips: v }))
              }
            />

            <NotificationToggle
              title="Product Updates"
              desc="Feature releases & announcements."
              value={notifications.updates}
              onChange={(v) =>
                setNotifications((s) => ({ ...s, updates: v }))
              }
            />

            <Button className="w-full md:w-auto">Save Preferences</Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* ---------------------------- DANGER ZONE ---------------------------- */}
      <motion.div variants={fadeIn}>
        <Card className="rounded-2xl border-red-300 shadow-lg bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 text-lg">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-red-600 mb-4">
              Deleting your account will permanently remove all your data.
            </p>
            <Button variant="destructive" className="w-full md:w-auto">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

/* ---------------------------------------------------------------------- */
/* Sub-components                                                         */
/* ---------------------------------------------------------------------- */

function LockIcon() {
  return (
    <svg
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="text-indigo-600"
    >
      <path d="M6 8V5a3 3 0 0 1 6 0v3" />
      <rect x="4" y="8" width="12" height="10" rx="2" />
    </svg>
  );
}

function ThemeOption({
  id,
  icon,
  label,
  active,
}: {
  id: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <Label
      htmlFor={id}
      className={`
        cursor-pointer rounded-xl p-4 border flex flex-col items-center gap-2
        transition shadow-sm hover:shadow-md
        ${active ? "bg-indigo-100 border-indigo-500" : "border-slate-300"}
      `}
    >
      <RadioGroupItem value={id} id={id} />
      {icon}
      <span>{label}</span>
    </Label>
  );
}

function NotificationToggle({
  title,
  desc,
  value,
  onChange,
}: {
  title: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}
