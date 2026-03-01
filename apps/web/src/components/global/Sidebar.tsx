"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LoginButton from "@/components/auth/LoginButton";

// ─── Navigation items ───────────────────────────────────────────────
interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z"
        />
      </svg>
    ),
  },
  {
    label: "User Profile",
    href: "/profilpage",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
];

// ─── Sidebar component ──────────────────────────────────────────────
interface SidebarProps {
  /** When the parent panel is narrow enough, collapse to icon-only mode */
  collapsed?: boolean;
  /** Function to toggle sidebar collapse state */
  onToggleCollapse?: () => void;
}

export default function Sidebar({ collapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className={`sidebar-shell ${collapsed ? "sidebar-shell-collapsed" : "sidebar-shell-expanded"}`}>
      <div className="sidebar-panel">
      {/* Toggle button at top */}
      <div className={`sidebar-header flex items-center ${collapsed ? 'justify-center py-3 px-1' : 'justify-between py-3 px-4'}`}>
        {!collapsed && (
          <p className="sidebar-heading">MENU</p>
        )}
        <button
          onClick={onToggleCollapse}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="sidebar-toggle"
        >
          {collapsed ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Navigation links */}
      <nav className={`sidebar-nav ${collapsed ? 'px-1' : 'px-3'}`}>
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item ${collapsed ? 'sidebar-item-collapsed' : 'sidebar-item-expanded'} ${
                active
                  ? collapsed 
                    ? "sidebar-item-active-collapsed"
                    : "sidebar-item-active-expanded"
                  : !collapsed
                    ? "hover:shadow-sm"
                    : ""
              }`}
              title={collapsed ? item.label : undefined}
            >
              <span className={collapsed ? "scale-110" : ""}>{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Auth section at bottom */}
      <div className={`sidebar-footer ${collapsed ? 'p-2' : 'p-3'}`}>
        {user ? (
          <div className={`flex items-center gap-3 ${collapsed ? "flex-col justify-center" : "justify-start"}`}>
            {/* Avatar - only visible when expanded */}
            {!collapsed && (
              <div className="sidebar-avatar">
                {String(user.displayName).charAt(0).toUpperCase()}
              </div>
            )}
            {/* Display name - only visible when expanded */}
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate text-slate-900">
                  {user.displayName}
                </p>
              </div>
            )}
            {/* Sign out button */}
            <button
              onClick={logout}
              title="Sign Out"
              className="sidebar-ghost-action"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
              </svg>
            </button>
          </div>
        ) : (
          <div className={collapsed ? "flex justify-center" : ""}>
            <div className={collapsed ? "" : "sidebar-auth-chip"}>
              <LoginButton compact={collapsed} />
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
