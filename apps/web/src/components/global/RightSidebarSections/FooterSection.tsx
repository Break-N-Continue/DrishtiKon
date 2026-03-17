"use client";

/**
 * FooterSection Component
 * ──────────────────────────
 * Displays footer links and copyright info
 * Part of default RightSidebar content
 */
export default function FooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="px-1 text-xs text-muted-foreground space-y-1">
      {/* Footer navigation links */}
      <div className="flex flex-wrap gap-x-2 gap-y-1">
        <a href="#" className="hover:underline">
          About
        </a>
        <a href="#" className="hover:underline">
          Terms
        </a>
        <a href="#" className="hover:underline">
          Privacy
        </a>
        <a href="#" className="hover:underline">
          Help
        </a>
      </div>
      {/* Copyright notice */}
      <p>&copy; {currentYear} DrishtiKon</p>
    </div>
  );
}
