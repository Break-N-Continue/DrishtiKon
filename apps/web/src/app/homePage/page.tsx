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
      className="fixed bottom-20 md:bottom-8 right-6 md:right-8 z-[100]"
      style={{
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

    {/* ── ActionDialog Demo (Assign Academic Tags) ── */}
    <ActionDialog
      open={dialogOpen}
      onOpenChange={setDialogOpen}
      showHeader={false}
      variant="single"
      size="md"
      primaryAction={{
        label: "Confirm Changes",
        onClick: () => setDialogOpen(false),
        variant: "primary",
      }}
      secondaryAction={{
        label: "Cancel",
        onClick: () => setDialogOpen(false),
        variant: "secondary",
      }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        .action-dialog-btn-primary { background-color: #631C1C !important; color: white !important; }
        .action-dialog-btn-primary:hover { background-color: #4A1515 !important; }
        .action-dialog-btn-secondary { background-color: #E6E6E6 !important; border: none !important; color: black !important; font-weight: 500 !important; }
        .action-dialog-btn-secondary:hover { background-color: #D4D4D4 !important; }
      `}} />
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {/* Custom Header */}
        <div>
          <h2 style={{ fontFamily: "Georgia, serif", color: "#631C1C", fontSize: "1.75rem", fontWeight: 700, margin: 0, marginBottom: "0.5rem" }}>
            Assign Academic Tags
          </h2>
          <p style={{ color: "#5C6B8A", fontSize: "0.9rem", margin: 0 }}>
            Categorize this manuscript for archival discovery.
          </p>
        </div>

        {/* Search Input */}
        <div style={{ position: "relative" }}>
          <span className="material-symbols-outlined" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#888" }}>
            search
          </span>
          <input
            type="text"
            placeholder="yfgy"
            style={{
              width: "100%",
              padding: "12px 12px 12px 40px",
              border: "1px solid #DFB5B5",
              borderRadius: "2px",
              outline: "none",
              fontSize: "1rem",
              color: "#333"
            }}
          />
        </div>

        {/* Active Tags */}
        <div>
          <h3 style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", marginBottom: "0.75rem" }}>
            Active Tags
          </h3>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 12px",
                backgroundColor: "#C6D3FB",
                color: "#1E3B8A",
                borderRadius: "2px",
                fontSize: "0.8rem",
                fontWeight: 600
              }}
            >
              #Philosophy
              <span className="material-symbols-outlined" style={{ fontSize: "14px", cursor: "pointer", opacity: 0.7 }}>close</span>
            </span>
          </div>
        </div>

        {/* Suggested Tags */}
        <div>
          <h3 style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", marginBottom: "0.75rem" }}>
            Suggested Tags
          </h3>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {[
              "#ResearchNote",
              "#CaseStudy",
              "#PeerReview",
              "#AcademicEthics"
            ].map(tag => (
              <div key={tag} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={{ 
                    display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", 
                    backgroundColor: "#EEEEEE", color: "#846565", 
                    width: "32px", height: "32px", borderRadius: "2px", 
                    fontSize: "0.95rem", fontWeight: "bold" 
                  }}>
                    #
                  </span>
                  <span style={{ fontSize: "0.95rem", color: "#222" }}>{tag}</span>
                </div>
                <span className="material-symbols-outlined" style={{ color: "#846565", cursor: "pointer", fontSize: "1.2rem" }}>add</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ActionDialog>
    </>
  );
}
