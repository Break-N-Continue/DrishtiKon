import axios from "axios";
import {
  Post,
  PostWithDate,
  CreatePostData,
  UpdatePostData,
  AuthUser,
  Activity,
  ActivityResponse,
  ApiResponse,
  AuthResponse,
  OtpRequestResponse,
} from "./types";

import type { UserProfile, ProfileUpdateRequest } from "@/hooks/profile/types";

export type {
  Post,
  PostWithDate,
  CreatePostData,
  UpdatePostData,
  AuthUser,
  Activity,
  ActivityResponse,
  ApiResponse,
  AuthResponse,
  OtpRequestResponse,
} from "./types";

export type { UserProfile, ProfileUpdateRequest } from "@/hooks/profile/types";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ---- Auth ----

export async function requestOtp(email: string): Promise<{ message: string }> {
  const { data } = await api.post("/auth/request-otp", { email });
  return data;
}

export async function verifyOtp(
  email: string,
  otp: string,
): Promise<{ message: string; user: AuthUser }> {
  const { data } = await api.post("/auth/verify-otp", { email, otp });
  return data;
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data } = await api.get<AuthUser>("/auth/me");
    return data;
  } catch {
    return null;
  }
}

export async function logoutUser(): Promise<void> {
  await api.post("/auth/logout");
}

// ---- Users ----

export async function updateUserAbout(id: number, about: string): Promise<{ message: string }> {
  const { data } = await api.patch(`/users/${id}/about`, { about });
  return data;
}

// ---- Posts ----

export async function getPosts(): Promise<Post[]> {
  const { data } = await api.get<Post[]>("/posts");
  return data;
}

export async function getPost(id: number): Promise<Post> {
  const { data } = await api.get<Post>(`/posts/${id}`);
  return data;
}

export async function getUserPosts(userId: number): Promise<Post[]> {
  const { data } = await api.get<Post[]>(`/posts/user/${userId}`);
  return data;
}

export async function createPost(post: CreatePostData): Promise<Post> {
  const { data } = await api.post<Post>("/posts", post);
  return data;
}

export async function updatePost(
  id: number,
  post: CreatePostData,
): Promise<Post> {
  const { data } = await api.put<Post>(`/posts/${id}`, post);
  return data;
}

export async function deletePost(id: number): Promise<void> {
  await api.delete(`/posts/${id}`);
}

// ---- Profile ----

export async function getUserProfile(userId: number): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>(`/users/${userId}`);
  return data;
}

export async function updateUserProfile(
  userId: number,
  profile: ProfileUpdateRequest,
): Promise<{ message: string; user: UserProfile }> {
  const { data } = await api.patch(`/users/${userId}`, profile);
  return data;
}

export async function requestProfileUpdate(
  userId: number,
  profile: ProfileUpdateRequest,
): Promise<{ message: string }> {
  const { data } = await api.post(`/users/${userId}/profile-update-request`, profile);
  return data;
}

