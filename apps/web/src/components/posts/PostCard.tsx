"use client";

import type { Post } from "@/lib/api";

interface PostCardProps {
  post: Post;
  onDelete: (id: number) => void;
  canDelete?: boolean;
}

export default function PostCard({
  post,
  onDelete,
  canDelete = false,
}: PostCardProps) {
  const timeAgo = getTimeAgo(post.createdAt);
  const tags = post.tags ?? [];

  // Determine border color based on tags (just for visual variety matching the design)
  const borderColorClass = 
    tags[0]?.toLowerCase() === 'governance' ? 'border-secondary' :
    tags[0]?.toLowerCase() === 'academic success' ? 'border-tertiary' : 
    'border-primary';

  return (
    <article className={`bg-surface-container-lowest p-8 border-l-4 ${borderColorClass} shadow-sm hover:shadow-md transition-shadow animate-fade-in-up`}>
      <div className="flex justify-between items-start mb-4">
        {tags.length > 0 ? (
          <span className="font-label text-xs uppercase tracking-widest text-secondary font-bold">
            {tags[0]}
          </span>
        ) : (
          <span className="font-label text-xs uppercase tracking-widest text-secondary font-bold">
            Post
          </span>
        )}
        <span className="font-label text-xs text-secondary/60">{timeAgo}</span>
      </div>

      <h2 className="font-headline text-3xl font-bold text-on-surface mb-4 leading-tight">
        {post.title}
      </h2>
      <p className="font-body text-on-surface-variant leading-relaxed mb-6 whitespace-pre-wrap">
        {post.description}
      </p>

      <div className="flex items-center gap-4 pt-4 border-t border-outline-variant/10">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-secondary">
            person
          </span>
          <span className="font-label text-xs font-semibold text-on-secondary-container">
            {post.authorName}
          </span>
        </div>

        <div className="flex items-center gap-3 ml-auto border-l border-outline-variant/20 pl-4">
          <div className="flex items-center gap-1.5">
            <button className="material-symbols-outlined text-sm text-secondary hover:text-primary transition-colors cursor-pointer p-1 rounded-full hover:bg-primary/5">
              arrow_upward
            </button>
            <button className="material-symbols-outlined text-sm text-secondary hover:text-primary transition-colors cursor-pointer p-1 rounded-full hover:bg-primary/5">
              arrow_downward
            </button>
          </div>

          {canDelete && (
            <button
              onClick={() => onDelete(post.id)}
              className="material-symbols-outlined text-sm text-error hover:text-error/80 transition-colors cursor-pointer p-1 rounded-full hover:bg-error-container"
            >
              delete
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function getTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
