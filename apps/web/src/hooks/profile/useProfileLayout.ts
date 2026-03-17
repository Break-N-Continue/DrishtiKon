import { useState, useCallback, useEffect } from 'react';
import { useRightSidebar } from "@/context/RightSidebarContext";
import type { PostWithDate, Activity } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";

export function useProfileLayout() {
  const { user } = useAuth();
  const { setPosts, setActivities, setUpdateProfile } = useRightSidebar();
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [showUpdateRequest, setShowUpdateRequest] = useState(false);

  // Clear context on unmount
  useEffect(() => {
    setShowAllPosts(false);
    setShowAllActivities(false);
    setShowUpdateRequest(false);
    setPosts(null);
    setActivities(null);
    setUpdateProfile(null);

    return () => {
      setPosts(null);
      setActivities(null);
      setUpdateProfile(null);
    };
  }, [setActivities, setUpdateProfile, setPosts]);

  const handleShowAllPosts = useCallback((show: boolean, userPosts: PostWithDate[]) => {
    setShowAllPosts(show);
    if (show) {
      setPosts(userPosts);
      setShowAllActivities(false);
      setShowUpdateRequest(false);
      setActivities(null);
      setUpdateProfile(null);
    } else {
      setPosts(null);
    }
  }, [setPosts, setActivities, setUpdateProfile]);

  const handleShowAllActivities = useCallback((show: boolean) => {
    setShowAllActivities(show);
    if (show) {
      const sampleActivities: Activity[] = [
        {
          id: 1,
          title: "Upvoted: Tips for Campus Placement Interview",
          description: "Great tips on how to ace your placement interviews. Very helpful resource for final-year students.",
          type: "upvote",
          author: "John_Dev",
          date: "3 days ago"
        },
        {
          id: 2,
          title: "Commented on: Best Study Groups on Campus",
          description: "You commented: 'Anyone interested in forming a VANET research group? I'm working on protocol optimization...'",
          type: "comment",
          author: "Sarah_Tech",
          date: "1 week ago"
        },
        {
          id: 3,
          title: "Upvoted: Next.js 14 Migration Guide",
          description: "Comprehensive guide on migrating from Next.js 13 to 14. Covers all the breaking changes and new features.",
          type: "upvote",
          author: "Alex_Coder",
          date: "2 weeks ago"
        }
      ];
      setActivities(sampleActivities);
      setShowAllPosts(false);
      setPosts(null);
      setShowUpdateRequest(false);
      setUpdateProfile(null);
    } else {
      setActivities(null);
    }
  }, [setPosts, setActivities, setUpdateProfile]);

  const handleToggleUpdateRequest = useCallback(() => {
    const newState = !showUpdateRequest;
    setShowUpdateRequest(newState);
    
    if (newState) {
      setUpdateProfile({
        currentName: user?.displayName || user?.firstName ? `${user?.firstName} ${user?.lastName || ''}`.trim() : user?.email?.split('@')[0] || 'Student',
        currentYear: "2026"
      });
      setShowAllPosts(false);
      setShowAllActivities(false);
      setPosts(null);
      setActivities(null);
    } else {
      setUpdateProfile(null);
    }
  }, [showUpdateRequest, user, setPosts, setActivities, setUpdateProfile]);

  return {
    showAllPosts,
    showAllActivities,
    showUpdateRequest,
    handleShowAllPosts,
    handleShowAllActivities,
    handleToggleUpdateRequest
  };
}
