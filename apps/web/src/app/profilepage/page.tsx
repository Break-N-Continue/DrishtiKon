"use client";

import { useState } from "react";
import { useProfile } from "@/hooks/profile/useProfile";
import { useUpdateProfile } from "@/hooks/profile/useUpdateProfile";
import { useProfileLayout } from "@/hooks/profile/useProfileLayout";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ActivityCard from "@/components/profile/ActivityCard";
import UserPosts from "@/components/profile/UserPosts";
import LoginButton from "@/components/auth/LoginButton";

export default function ProfilePage() {
  const { user, loading, userPosts } = useProfile();
  const { about, handleAboutChange } = useUpdateProfile();
  const [signInOpen, setSignInOpen] = useState(false);
  const {
    showAllPosts,
    showAllActivities,
    showUpdateRequest,
    handleShowAllPosts,
    handleShowAllActivities,
    handleToggleUpdateRequest,
  } = useProfileLayout();

  return (
    <div className="min-h-screen bg-surface">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-secondary font-medium">Loading...</p>
          </div>
        </div>
      )}

      {/* Authentication Guard */}
      {!loading && !user && (
        <div className="relative left-1/2 w-screen -translate-x-1/2 min-h-[calc(100dvh-73px)] flex items-center justify-center px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 bg-[radial-gradient(circle_at_18%_20%,rgba(112,32,31,0.07),transparent_44%),radial-gradient(circle_at_82%_78%,rgba(78,95,126,0.08),transparent_42%)]">
          <div className="w-full max-w-[22.5rem] sm:max-w-[30rem] md:max-w-xl rounded-xl sm:rounded-2xl border border-outline-variant/25 bg-white/95 px-4 sm:px-6 md:px-8 py-6 sm:py-7 md:py-9 text-center shadow-[0_18px_46px_-24px_rgba(25,28,29,0.35)] backdrop-blur-sm">
            <p className="mx-auto mb-3 sm:mb-4 inline-flex rounded-full border border-outline-variant/40 bg-surface-container-low px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-label uppercase tracking-[0.16em] sm:tracking-[0.18em] text-secondary">
              Profile Access
            </p>

            <div className="mx-auto mb-3 sm:mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-[30px] sm:text-[34px]">
                auto_stories
              </span>
            </div>

            <h3 className="text-[1.75rem] sm:text-3xl md:text-[2.05rem] leading-tight font-headline italic text-on-surface">
              Login Required
            </h3>
            <p className="mx-auto mt-2 sm:mt-2.5 max-w-[19rem] sm:max-w-md text-[0.95rem] sm:text-sm md:text-base text-on-surface-variant leading-relaxed">
              Enter the archive to manage your profile, posts, and scholarly
              activity.
            </p>

            <div className="mx-auto mt-5 sm:mt-6 w-full max-w-[220px] sm:max-w-[240px]">
              <button
                onClick={() => setSignInOpen(true)}
                className="w-full rounded-md bg-primary px-4 py-2.5 sm:py-3 text-sm font-label font-semibold tracking-wide text-on-primary transition hover:bg-primary-container hover:text-on-primary"
              >
                Sign In
              </button>
            </div>
          </div>

          <LoginButton
            open={signInOpen}
            onOpenChange={setSignInOpen}
            hideTrigger
          />
        </div>
      )}

      {/* Main Content - Only shown when authenticated */}
      {!loading && user && (
        <div className="w-full pt-4 pb-8 grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Main Profile Container - Never shrinks, panels show in RightSidebar */}
          <main className="col-span-1 md:col-span-12 transition-all duration-700 ease-in-out">
            <div className="px-3 md:px-8 py-6 md:py-8 w-full max-w-7xl mx-auto">
              <ProfileHeader
                name={
                  user.displayName ||
                  `${user.firstName} ${user.lastName}` ||
                  user.email.split("@")[0]
                }
                year="2026"
                about={about}
                onAboutChange={handleAboutChange}
                actionLabel={
                  showUpdateRequest ? "← Close Update Panel" : "Request Update"
                }
                onActionClick={handleToggleUpdateRequest}
              />

              <UserPosts
                onShowAllChange={(show) => handleShowAllPosts(show, userPosts)}
                isShowingAll={showAllPosts}
                posts={userPosts}
              />
              <ActivityCard
                onShowAllChange={handleShowAllActivities}
                isShowingAll={showAllActivities}
              />
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
