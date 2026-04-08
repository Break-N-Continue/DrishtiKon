import { useState, useEffect, useCallback } from "react";
import { getPosts, createPost, deletePost, type Post } from "@/lib/api";

interface UseHomeFeedReturn {
  posts: Post[];
  loading: boolean;
  error: string | null;
  handleCreatePost: (title: string, description: string) => Promise<void>;
  handleDeletePost: (id: number) => Promise<void>;
  refreshPosts: () => Promise<void>;
}

export function useHomeFeed(): UseHomeFeedReturn {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPosts();
      setPosts(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          "Failed to load posts. Is the backend running on port 8080?"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreatePost = useCallback(
    async (title: string, description: string) => {
      try {
        await createPost({ title, description });
        await fetchPosts();
      } catch (err: any) {
        setError(err?.response?.data?.error || "Failed to create post");
      }
    },
    [fetchPosts]
  );

  const handleDeletePost = useCallback(
    async (id: number) => {
      try {
        await deletePost(id);
        await fetchPosts();
      } catch (err: any) {
        setError(err?.response?.data?.error || "Failed to delete post");
      }
    },
    [fetchPosts]
  );

  return {
    posts,
    loading,
    error,
    handleCreatePost,
    handleDeletePost,
    refreshPosts: fetchPosts,
  };
}
