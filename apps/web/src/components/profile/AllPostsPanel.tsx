'use client';

import { useState } from 'react';
import { MoreVertical } from 'lucide-react';

export interface Post {
  id: number;
  title: string;
  description: string;
  tags?: string[];
  date: string;
}

export interface AllPostsProps {
  isVisible: boolean;
  posts?: Post[];
}

export default function AllPostsPanel({ isVisible, posts = [] }: AllPostsProps) {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  if (!isVisible) return null;

  return (
    <aside className="hidden lg:block lg:col-span-4 transition-all duration-700 ease-in-out">
      <div className="bg-gradient-to-br from-white via-indigo-50 to-white rounded-2xl p-6 shadow-lg border border-cyan-200 sticky top-24 max-h-[calc(100vh-100px)] overflow-y-auto backdrop-blur-sm">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-2">All Posts</h2>
        <p className="text-sm text-slate-500 mb-6 pb-4 border-b-2 border-indigo-100">View and manage all your posts</p>
        {posts.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p className="text-sm">No posts yet. Start sharing your thoughts!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
            <div
              key={post.id}
              className="p-5 bg-gradient-to-br from-white to-cyan-50 border-2 border-indigo-200 rounded-lg shadow-md hover:shadow-lg hover:border-indigo-300 transition cursor-pointer relative backdrop-blur-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-base font-bold text-slate-800 line-clamp-3 flex-1">{post.title}</h3>
                <div className="relative ml-2">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === post.id ? null : post.id)}
                    className="p-1 hover:bg-indigo-100 rounded-full transition"
                  >
                    <MoreVertical size={18} className="text-slate-600" />
                  </button>
                  {openMenuId === post.id && (
                    <div className="absolute right-0 mt-2 bg-white border border-indigo-200 rounded-lg shadow-lg z-50 min-w-[120px]">
                      <button className="w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 font-semibold transition">
                        Edit
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 font-semibold transition border-t border-indigo-100">
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-4 line-clamp-3">{post.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags && post.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-gradient-to-r from-indigo-100 to-cyan-100 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-300 font-semibold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <span className="text-xs text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded">{post.date}</span>
            </div>
          ))}
          </div>
        )}
      </div>
    </aside>
  );
}
