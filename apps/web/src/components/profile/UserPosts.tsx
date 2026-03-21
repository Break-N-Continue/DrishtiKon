'use client';

import { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import type { PostWithDate } from '@/lib/types';
import type { UserPostsProps } from '@/hooks/profile/types';

export default function UserPosts({ onShowAllChange, isShowingAll = false, posts = [] }: UserPostsProps) {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const handleShowAll = (value: boolean) => {
    onShowAllChange?.(value);
  };

  // Show up to 3 posts in the collapsed stack, or all of them if expanded
  const postsToDisplay = isShowingAll ? posts : posts.slice(0, 3);

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-headline text-xl text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl">edit_note</span> Your Posts
        </h3>
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-secondary font-bold tracking-widest uppercase bg-surface-container-high px-2 py-0.5 rounded-sm">{posts.length} posts</span>
          {posts.length > 1 && (
            <button
              onClick={() => handleShowAll(!isShowingAll)}
              className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline transition-all"
            >
              {isShowingAll ? 'Show Less' : 'Show All'}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {postsToDisplay.map((post) => (
          <div key={post.id} className="bg-surface-container-lowest p-6 rounded-xl ring-1 ring-outline-variant/10 shadow-sm cursor-pointer hover:ring-primary/20 transition-all group">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-label uppercase tracking-[0.2em] text-secondary/60">
                {post.tags && post.tags.length > 0 ? `Post • ${post.tags[0]}` : 'Post'}
              </span>
              {isShowingAll && (
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === post.id ? null : post.id); }}
                    className="p-1 hover:bg-surface-container-high rounded-full transition text-secondary hover:text-primary"
                  >
                    <MoreVertical size={16} />
                  </button>
                  {openMenuId === post.id && (
                    <div className="absolute right-0 mt-2 bg-surface border border-outline-variant/20 rounded-lg shadow-lg z-50 min-w-[120px] overflow-hidden">
                      <button className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-surface-container-high font-medium transition">
                        Edit
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error-container font-medium transition border-t border-outline-variant/10">
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <h4 className="font-headline text-2xl text-on-surface group-hover:text-primary transition-colors mb-3">
              {post.title}
            </h4>
            <p className="text-on-surface-variant text-sm line-clamp-2 leading-relaxed mb-4">
              {post.description}
            </p>
            
            <div className="mt-4 flex gap-4 text-xs text-secondary/60">
              <span className="flex items-center gap-1 font-medium">{post.date}</span>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="text-center py-12 text-on-surface-variant italic font-serif">
            <p>No posts yet. Start sharing your thoughts.</p>
          </div>
        )}
      </div>
    </div>
  );
}