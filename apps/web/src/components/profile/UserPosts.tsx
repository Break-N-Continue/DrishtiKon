'use client';

import { useState } from 'react';
import { MoreVertical } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  description: string;
  tags?: string[];
  date: string;
}

interface UserPostsProps {
  onShowAllChange?: (showAll: boolean) => void;
  isShowingAll?: boolean;
  posts?: Post[];
}

export default function UserPosts({ onShowAllChange, isShowingAll = false, posts = [] }: UserPostsProps) {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const handleShowAll = (value: boolean) => {
    onShowAllChange?.(value);
  };

  // Show up to 3 posts in the collapsed stack, or all of them if expanded
  const postsToDisplay = isShowingAll ? posts : posts.slice(0, 3);

  return (
    <div className="w-full mt-8 bg-gradient-to-br from-white via-indigo-50 to-white rounded-2xl p-8 shadow-lg border border-cyan-200 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-indigo-100">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">Your Posts</h2>
          <p className="text-sm text-slate-500 mt-1">Share your campus experiences</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600 font-semibold bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">{posts.length} posts</span>
          {posts.length > 1 && (
            <button
              onClick={() => handleShowAll(!isShowingAll)}
              className="py-2 px-4 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white border border-indigo-300 font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 text-sm whitespace-nowrap"
            >
              {isShowingAll ? '← Show Less' : 'Show All →'}
            </button>
          )}
        </div>
      </div>

      {/* Container holding the cards - Only show stacked view when not showing all */}
      {!isShowingAll && posts.length > 0 && (
        <div 
          className="relative mx-auto w-full transition-all duration-700 ease-in-out" 
          style={{ height: '300px' }}
        >
          {postsToDisplay.map((post, index) => (
            <div
              key={post.id}
              className={`
                w-full bg-gradient-to-br from-white to-cyan-50 border-2 border-indigo-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-700 ease-in-out cursor-pointer backdrop-blur-sm
                absolute top-0 left-0
              `}
              style={{
                transform: `translateY(${index * 24}px) translateX(${index * 8}px) rotateZ(${index * 2}deg)`,
                zIndex: postsToDisplay.length - index,
                opacity: 1,
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-sm font-bold text-slate-800 flex-1">{post.title}</h3>
                {isShowingAll && (
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === post.id ? null : post.id)}
                      className="ml-3 p-1 hover:bg-indigo-100 rounded-full transition"
                    >
                      <MoreVertical size={20} className="text-slate-600" />
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
                )}
                {!isShowingAll && (
                  <span className="text-sm text-slate-500 ml-3 font-medium">{post.date}</span>
                )}
              </div>
              
              <p className="text-slate-600 mb-5 line-clamp-1 text-xs">{post.description}</p>
              
              {isShowingAll && (
                <p className="text-sm text-slate-500 mb-4 font-medium">{post.date}</p>
              )}
              
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags && post.tags.map((tag, tagIndex) => (
                  <span 
                    key={tagIndex}
                    className="text-xs bg-gradient-to-r from-indigo-100 to-cyan-100 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-300 font-semibold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-4 pt-4 border-t border-indigo-100">
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Empty State */}
      {posts.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <p className="text-sm">No posts yet. Start sharing your thoughts!</p>
        </div>
      )}
    </div>
  );
}