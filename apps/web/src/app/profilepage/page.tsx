'use client';

import { useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";
import { getPosts, updateUserAbout, type Post } from "@/lib/api";
// import LeftSidebar from "@/components/LeftSidebar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ActivityCard from "@/components/profile/ActivityCard";
import UserPosts from "@/components/profile/UserPosts";
import AllPostsPanel from "@/components/profile/AllPostsPanel";
import AllActivitiesPanel from "@/components/profile/AllActivitiesPanel";
import UpdateRequestPanel from "@/components/profile/UpdateRequestPanel";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [showUpdateRequest, setShowUpdateRequest] = useState(false);
  const [userPosts, setUserPosts] = useState<Array<{id: number; title: string; description: string; tags?: string[]; date: string}>>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [about, setAbout] = useState("Computer Science Student - VANET Enthusiast");
  const [isSavingAbout, setIsSavingAbout] = useState(false);

  const handleAboutChange = async (newAbout: string) => {
    if (!user) return;
    
    try {
      setIsSavingAbout(true);
      await updateUserAbout(user.id, newAbout);
      setAbout(newAbout);
      console.log('About saved successfully:', newAbout);
    } catch (error) {
      console.error('Failed to save about:', error);
      // Optionally show error message to user
    } finally {
      setIsSavingAbout(false);
    }
  };

  // Fetch posts from backend when user is loaded
  useEffect(() => {
    if (!user) {
      setPostsLoading(false);
      return;
    }

    const fetchUserPosts = async () => {
      try {
        setPostsLoading(true);
        const allPosts = await getPosts();
        // Filter posts to show only those by the current user
        const filtered = allPosts
          .filter(post => post.authorId === user.id)
          .map(post => ({
            id: post.id,
            title: post.title,
            description: post.description,
            date: new Date(post.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            }),
            tags: [] // Tags can be added later if the API supports them
          }));
        setUserPosts(filtered);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setPostsLoading(false);
      }
    };

    fetchUserPosts();
  }, [user]);

  const handleShowAllPosts = (show: boolean) => {
    setShowAllPosts(show);
    if (show) {
      setShowAllActivities(false);
      setShowUpdateRequest(false);
    }
  };

  const handleShowAllActivities = (show: boolean) => {
    setShowAllActivities(show);
    if (show) {
      setShowAllPosts(false);
      setShowUpdateRequest(false);
    }
  };

  const handleToggleUpdateRequest = () => {
    setShowUpdateRequest(!showUpdateRequest);
    if (!showUpdateRequest) {
      setShowAllPosts(false);
      setShowAllActivities(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading...</p>
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
                <div className="bg-gradient-to-br from-white via-indigo-50 to-white rounded-3xl p-10 shadow-lg border border-cyan-200 backdrop-blur-sm">
                  <div className="mb-10 pb-8 border-b-2 border-gradient-to-r from-indigo-200 to-cyan-200">
                    <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">Your Profile</h1>
                    <p className="text-slate-600 text-sm font-medium">Manage your campus presence</p>
                  </div>
                  <div className="space-y-8">
                    <div className="h-32 bg-indigo-100 rounded-2xl"></div>
                    <div className="h-48 bg-cyan-100 rounded-2xl"></div>
                    <div className="h-48 bg-indigo-100 rounded-2xl"></div>
                  </div>
                </div>
              </main>
            </div>
          </div>

          {/* Login Required Message Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md mx-4 text-center border-2 border-indigo-200">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  Login Required
                </h2>
                <p className="text-slate-600 text-lg mb-2">
                  Please sign in to view your profile
                </p>
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  <span>Click <strong className="text-indigo-600">"Sign In"</strong> in the top navigation bar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Only shown when authenticated */}
      {!loading && user && (
        <div className="w-full px-4 md:px-8 lg:px-12 py-8 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Sidebar */}
        {/* <LeftSidebar /> */}

        {/* Main Profile Container - Responsive width */}
        <main className={`col-span-1 transition-all duration-700 ease-in-out ${
          (showAllPosts || showAllActivities || showUpdateRequest) ? 'md:col-span-6' : 'md:col-span-12'
        }`}>
          <div className="bg-gradient-to-br from-white via-indigo-50 to-white rounded-3xl p-10 shadow-lg border border-cyan-200 backdrop-blur-sm">
            <div className="mb-10 pb-8 border-b-2 border-gradient-to-r from-indigo-200 to-cyan-200 flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                  {user.displayName || user.firstName}'s Profile
                </h1>
                <p className="text-slate-600 text-sm font-medium">Manage your campus presence</p>
              </div>
              <button 
                onClick={handleToggleUpdateRequest}
                className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 hover:from-indigo-700 hover:to-cyan-700 whitespace-nowrap"
              >
                {showUpdateRequest ? '← Close' : 'request update'}
              </button>
            </div>
            
            <ProfileHeader 
              name={user.displayName || `${user.firstName} ${user.lastName}` || user.email.split('@')[0]} 
              year="2026" 
              about={about}
              onAboutChange={handleAboutChange}
            />

            <UserPosts onShowAllChange={handleShowAllPosts} isShowingAll={showAllPosts} posts={userPosts} />
            <ActivityCard onShowAllChange={handleShowAllActivities} isShowingAll={showAllActivities} />

          </div>
        </main>

        {/* Right Sidebar - All Posts Panel */}
        <AllPostsPanel isVisible={showAllPosts} posts={userPosts} />
        
        {/* Right Sidebar - All Activities Panel */}
        <AllActivitiesPanel isVisible={showAllActivities} />
        
        {/* Right Sidebar - Update Request Panel */}
        <UpdateRequestPanel 
          isVisible={showUpdateRequest} 
          onClose={() => setShowUpdateRequest(false)}
          currentName={user.displayName || `${user.firstName} ${user.lastName}` || user.email.split('@')[0]}
          currentYear="2026"
        />
        </div>
      )}
    </div>
  );
}