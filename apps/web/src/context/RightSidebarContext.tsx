'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { PostWithDate, Activity, UpdateProfileData } from '@/lib/types';

interface RightSidebarContextType {
  posts: PostWithDate[] | null;
  setPosts: (posts: PostWithDate[] | null) => void;
  activities: Activity[] | null;
  setActivities: (activities: Activity[] | null) => void;
  updateProfile: UpdateProfileData | null;
  setUpdateProfile: (data: UpdateProfileData | null) => void;
  isShowingPosts: boolean;
  isShowingActivities: boolean;
  isShowingUpdateProfile: boolean;
}

// Context for sharing posts, activities, and profile updates with RightSidebar from any child component
const RightSidebarContext = createContext<RightSidebarContextType | undefined>(undefined);

export function RightSidebarProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<PostWithDate[] | null>(null);
  const [activities, setActivities] = useState<Activity[] | null>(null);
  const [updateProfile, setUpdateProfile] = useState<UpdateProfileData | null>(null);

  return (
    <RightSidebarContext.Provider
      value={{
        posts,
        setPosts,
        activities,
        setActivities,
        updateProfile,
        setUpdateProfile,
        isShowingPosts: posts !== null,
        isShowingActivities: activities !== null,
        isShowingUpdateProfile: updateProfile !== null,
      }}
    >
      {children}
    </RightSidebarContext.Provider>
  );
}

// Hook to use RightSidebar context from any component
export function useRightSidebar() {
  const context = useContext(RightSidebarContext);
  if (!context) {
    throw new Error('useRightSidebar must be used within RightSidebarProvider');
  }
  return context;
}
