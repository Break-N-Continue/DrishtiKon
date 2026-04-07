"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useHomeFeed } from "@/hooks/feed/useHomeFeed";
import CreatePostForm from "@/components/posts/CreatePostForm";
import PostCard from "@/components/posts/PostCard";
import { ActionDialog } from "@/components/ActionDialog";
export default function HomePage() {
  const { user } = useAuth();
  const { posts, loading, error, handleCreatePost, handleDeletePost } =
    useHomeFeed();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>


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

    {/* ── FAB ── */}
    <button
      onClick={() => setDialogOpen(true)}
      title="Open ActionDialog demo"
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #6750a4, #9c7de8)",
        color: "#fff",
        fontSize: "2rem",
        lineHeight: 1,
        border: "none",
        cursor: "pointer",
        boxShadow: "0 6px 24px rgba(103,80,164,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        transition: "transform 0.15s, box-shadow 0.15s",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 10px 32px rgba(103,80,164,0.55)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 24px rgba(103,80,164,0.45)";
      }}
    >
      +
    </button>

    {/* ── ActionDialog Demo ── */}
    <ActionDialog
      open={dialogOpen}
      onOpenChange={setDialogOpen}
      title="Create a New Post"
      description="Share an announcement, event, or update with the campus community."
      variant="single"
      size="2xl"
      primaryAction={{
        label: "Publish",
        onClick: () => setDialogOpen(false),
        variant: "primary",
      }}
      secondaryAction={{
        label: "Cancel",
        onClick: () => setDialogOpen(false),
        variant: "secondary",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", paddingTop: "0.5rem" }}>
        <div>
          <label style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.55 }}>
            Title
          </label>
          <input
            type="text"
            placeholder="e.g. Annual Tech Fest 2025"
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              borderBottom: "1.5px solid rgba(0,0,0,0.15)",
              outline: "none",
              fontSize: "1.1rem",
              fontWeight: 600,
              padding: "6px 0",
              marginTop: "4px",
            }}
          />
        </div>
        <div>
          <label style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.55 }}>
            Content
          </label>
          <textarea
            rows={4}
            placeholder="Write your post content here..."
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              borderBottom: "1.5px solid rgba(0,0,0,0.15)",
              outline: "none",
              fontSize: "0.9rem",
              padding: "6px 0",
              resize: "none",
              marginTop: "4px",
              fontFamily: "inherit",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {["Announcement", "Event", "Department", "Academics"].map(tag => (
            <span
              key={tag}
              style={{
                padding: "4px 12px",
                borderRadius: "999px",
                border: "1.5px solid #6750a4",
                color: "#6750a4",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </ActionDialog>
    </>
  );
}
