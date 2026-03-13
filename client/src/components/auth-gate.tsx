"use client";

import { useState, useEffect, useCallback } from "react";

const TOKEN_KEY = "dinner-table-token";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"loading" | "locked" | "unlocked">("loading");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  const verify = useCallback(async (token: string) => {
    try {
      const res = await fetch(`/api/auth?token=${encodeURIComponent(token)}`);
      if (res.ok) {
        setStatus("unlocked");
        return true;
      }
    } catch {}
    return false;
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      verify(token).then((valid) => {
        if (!valid) {
          localStorage.removeItem(TOKEN_KEY);
          setStatus("locked");
        }
      });
    } else {
      setStatus("locked");
    }
  }, [verify]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      if (res.ok) {
        const { token } = await res.json();
        localStorage.setItem(TOKEN_KEY, token);
        setStatus("unlocked");
      } else {
        setError("Wrong passcode");
        setPasscode("");
      }
    } catch {
      setError("Something went wrong");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50/40">
        <div className="text-amber-400 font-display text-lg animate-pulse">Loading...</div>
      </div>
    );
  }

  if (status === "unlocked") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50/40 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display text-amber-900 mb-2">Dinner Table</h1>
          <p className="text-sm text-amber-600/60">Enter the family passcode to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={8}
            value={passcode}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 8);
              setPasscode(val);
            }}
            placeholder="########"
            autoFocus
            className="w-full text-center text-2xl tracking-[0.4em] px-4 py-3 border border-amber-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 font-mono"
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-display rounded-xl transition-colors"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}
