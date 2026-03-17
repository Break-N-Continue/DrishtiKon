"use client";

/**
 * CampusNews Component
 * ────────────────────
 * Displays latest campus news and announcements
 * Part of default RightSidebar content
 */
export default function CampusNews() {
  // Campus news items - shows latest announcements
  const newsItems = [
    {
      title: "Spring Fest 2026 registrations open",
      time: "2h ago",
    },
    {
      title: "New library timings effective March 1",
      time: "5h ago",
    },
    {
      title: "Guest lecture on AI & Ethics – March 4",
      time: "1d ago",
    },
  ];

  return (
    <section className="rounded-xl border border-border bg-white p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">
        Campus News
      </h3>
      <ul className="space-y-3">
        {newsItems.map((item) => (
          <li key={item.title}>
            <a href="#" className="block group">
              <p className="text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {item.title}
              </p>
              <span className="text-xs text-muted-foreground">
                {item.time}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
