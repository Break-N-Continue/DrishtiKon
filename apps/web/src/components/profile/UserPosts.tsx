'use client';

import type { UserPostsProps } from '@/hooks/profile/types';
import { useRightSidebar } from '@/context/RightSidebarContext';

export default function UserPosts({ onShowAllChange, isShowingAll = false, posts = [] }: UserPostsProps) {
  const { posts: selectedPosts, setPosts } = useRightSidebar();
  
  const handleShowAll = (value: boolean) => {
    onShowAllChange?.(value);
  };

  // Show up to 3 posts in the collapsed stack, or all of them if expanded
  const postsToDisplay = isShowingAll ? posts : posts.slice(0, 3);
  
  const selectedPostId = selectedPosts?.[0]?.id;

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
        {postsToDisplay.map((post) => {
          const isActive = post.id === selectedPostId;
          
          return (
            <div
              key={post.id}
              onClick={() => setPosts([post])}
              className={`p-6 rounded-xl transition-all duration-300 cursor-pointer group ${
                isActive 
                  ? 'bg-surface-container-low ring-2 ring-primary shadow-md transform -translate-y-1' 
                  : 'bg-surface-container-lowest ring-1 ring-outline-variant/10 shadow-sm hover:ring-primary/40 hover:bg-surface-container-low hover:-translate-y-0.5'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className={`text-[10px] font-label uppercase tracking-[0.2em] ${isActive ? 'text-primary' : 'text-secondary/60'}`}>
                  {post.tags && post.tags.length > 0 ? `Post • ${post.tags[0]}` : 'Post'}
                </span>
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
          );
        })}

        {posts.length === 0 && (
          <div className="text-center py-12 text-on-surface-variant italic font-serif">
            <p>No posts yet. Start sharing your thoughts.</p>
          </div>
        )}
      </div>
    </div>
  );
}