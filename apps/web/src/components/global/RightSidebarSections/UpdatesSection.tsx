"use client";

/**
 * UpdatesSection Component
 * ────────────────────────
 * Displays important campus updates and events
 * Part of default RightSidebar content
 */
export default function UpdatesSection() {
  // Update items - shows key announcements with bullet points
  const updateItems = [
    "Mid-semester exams start March 15",
    "Placement drive – TCS on campus",
    "NSS Blood Donation Camp – March 8",
  ];

  return (
    <section className="rounded-xl border border-border bg-white p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">
        Updates
      </h3>
      <ul className="space-y-3">
        {updateItems.map((item) => (
          <li key={item} className="flex items-start gap-2">
            {/* Bullet point indicator */}
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
            <p className="text-sm text-muted-foreground">{item}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
