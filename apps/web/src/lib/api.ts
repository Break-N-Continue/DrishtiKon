import axios from "axios";

export interface Post {
  id: number;
  title: string;
  description: string;
  authorName: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostData {
  title: string;
  description: string;
}

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

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

// ---- Posts ----

export async function getPosts(): Promise<Post[]> {
  const { data } = await api.get<Post[]>("/posts");
  return data;
}

export async function getPost(id: number): Promise<Post> {
  const { data } = await api.get<Post>(`/posts/${id}`);
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
