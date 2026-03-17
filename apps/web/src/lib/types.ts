/**
 * Centralized types and interfaces for the DrishtiKon application
 * All components and API functions should reference types from this file
 */

import type { UpdateProfileData } from "@/hooks/profile/types";

// ============================================================================
// AUTH TYPES
// ============================================================================

export interface AuthUser {
  regNo: string | null;
  displayName: string | null;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  about?: string;
}

// ============================================================================
// POST TYPES
// ============================================================================

export interface Post {
  id: number;
  title: string;
  description: string;
  authorName: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export interface CreatePostData {
  title: string;
  description: string;
  tags?: string[];
}

export interface UpdatePostData extends CreatePostData {}

export interface PostWithDate extends Post {
  date: string; // Formatted date string like "Jan 2, 2026"
}

// ============================================================================
// ACTIVITY TYPES
// ============================================================================

export interface Activity {
  id: number;
  title: string;
  description: string;
  type: "upvote" | "comment";
  author: string;
  authorId?: number;
  date: string;
  postId?: number;
}

export interface ActivityResponse {
  id: number;
  userId: number;
  postId: number;
  type: "upvote" | "comment";
  commentText?: string;
  createdAt: string;
}

// ============================================================================
// PROFILE TYPES
// ============================================================================

// Migrated to src/hooks/profile/types.ts

// ============================================================================
// SIDEBAR CONTEXT TYPES
// ============================================================================

export interface RightSidebarContextData {
  posts: PostWithDate[] | null;
  activities: Activity[] | null;
  updateProfile: UpdateProfileData | null;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  message: string;
  data?: T;
}

export interface AuthResponse {
  message: string;
  user: AuthUser;
}

export interface OtpRequestResponse {
  message: string;
}

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

export interface AllActivitiesPanelProps {
  isVisible: boolean;
}

export interface AllPostsPanelProps {
  isVisible: boolean;
  posts?: PostWithDate[];
}

export interface ActivitiesPanelProps {
  activities: Activity[];
}

export interface PostsPanelProps {
  posts: PostWithDate[];
}
