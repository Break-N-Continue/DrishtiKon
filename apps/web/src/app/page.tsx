"use client";

import { useState, useEffect } from "react";
import { getPosts, createPost, deletePost, type Post } from "@/lib/api";
import CreatePostForm from "@/components/posts/CreatePostForm";
import PostCard from "@/components/posts/PostCard";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
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
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (title: string, description: string) => {
    try {
      await createPost({ title, description });
      await fetchPosts();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to create post");
    }
  };

  const handleDeletePost = async (id: number) => {
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to delete post");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Community Posts</h2>
        <p className="text-muted-foreground">
          Share ideas, questions, and discussions with your college community.
        </p>
      </div>

      <CreatePostForm onSubmit={handleCreatePost} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading posts...
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
          <p className="text-lg font-medium">No posts yet</p>
          <p className="mt-1">Be the first to create a post!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onDelete={handleDeletePost} />
          ))}
        </div>
      )}
    </div>
  );
}
