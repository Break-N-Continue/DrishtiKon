"use client";

import type { Post } from "@/lib/api";

interface PostCardProps {
  post: Post;
  onDelete: (id: number) => void;
}

export default function PostCard({ post, onDelete }: PostCardProps) {
  const timeAgo = getTimeAgo(post.createdAt);

  return (
    <div className="bg-white border border-border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{post.title}</h3>
          <p className="mt-2 text-foreground/80 whitespace-pre-wrap">
            {post.description}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="font-medium text-foreground/70">
            {post.authorName}
          </span>
          <span>{timeAgo}</span>
          <span className="inline-flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
            {post.upvoteCount}
          </span>
        </div>
        <button
          onClick={() => onDelete(post.id)}
          className="text-destructive hover:text-destructive/80 text-sm font-medium"
        >
          Delete
        </button>
      </div>
    </div>
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
