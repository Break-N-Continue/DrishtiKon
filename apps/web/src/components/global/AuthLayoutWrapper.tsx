"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { useRightSidebar } from "@/context/RightSidebarContext";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/global/Sidebar";
import RightSidebar from "@/components/global/RightSidebar";
import BottomNavigation from "@/components/global/BottomNavigation";
import ResizeHandle from "@/components/global/ResizeHandle";
import Navbar from "@/components/global/Navbar";

// ─── Persistence helpers ────────────────────────────────────────────
const LS_LEFT = "panel-left-width";
const LS_RIGHT = "panel-right-width";

const DEFAULT_LEFT = 256; // px  (w-64)
const MIN_LEFT = 80; // px - minimum width for icon-only mode
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
  const { posts, activities, updateProfile } = useRightSidebar();
  const pathname = usePathname();
  const [leftWidth, setLeftWidth] = useState(DEFAULT_LEFT);
  const [rightWidth, setRightWidth] = useState(DEFAULT_RIGHT);
  const [expandedLeftWidth, setExpandedLeftWidth] = useState(DEFAULT_LEFT);
  const [hydrated, setHydrated] = useState(false);

  // Check if we're on the profile page
  const isProfilePage = pathname?.includes("/profilepage");

  // Check if any section is active on profile page
  const hasActiveSections =
    (posts && posts.length > 0) ||
    (activities && activities.length > 0) ||
    updateProfile !== null;

  // Determine the right sidebar width - 0 if on profile page with no active sections, otherwise use default
  const effectiveRightWidth = isProfilePage && !hasActiveSections ? 0 : rightWidth;

  // Hydrate stored widths after mount (avoids SSR mismatch)
  useEffect(() => {
    const storedWidth = readStored(LS_LEFT, DEFAULT_LEFT);
    setLeftWidth(storedWidth);
    setExpandedLeftWidth(storedWidth > MIN_LEFT ? storedWidth : DEFAULT_LEFT);
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
      // Track expanded width when user manually resizes beyond minimum
      if (w > MIN_LEFT) {
        setExpandedLeftWidth(w);
      }
      return w;
    });
  }, []);

  // ── Toggle sidebar collapse/expand ────────────────────────────────
  const toggleLeftSidebar = useCallback(() => {
    setLeftWidth((current) => {
      const newWidth = current <= MIN_LEFT ? expandedLeftWidth : MIN_LEFT;
      localStorage.setItem(LS_LEFT, String(newWidth));
      return newWidth;
    });
  }, [expandedLeftWidth]);

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
      <div className="flex h-screen flex-col overflow-hidden bg-background">
        <Navbar />

        {/*
          ── Desktop: full-height flex row under navbar ──────────────
          Each panel scrolls independently (overflow-y-auto).
          On < md the sidebar/right panel are hidden via CSS and we
          fall back to the mobile layout (bottom nav + single column).
        */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* ── Left Sidebar ──────────────────────────────────────── */}
          <div
            className="hidden md:flex flex-col shrink-0 border-r border-border overflow-hidden"
            style={hydrated ? { width: leftWidth } : { width: DEFAULT_LEFT }}
          >
            <Sidebar collapsed={leftWidth <= 80} onToggleCollapse={toggleLeftSidebar} />
          </div>

          {/* Left resize handle */}
          <ResizeHandle
            onResize={handleLeftResize}
            onResizeEnd={handleLeftResizeEnd}
            side="right"
          />

          {/* ── Middle Feed (fluid) ───────────────────────────────── */}
          <main className="flex-1 min-w-0 overflow-y-auto pb-20 md:pb-0">
            <div
              className={
                isProfilePage
                  ? "w-full px-[70px] py-6"
                  : "max-w-4xl mx-auto px-4 py-6"
              }
            >
              {children}
            </div>
          </main>

          {/* Right resize handle (only visible when right panel is visible and has width) */}
          <div className="hidden xl:flex">
            {effectiveRightWidth > 0 && (
              <ResizeHandle
                onResize={handleRightResize}
                onResizeEnd={handleRightResizeEnd}
                side="left"
              />
            )}
          </div>

          {/* ── Right Panel (shrinks to 0 on profile when no sections active) ───── */}
          <div
            className="hidden xl:flex flex-col shrink-0 border-l border-border overflow-hidden transition-all duration-500 ease-in-out"
            style={hydrated ? { width: effectiveRightWidth } : { width: DEFAULT_RIGHT }}
          >
            <RightSidebar />
          </div>
        </div>
      </div>

      {/* ── Mobile bottom navigation ────────────────────────────── */}
      <BottomNavigation />
    </>
  );
}
