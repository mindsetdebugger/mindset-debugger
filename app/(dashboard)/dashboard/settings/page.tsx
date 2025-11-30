"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  /* ───────────────────────────────────────────────
     USER PROFILE
  ─────────────────────────────────────────────── */
  const [username, setUsername] = useState("Ivan");
  const [email, setEmail] = useState("ivan@example.com");

  /* ───────────────────────────────────────────────
     THEME
  ─────────────────────────────────────────────── */
  const { theme, setTheme } = useTheme();

  /* ───────────────────────────────────────────────
     LANGUAGE
  ─────────────────────────────────────────────── */
  const [language, setLanguage] = useState("en");

  /* ───────────────────────────────────────────────
     AVATAR UPLOAD
  ─────────────────────────────────────────────── */
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function uploadAvatar() {
    if (!avatarFile) return alert("No file selected");

    // SLANJE U SUPABASE (ako želiš, dodam backend)
    console.log("Uploading file:", avatarFile.name);
    alert("Avatar saved (placeholder)");
  }

  /* ───────────────────────────────────────────────
     NOTIFICATIONS
  ─────────────────────────────────────────────── */
  const [notifications, setNotifications] = useState({
    weeklyReport: true,
    aiSuggestions: true,
    productUpdates: false,
  });

  return (
    <div className="space-y-10 px-4 md:px-8">

      {/* HEADER */}
      <div>
        <h1 className="text-xl md:text-2xl font-semibold">Settings</h1>
        <p className="text-xs md:text-sm text-muted-foreground">
          Manage your account, preferences, and personalization.
        </p>
      </div>

      {/* PROFILE */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Profile</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* Avatar */}
          <div className="flex items-center gap-4">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="avatar"
                className="w-20 h-20 rounded-full object-cover border"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                No image
              </div>
            )}

            <div className="flex-1">
              <Label>Upload New</Label>
              <Input className="mt-1" type="file" accept="image/*" onChange={handleAvatarUpload} />
            </div>
          </div>

          <Button disabled={!avatarFile} onClick={uploadAvatar}>Save Avatar</Button>

          {/* Name */}
          <div>
            <Label>Name</Label>
            <Input className="mt-1" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          {/* Email */}
          <div>
            <Label>Email</Label>
            <Input className="mt-1" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <Button className="w-full md:w-auto">Save Profile</Button>
        </CardContent>
      </Card>

      {/* PASSWORD */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Change Password</CardTitle>
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

      {/* THEME */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Theme</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          <RadioGroup
            value={theme}
            onValueChange={(val) => setTheme(val)}
            className="space-y-2"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light">Light</Label>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">Dark</Label>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system">System</Label>
            </div>
          </RadioGroup>

          <Button className="w-full md:w-auto">Apply Theme</Button>
        </CardContent>
      </Card>

      {/* LANGUAGE */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Language</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label>Choose Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="mt-2 w-full md:w-60">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hr">Hrvatski</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full md:w-auto">Save Language</Button>
        </CardContent>
      </Card>

      {/* NOTIFICATIONS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Notifications</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Weekly Report</p>
              <p className="text-xs text-muted-foreground">AI summary every Sunday.</p>
            </div>
            <Switch
              checked={notifications.weeklyReport}
              onCheckedChange={(v) =>
                setNotifications((n) => ({ ...n, weeklyReport: v }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">AI Suggestions</p>
              <p className="text-xs text-muted-foreground">Smart insight tips.</p>
            </div>
            <Switch
              checked={notifications.aiSuggestions}
              onCheckedChange={(v) =>
                setNotifications((n) => ({ ...n, aiSuggestions: v }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Product Updates</p>
              <p className="text-xs text-muted-foreground">New features & changes.</p>
            </div>
            <Switch
              checked={notifications.productUpdates}
              onCheckedChange={(v) =>
                setNotifications((n) => ({ ...n, productUpdates: v }))
              }
            />
          </div>

          <Button className="w-full md:w-auto">Save Preferences</Button>
        </CardContent>
      </Card>

      {/* DANGER ZONE */}
      <Card className="border-red-300 dark:border-red-900">
        <CardHeader>
          <CardTitle className="text-base md:text-lg text-red-600">
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-4">
            Permanently delete your account and all data.
          </p>

          <Button variant="destructive" className="w-full md:w-auto">
            Delete Account
          </Button>
        </CardContent>
      </Card>

    </div>
  );
}
