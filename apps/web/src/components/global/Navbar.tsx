"use client";

import type { SVGProps } from "react";

// Brand badge icon representing community/users
function UsersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 20h5v-1a4 4 0 00-4-4h-1m-4 5H2v-1a4 4 0 014-4h3m5-6a4 4 0 11-8 0 4 4 0 018 0zm7 3a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

// Search bar icon for post discovery
function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
      <circle cx="11" cy="11" r="6" />
    </svg>
  );
}

// Feature suggestion button icon
function IdeaIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 18h6m-5 3h4m-7.5-7.5A6.5 6.5 0 1117.5 13.5c-.7.7-1.35 1.6-1.5 2.5h-8c-.15-.9-.8-1.8-1.5-2.5z"
      />
    </svg>
  );
}

// Bug report button icon
function BugIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6M8 13h8M10 5h4" />
      <rect x="7" y="7" width="10" height="12" rx="5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h3m12 0h3M4 15h3m10 0h3" />
    </svg>
  );
}

// Main navigation bar with branding, search, and action buttons
export default function Navbar() {
  return (
    <nav className="navbar-shell">
      <div className="flex w-full items-center gap-4">
        <div className="flex shrink-0 items-center gap-3">
          <div className="navbar-brand-badge">
            <UsersIcon className="h-5 w-5" />
          </div>
          <span className="navbar-brand-text text-lg font-extrabold md:text-xl">
            DrishtiKon
          </span>
        </div>

        <div className="hidden flex-1 px-2 md:flex md:justify-center">
          <div className="navbar-search">
            <SearchIcon className="navbar-search-icon h-4 w-4" />
            <input
              type="text"
              placeholder="Search posts... (e.g., 'AI in education')"
              className="navbar-search-input ml-3 w-full border-none bg-transparent text-sm focus:ring-0"
            />
          </div>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 md:gap-3">
          <button
            type="button"
            className="navbar-action-primary"
          >
            <IdeaIcon className="h-4 w-4" />
            Suggest Feature
          </button>
          <button
            type="button"
            className="navbar-action-secondary"
          >
            <BugIcon className="h-4 w-4" />
            Report Bug
          </button>
        </div>
      </div>
    </nav>
  );
}