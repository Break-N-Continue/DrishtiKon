import { useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";
import { getUserPosts } from "@/lib/api";
import type { PostWithDate } from "@/lib/types";

export function useProfile() {
  const { user, loading } = useAuth();
  const [userPosts, setUserPosts] = useState<PostWithDate[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPostsLoading(false);
      return;
    }

    const fetchUserPosts = async () => {
      try {
        setPostsLoading(true);
        const allPosts = await getUserPosts(user.id);
        const filtered: PostWithDate[] = allPosts
          .filter(post => post.authorId === user.id)
          .map(post => ({
            ...post,
            date: new Date(post.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            }),
            tags: post.tags || []
          }));
        setUserPosts(allPosts.length === 0 ? [] : filtered);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setPostsLoading(false);
      }
    };

    fetchUserPosts();
  }, [user]);

  return { user, loading, userPosts, postsLoading };
}
