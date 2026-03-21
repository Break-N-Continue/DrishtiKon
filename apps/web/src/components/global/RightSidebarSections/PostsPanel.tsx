"use client";

import { X, Pencil } from "lucide-react";
import type { PostsPanelProps } from "@/lib/types";
import { useRightSidebar } from "@/context/RightSidebarContext";

/**
 * PostsPanel Component
 * ────────────────────
 * Displays a selected post in the right sidebar
 */
export default function PostsPanel({ posts }: PostsPanelProps) {
  const { setPosts } = useRightSidebar();

  if (!posts || posts.length === 0) return null;

  const post = posts[0];

  return (
    <div className="h-full overflow-y-auto bg-surface relative">
      <div className="p-6 md:p-8">
        <div className="flex justify-between items-start mb-6">
          <span className="text-xs font-label uppercase tracking-[0.2em] text-secondary/60 mt-1.5">
            {post.tags && post.tags.length > 0 ? `Post • ${post.tags[0]}` : 'Post'}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-secondary font-medium">{post.date}</span>
            <div className="flex items-center gap-1 border-l border-outline-variant/30 pl-2">
              <button
                className="p-1.5 rounded-full hover:bg-surface-container-highest transition-colors text-secondary hover:text-primary"
                title="Edit Post"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => setPosts(null)}
                className="p-1.5 rounded-full hover:bg-error-container transition-colors text-secondary hover:text-error"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        <h2 className="font-headline text-3xl font-bold text-primary mb-5 leading-tight">
          {post.title}
        </h2>
        
        <hr className="border-t-2 border-outline-variant/20 rounded mb-6" />

        <div className="prose prose-sm md:prose-base prose-slate max-w-none">
          <p className="text-on-surface-variant leading-relaxed whitespace-pre-line text-base md:text-lg font-body">
            {post.description}
          </p>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-outline-variant/10">
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs bg-surface-container-highest text-secondary px-3 py-1 rounded-full border border-outline-variant/20 font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
