"use client";

import LoginRegisterCard from "@/components/auth/login-register-card";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <LoginRegisterCard />
    </div>
  );
}
