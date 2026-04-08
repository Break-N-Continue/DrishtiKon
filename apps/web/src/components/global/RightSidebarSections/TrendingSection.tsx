"use client";

/**
 * TrendingSection Component
 * ──────────────────────────
 * Displays trending hashtags and topics on campus
 * Part of default RightSidebar content
 */
export default function TrendingSection() {
  // Trending hashtags - popular campus topics
  const trendingTags = [
    "#SpringFest2026",
    "#Placements",
    "#CampusLife",
    "#TechTalks",
    "#AIT",
    "#Hackathon",
  ];

  return (
    <section className="rounded-xl border border-border bg-white p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">
        Trending
      </h3>
      <div className="flex flex-wrap gap-2">
        {trendingTags.map((tag) => (
          <a
            key={tag}
            href="#"
            className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors"
          >
            {tag}
          </a>
        ))}
      </div>
    </section>
  );
}
