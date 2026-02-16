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

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

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
  post: CreatePostData
): Promise<Post> {
  const { data } = await api.put<Post>(`/posts/${id}`, post);
  return data;
}

export async function deletePost(id: number): Promise<void> {
  await api.delete(`/posts/${id}`);
}
