"use client";

import { useAuth } from "@/context/AuthContext";

export default function UserMenu() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
          {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-medium leading-tight">
            {user.displayName}
          </p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-secondary/50 transition-colors"
      >
        Sign out
      </button>
    </div>
  );
}
