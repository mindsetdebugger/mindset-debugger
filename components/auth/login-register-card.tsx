"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Mode = "login" | "register";

export default function LoginRegisterCard() {
  const router = useRouter();
  const supabase = supabaseBrowser();

  const [mode, setMode] = useState<Mode>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit() {
    setErrorMsg("");

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }
    }

    router.push("/dashboard");
  }

  return (
    <Card className="w-full max-w-md shadow-xl border border-indigo-100 bg-white/90 backdrop-blur">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          Mindset Debugger
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          {mode === "login"
            ? "Sign in to access your dashboard."
            : "Create an account to start debugging your mindset."}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex gap-2 mb-2">
          <Button
            variant={mode === "login" ? "default" : "outline"}
            className="w-1/2"
            onClick={() => setMode("login")}
          >
            Login
          </Button>
          <Button
            variant={mode === "register" ? "default" : "outline"}
            className="w-1/2"
            onClick={() => setMode("register")}
          >
            Register
          </Button>
        </div>

        <Input
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          autoComplete={
            mode === "login" ? "current-password" : "new-password"
          }
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMsg && (
          <p className="text-xs text-red-500">{errorMsg}</p>
        )}

        <Button className="w-full mt-2" onClick={handleSubmit}>
          {mode === "login" ? "Sign In" : "Create Account"}
        </Button>
      </CardContent>
    </Card>
  );
}
