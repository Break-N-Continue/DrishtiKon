import { useState, useCallback, useEffect } from 'react';
import { useRightSidebar } from "@/context/RightSidebarContext";
import type { PostWithDate, Activity } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";

export function useProfileLayout() {
  const { user } = useAuth();
  const { setPosts, setActivities, setUpdateProfile, updateProfile } = useRightSidebar();
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

  // Sync showUpdateRequest when the panel is closed externally (e.g., X button in sidebar)
  useEffect(() => {
    if (updateProfile === null) {
      setShowUpdateRequest(false);
    }
  }, [updateProfile]);

  const handleShowAllPosts = useCallback((show: boolean, userPosts: PostWithDate[]) => {
    setShowAllPosts(show);
    if (show) {
      setPosts(null);
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
      setActivities(null);
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
      const resolvedName = user?.displayName 
        || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : null)
        || user?.email?.split('@')[0]
        || 'Student';
      setUpdateProfile({
        currentName: resolvedName,
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

  // Called by the X button in the Right Sidebar panel to sync state back
  const handleCloseUpdateRequest = useCallback(() => {
    setShowUpdateRequest(false);
    setUpdateProfile(null);
  }, [setUpdateProfile]);

  return {
    showAllPosts,
    showAllActivities,
    showUpdateRequest,
    handleShowAllPosts,
    handleShowAllActivities,
    handleToggleUpdateRequest,
    handleCloseUpdateRequest
  };
}
