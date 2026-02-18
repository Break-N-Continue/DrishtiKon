"use client";

import { useAuth } from "@/context/AuthContext";
import LoginButton from "@/components/auth/LoginButton";
import UserMenu from "@/components/auth/UserMenu";

export default function AuthHeader() {
  const { user, loading } = useAuth();

  return (
    <header className="border-b border-border bg-white">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary">DrishtiKon</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:inline">
            College Community Platform
          </span>
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-secondary animate-pulse" />
          ) : user ? (
            <UserMenu />
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </header>
  );
}
