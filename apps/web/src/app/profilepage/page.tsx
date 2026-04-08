'use client';

import { useProfile } from "@/hooks/profile/useProfile";
import { useUpdateProfile } from "@/hooks/profile/useUpdateProfile";
import { useProfileLayout } from "@/hooks/profile/useProfileLayout";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ActivityCard from "@/components/profile/ActivityCard";
import UserPosts from "@/components/profile/UserPosts";

export default function ProfilePage() {
  const { user, loading, userPosts } = useProfile();
  const { about, handleAboutChange } = useUpdateProfile();
  const {
    showAllPosts,
    showAllActivities,
    showUpdateRequest,
    handleShowAllPosts,
    handleShowAllActivities,
    handleToggleUpdateRequest
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

      {/* Authentication Guard - Blurred Content */}
      {!loading && !user && (
        <div className="relative min-h-[calc(100vh-73px)]">
          {/* Blurred Background Content */}
          <div className="blur-sm pointer-events-none">
            <div className="w-full px-4 md:px-8 lg:px-12 py-8 grid grid-cols-1 md:grid-cols-12 gap-8">
              <main className="col-span-1 md:col-span-12">
                <div className="px-8 py-10 w-full">
                  <div className="space-y-8 max-w-5xl">
                    <div className="h-32 bg-surface-container-high rounded-2xl"></div>
                    <div className="h-48 bg-surface-container-highest rounded-2xl"></div>
                    <div className="h-48 bg-surface-container-low rounded-2xl"></div>
                  </div>
                </div>
              </main>
            </div>
          </div>

          {/* Login Required Message Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-surface-container-low rounded-3xl shadow-2xl p-12 max-w-md mx-4 text-center border-2 border-outline-variant/20">
              <div className="mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-headline font-bold mb-2 text-on-surface">
                  Login Required
                </h2>
                <p className="text-secondary text-lg mb-2">
                  Please sign in to view your profile
                </p>
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-secondary/60">
                  <span>Click <strong className="text-primary tracking-wide">"Sign In"</strong> on the left sidebar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Only shown when authenticated */}
      {!loading && user && (
        <div className="w-full pt-4 pb-8 grid grid-cols-1 md:grid-cols-12 gap-5">

        {/* Main Profile Container - Never shrinks, panels show in RightSidebar */}
        <main className="col-span-1 md:col-span-12 transition-all duration-700 ease-in-out">
          <div className="px-6 md:px-8 py-6 md:py-8 w-full max-w-7xl mx-auto">
            <ProfileHeader 
              name={user.displayName || `${user.firstName} ${user.lastName}` || user.email.split('@')[0]} 
              year="2026" 
              about={about}
              onAboutChange={handleAboutChange}
              actionLabel={showUpdateRequest ? '← Close Update Panel' : 'Request Update'}
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