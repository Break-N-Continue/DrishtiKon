"use client";

import { useState } from "react";
import { MoreVertical } from "lucide-react";
import type { PostsPanelProps } from "@/lib/types";

/**
 * PostsPanel Component
 * ────────────────────
 * Displays user's posts in the right sidebar
 * Includes edit/delete menu for each post
 */
export default function PostsPanel({ posts }: PostsPanelProps) {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="space-y-4 p-4 pb-8">
        {/* Posts header section */}
        <div className="mb-6 pb-4 border-b-2 border-indigo-100">
          <h2 className="text-lg font-bold text-foreground">All Posts</h2>
          <p className="text-xs text-muted-foreground mt-1">View and manage all your posts</p>
        </div>

        {/* Posts list - each post card with edit/delete menu */}
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-4 bg-cyan-50 border-2 border-indigo-200 rounded-lg shadow-sm hover:shadow-md hover:border-indigo-300 transition cursor-pointer relative"
          >
            {/* Post title and action menu */}
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-bold text-slate-800 line-clamp-2 flex-1">{post.title}</h3>
              <div className="relative ml-2">
                {/* More options button - opens edit/delete menu */}
                <button
                  onClick={() => setOpenMenuId(openMenuId === post.id ? null : post.id)}
                  className="p-1 hover:bg-indigo-100 rounded-full transition"
                >
                  <MoreVertical size={16} className="text-slate-600" />
                </button>
                {/* Dropdown menu for edit and delete actions */}
                {openMenuId === post.id && (
                  <div className="absolute right-0 mt-2 bg-white border border-indigo-200 rounded-lg shadow-lg z-50 min-w-[100px]">
                    <button className="w-full text-left px-3 py-2 text-xs text-indigo-600 hover:bg-indigo-50 font-semibold transition">
                      Edit
                    </button>
                    <button className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-50 font-semibold transition border-t border-indigo-100">
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Post description - limited to 2 lines */}
            <p className="text-xs text-slate-600 mb-3 line-clamp-2">{post.description}</p>

            {/* Post tags - displays up to 2 tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {post.tags &&
                post.tags.slice(0, 2).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-300 font-semibold"
                  >
                    #{tag}
                  </span>
                ))}
            </div>

            {/* Post date */}
            <span className="text-xs text-slate-500 font-medium">{post.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
