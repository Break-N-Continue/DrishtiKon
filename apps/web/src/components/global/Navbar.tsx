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
    <nav className="bg-surface border-b border-outline-variant px-4 py-3 sticky top-0 z-50 flex items-center">
      <div className="flex w-full items-center gap-4">
        <div className="flex shrink-0 items-center gap-3">
          <div className="bg-primary-container text-on-primary-container p-2 rounded-xl">
            <UsersIcon className="h-5 w-5" />
          </div>
          <span className="text-primary tracking-tight text-lg font-extrabold md:text-xl">
            DrishtiKon
          </span>
        </div>

        <div className="hidden flex-1 px-2 md:flex md:justify-center">
          <div className="flex items-center w-full max-w-md bg-surface-container-low rounded-full px-4 py-2 border border-outline-variant focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <SearchIcon className="text-on-surface-variant h-4 w-4" />
            <input
              type="text"
              placeholder="Search posts... (e.g., 'AI in education')"
              className="bg-transparent text-on-surface placeholder:text-on-surface-variant/70 outline-none w-full ml-3 border-none focus:ring-0 text-sm"
            />
          </div>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 md:gap-3">
          <button
            type="button"
            className="bg-primary text-on-primary hover:bg-primary/90 px-4 py-2 rounded-full font-medium transition-colors shadow-sm flex items-center gap-2 text-sm"
          >
            <IdeaIcon className="h-4 w-4" />
            Suggest Feature
          </button>
          <button
            type="button"
            className="bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80 px-4 py-2 rounded-full font-medium transition-colors flex items-center gap-2 text-sm"
          >
            <BugIcon className="h-4 w-4" />
            Report Bug
          </button>
        </div>
      </div>
    </nav>
  );
}