'use client';

import { useState } from 'react';
import type { Activity } from '@/lib/types';
import type { ActivityCardProps } from '@/hooks/profile/types';

export default function ActivityCard({ onShowAllChange, isShowingAll = false }: ActivityCardProps) {

  const handleShowAll = (value: boolean) => {
    onShowAllChange?.(value);
  };

  const activities: Activity[] = [
    {
      id: 1,
      title: "Upvoted: Tips for Campus Placement Interview",
      description: "Great tips on how to ace your placement interviews. Very helpful resource for final-year students.",
      type: "upvote",
      author: "John_Dev",
      date: "3 days ago"
    },
    {
      id: 2,
      title: "Commented on: Best Study Groups on Campus",
      description: "You commented: 'Anyone interested in forming a VANET research group? I'm working on protocol optimization...'",
      type: "comment",
      author: "Sarah_Tech",
      date: "1 week ago"
    },
    {
      id: 3,
      title: "Upvoted: Next.js 14 Migration Guide",
      description: "Comprehensive guide on migrating from Next.js 13 to 14. Covers all the breaking changes and new features.",
      type: "upvote",
      author: "Alex_Coder",
      date: "2 weeks ago"
    },
    {
      id: 4,
      title: "Upvoted: Next.js 14 Migration Guide",
      description: "Comprehensive guide on migrating from Next.js 13 to 14. Covers all the breaking changes and new features.",
      type: "upvote",
      author: "Alex_Coder",
      date: "2 weeks ago"
    },
    {
      id: 5,
      title: "Upvoted: Next.js 14 Migration Guide",
      description: "Comprehensive guide on migrating from Next.js 13 to 14. Covers all the breaking changes and new features.",
      type: "upvote",
      author: "Alex_Coder",
      date: "2 weeks ago"
    },
    {
      id: 6,
      title: "Upvoted: Next.js 14 Migration Guide",
      description: "Comprehensive guide on migrating from Next.js 13 to 14. Covers all the breaking changes and new features.",
      type: "upvote",
      author: "Alex_Coder",
      date: "2 weeks ago"
    }
  ];

  const activitiesToDisplay = isShowingAll ? activities : activities.slice(0, 3);

  return (
    <div className="mb-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h3 className="font-headline text-xl text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl">history</span> Your Activity
        </h3>
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-secondary font-bold tracking-widest uppercase bg-surface-container-high px-2 py-0.5 rounded-sm">{activities.length} total</span>
          {activities.length > 1 && (
            <button
              onClick={() => handleShowAll(!isShowingAll)}
              className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline transition-all"
            >
              {isShowingAll ? 'Show Less' : 'Show All'}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {activitiesToDisplay.map((activity) => (
          <div key={activity.id} className="bg-surface-container-low p-4 rounded-lg flex items-start gap-4">
            <span
              className={`material-symbols-outlined pt-1 text-base ${activity.type === 'upvote' ? 'text-primary' : 'text-secondary'}`}
              style={activity.type === 'upvote' ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {activity.type === 'upvote' ? 'favorite' : 'mode_comment'}
            </span>
            <div>
              <p className="text-sm text-on-surface">
                {activity.type === 'upvote' ? 'Liked' : 'Commented on'} <span className="font-bold">"{activity.title.replace(/^(Upvoted: |Commented on: )/, '')}"</span>
              </p>
              {activity.type === 'comment' && (
                <p className="text-xs text-secondary mt-1 italic">"{activity.description.replace(/^You commented: '/, '').replace(/'$/, '')}"</p>
              )}
              <p className="text-[10px] text-secondary/60 mt-2 uppercase tracking-tighter">{activity.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}