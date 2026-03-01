"use client";

import { useRightSidebar } from "@/context/RightSidebarContext";
import { usePathname } from "next/navigation";
import {
  PostsPanel,
  ActivitiesPanel,
  UpdateProfilePanel,
  CampusNews,
  UpdatesSection,
  TrendingSection,
  FooterSection,
} from "./RightSidebarSections";

/**
 * RightSidebar Component
 * ──────────────────────
 * Desktop-only third column panel (visible on xl+ screens)
 * Orchestrates different sidebar sections based on context & route:
 * - On profile page: Shows only when posts/activities/update form active, hides when all inactive
 * - On other pages: Always shows default content (news, updates, trending)
 *
 * Width & visibility controlled by AuthLayoutWrapper flex container
 */
export default function RightSidebar() {
  const { posts, activities, updateProfile } = useRightSidebar();
  const pathname = usePathname();

  // Check if we're on the profile page
  const isProfilePage = pathname?.includes("/profilepage");

  // Check if any section is active on profile page
  const hasActiveSections =
    (posts && posts.length > 0) ||
    (activities && activities.length > 0) ||
    updateProfile !== null;

  // ─ Hide sidebar on profile page when no sections are active
  if (isProfilePage && !hasActiveSections) {
    return null;
  }

  // ─ Posts mode: Display user's posts ONLY on profile page when shared via context
  if (isProfilePage && posts && posts.length > 0) {
    return <PostsPanel posts={posts} />;
  }

  // ─ Activities mode: Display user's activities ONLY on profile page when shared via context
  if (isProfilePage && activities && activities.length > 0) {
    return <ActivitiesPanel activities={activities} />;
  }

  // ─ Update Profile mode: Display update form ONLY on profile page when shared via context
  if (isProfilePage && updateProfile) {
    return (
      <UpdateProfilePanel
        currentName={updateProfile.currentName}
        currentYear={updateProfile.currentYear}
      />
    );
  }

  // ─ Default mode: Show campus news, updates, and trending content (always on non-profile pages)
  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="space-y-6 p-4 pb-8">
        {/* Campus News Section */}
        <CampusNews />

        {/* Updates Section */}
        <UpdatesSection />

        {/* Trending Section */}
        <TrendingSection />

        {/* Footer Section */}
        <FooterSection />
      </div>
    </div>
  );
}
