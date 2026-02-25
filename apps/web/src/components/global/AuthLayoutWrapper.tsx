"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/global/Sidebar";
import RightSidebar from "@/components/global/RightSidebar";
import BottomNavigation from "@/components/global/BottomNavigation";
import ResizeHandle from "@/components/global/ResizeHandle";

// ─── Persistence helpers ────────────────────────────────────────────
const LS_LEFT = "panel-left-width";
const LS_RIGHT = "panel-right-width";

const DEFAULT_LEFT = 256; // px  (w-64)
const MIN_LEFT = 64;
const MAX_LEFT = 400;

const DEFAULT_RIGHT = 320; // px  (w-80)
const MIN_RIGHT = 240;
const MAX_RIGHT = 640;

function readStored(key: string, fallback: number) {
  if (typeof window === "undefined") return fallback;
  const v = localStorage.getItem(key);
  return v ? Number(v) : fallback;
}

interface AuthLayoutWrapperProps {
  children: ReactNode;
}

/**
 * AuthLayoutWrapper
 * -----------------
 * Discord-style three-column layout with draggable resize handles.
 *
 * ┌──────────┬──┬─────────────────────┬──┬──────────┐
 * │  Left    │▐ │   Middle Feed       │▐ │  Right   │
 * │ Sidebar  │▐ │   (children)        │▐ │  Panel   │
 * │ resizable│▐ │   fluid / scroll    │▐ │ resizable│
 * └──────────┴──┴─────────────────────┴──┴──────────┘
 *
 * • Mobile  (<md) : Full-width feed + bottom navigation
 * • Tablet  (md)  : Left sidebar + feed (right panel hidden)
 * • Desktop (xl+) : All three panels, all draggable
 */
export default function AuthLayoutWrapper({
  children,
}: AuthLayoutWrapperProps) {
  const { loading } = useAuth();
  const pathname = usePathname();

  // Public routes bypass layout chrome
  const isPublicRoute = pathname?.startsWith("/auth/sign");
  if (isPublicRoute) return <>{children}</>;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <LayoutShell>{children}</LayoutShell>;
}

// ─── Inner shell (client state for widths) ──────────────────────────
function LayoutShell({ children }: { children: ReactNode }) {
  const [leftWidth, setLeftWidth] = useState(DEFAULT_LEFT);
  const [rightWidth, setRightWidth] = useState(DEFAULT_RIGHT);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate stored widths after mount (avoids SSR mismatch)
  useEffect(() => {
    setLeftWidth(readStored(LS_LEFT, DEFAULT_LEFT));
    setRightWidth(readStored(LS_RIGHT, DEFAULT_RIGHT));
    setHydrated(true);
  }, []);

  // ── Left handle drag ──────────────────────────────────────────────
  const handleLeftResize = useCallback((delta: number) => {
    setLeftWidth((w) => {
      const next = Math.min(MAX_LEFT, Math.max(MIN_LEFT, w + delta));
      return next;
    });
  }, []);

  const handleLeftResizeEnd = useCallback(() => {
    setLeftWidth((w) => {
      localStorage.setItem(LS_LEFT, String(w));
      return w;
    });
  }, []);

  // ── Right handle drag (dragging left = wider, right = narrower) ───
  const handleRightResize = useCallback((delta: number) => {
    setRightWidth((w) => {
      const next = Math.min(MAX_RIGHT, Math.max(MIN_RIGHT, w - delta));
      return next;
    });
  }, []);

  const handleRightResizeEnd = useCallback(() => {
    setRightWidth((w) => {
      localStorage.setItem(LS_RIGHT, String(w));
      return w;
    });
  }, []);

  return (
    <>
      {/*
        ── Desktop: full-height flex row ─────────────────────────────
        Each panel scrolls independently (overflow-y-auto).
        On < md the sidebar/right panel are hidden via CSS and we
        fall back to the mobile layout (bottom nav + single column).
      */}
      <div className="flex h-screen overflow-hidden bg-background">
        {/* ── Left Sidebar ──────────────────────────────────────── */}
        <div
          className="hidden md:flex flex-col shrink-0 border-r border-border overflow-hidden"
          style={hydrated ? { width: leftWidth } : { width: DEFAULT_LEFT }}
        >
          <Sidebar collapsed={leftWidth <= 80} />
        </div>

        {/* Left resize handle */}
        <ResizeHandle
          onResize={handleLeftResize}
          onResizeEnd={handleLeftResizeEnd}
          side="right"
        />

        {/* ── Middle Feed (fluid) ───────────────────────────────── */}
        <main className="flex-1 min-w-0 overflow-y-auto pb-20 md:pb-0">
          <div className="max-w-4xl mx-auto px-4 py-6">{children}</div>
        </main>

        {/* Right resize handle (only visible when right panel is) */}
        <div className="hidden xl:flex">
          <ResizeHandle
            onResize={handleRightResize}
            onResizeEnd={handleRightResizeEnd}
            side="left"
          />
        </div>

        {/* ── Right Panel ───────────────────────────────────────── */}
        <div
          className="hidden xl:flex flex-col shrink-0 border-l border-border overflow-hidden"
          style={hydrated ? { width: rightWidth } : { width: DEFAULT_RIGHT }}
        >
          <RightSidebar />
        </div>
      </div>

      {/* ── Mobile bottom navigation ────────────────────────────── */}
      <BottomNavigation />
    </>
  );
}
