"use client";

import { useState, useEffect } from "react";
import { getPosts, createPost, type Post } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import CreatePostForm from "@/components/posts/CreatePostForm";
import PostCard from "@/components/posts/PostCard";

export default function HomePage() {
  const { user } = useAuth();
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
          "Failed to load posts. Is the backend running on port 8080?",
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



  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Community Posts</h2>
        <p className="text-muted-foreground">
          Share ideas, questions, and discussions with your college community.
        </p>
      </div>

      {user ? (
        <CreatePostForm onSubmit={handleCreatePost} />
      ) : (
        <div className="bg-secondary/30 border border-border rounded-lg p-4 text-center text-muted-foreground">
          Sign in with your <strong>@aitpune.edu.in</strong> email to create
          posts.
        </div>
      )}

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
            <PostCard
              key={post.id}
              post={post}
              onDelete={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}
