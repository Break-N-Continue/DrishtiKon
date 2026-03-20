"use client";

import { useAuth } from "@/context/AuthContext";
import { useHomeFeed } from "@/hooks/feed/useHomeFeed";
import CreatePostForm from "@/components/posts/CreatePostForm";
import PostCard from "@/components/posts/PostCard";
export default function HomePage() {
  const { user } = useAuth();
  const { posts, loading, error, handleCreatePost, handleDeletePost } =
    useHomeFeed();

  return (
    

    <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-12">
      {/* Page Header */}
      <header className="border-b border-outline-variant/20 pb-8">
        <h1 className="font-headline text-5xl font-bold text-on-surface mb-2">
          Campus Feed
        </h1>
        <p className="font-body text-on-surface-variant max-w-2xl text-lg">
          The curated record of student inquiry, departmental announcements, and
          collegiate events.
        </p>
      </header>

      {/* Create Post Section */}
      {user ? (
        <section className="animate-fade-in-up">
          <CreatePostForm onSubmit={handleCreatePost} />
        </section>
      ) : (
        <div className="bg-surface-container-lowest p-6 ring-1 ring-outline-variant/10 rounded-xl text-center text-on-surface-variant font-body">
          Sign in with your <strong>@aitpune.edu.in</strong> email to create
          posts.
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl font-body text-sm">
          {error}
        </div>
      )}

      {/* Feed Section */}
      <section className="flex flex-col gap-8">
        <div className="flex items-center justify-between border-b border-outline-variant/10 pb-4">
          <h2 className="font-headline text-2xl font-semibold italic text-primary">
            Recent Publications
          </h2>
          <span className="font-label text-xs uppercase tracking-widest text-secondary opacity-60">
            Sorted by relevance
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-on-surface-variant font-body">
            Loading posts...
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant border-2 border-dashed border-outline-variant/30 rounded-xl">
            <p className="font-headline text-lg font-medium">No posts yet</p>
            <p className="mt-1 font-body text-sm">
              Be the first to create a post!
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={handleDeletePost}
              canDelete={user?.id === post.authorId}
            />

          
          ))
        )}
      </section>

      {/* Load More */}
      <footer className="flex justify-center py-8">
        <button className="font-label text-primary font-bold hover:underline flex items-center gap-2 decoration-2 underline-offset-4">
          Review Older Manuscripts
          <span className="material-symbols-outlined">expand_more</span>
        </button>
      </footer>
    </div>
  );
}
