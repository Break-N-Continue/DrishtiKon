"use client";

import { useAuth } from "@/context/AuthContext";

export default function LoginButton() {
  const { login } = useAuth();

  return (
    <button
      onClick={login}
      className="inline-flex items-center gap-2 px-4 py-2 bg-[#2f2f2f] hover:bg-[#1a1a1a] text-white text-sm font-medium rounded-md transition-colors"
    >
      <svg className="w-4 h-4" viewBox="0 0 21 21" fill="none">
        <rect x="1" y="1" width="9" height="9" fill="#f25022" />
        <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
        <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
        <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
      </svg>
      Sign in with Microsoft
    </button>
  );
}
