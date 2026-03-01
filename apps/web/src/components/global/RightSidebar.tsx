"use client";

/**
 * RightSidebar – desktop-only panel (third column).
 *
 * Width & visibility are controlled by the parent flex container
 * in AuthLayoutWrapper. This component simply renders its content
 * and scrolls independently.
 */
export default function RightSidebar() {
  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="space-y-6 p-4 pb-8">
        {/* ── Campus News ────────────────────────── */}
        <section className="rounded-xl border border-border bg-white p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Campus News
          </h3>
          <ul className="space-y-3">
            {[
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
            ].map((item) => (
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

        {/* ── Updates ────────────────────────────── */}
        <section className="rounded-xl border border-border bg-white p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Updates
          </h3>
          <ul className="space-y-3">
            {[
              "Mid-semester exams start March 15",
              "Placement drive – TCS on campus",
              "NSS Blood Donation Camp – March 8",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <p className="text-sm text-muted-foreground">{item}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Trending ───────────────────────────── */}
        <section className="rounded-xl border border-border bg-white p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Trending
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              "#SpringFest2026",
              "#Placements",
              "#CampusLife",
              "#TechTalks",
              "#AIT",
              "#Hackathon",
            ].map((tag) => (
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

        {/* ── Footer links ───────────────────────── */}
        <div className="px-1 text-xs text-muted-foreground space-y-1">
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
          <p>&copy; {new Date().getFullYear()} DrishtiKon</p>
        </div>
      </div>
    </div>
  );
}
