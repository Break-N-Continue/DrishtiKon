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
    }
  ];

  const activitiesToDisplay = isShowingAll ? activities : activities.slice(0, 3);

  return (
    <div className="w-full mt-8 bg-white rounded-2xl p-8 shadow-lg border border-cyan-200">
      <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-indigo-100">
        <div>
          <h2 className="text-3xl font-bold text-indigo-700">Your Activity</h2>
          <p className="text-sm text-slate-500 mt-1">Posts you've upvoted or commented on</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600 font-semibold bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">{activities.length} activities</span>
          {activities.length > 1 && (
            <button
              onClick={() => handleShowAll(!isShowingAll)}
              className="py-2 px-4 bg-indigo-600 text-white border border-indigo-500 font-semibold rounded-lg hover:bg-indigo-700 hover:shadow-lg hover:scale-105 transition-all duration-300 text-sm whitespace-nowrap"
            >
              {isShowingAll ? '← Show Less' : 'Show All →'}
            </button>
          )}
        </div>
      </div>

      {/* Container holding the cards - Only show stacked view when not showing all */}
      {!isShowingAll && (
        <div 
          className="relative mx-auto w-full transition-all duration-700 ease-in-out" 
          style={{ height: '300px' }}
        >
          {activitiesToDisplay.map((activity, index) => (
            <div
              key={activity.id}
              className={`
                w-full bg-cyan-50 border-2 border-indigo-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-700 ease-in-out cursor-pointer
                absolute top-0 left-0
              `}
              style={{
                transform: `translateY(${index * 24}px) translateX(${index * 8}px) rotateZ(${index * 2}deg)`,
                zIndex: activitiesToDisplay.length - index,
                opacity: 1,
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      activity.type === 'upvote' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {activity.type === 'upvote' ? '👍 Upvoted' : '💬 Commented'}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">{activity.title}</h3>
                </div>
                <span className="text-sm text-slate-500 ml-3 font-medium whitespace-nowrap">{activity.date}</span>
              </div>
              
              <p className="text-slate-600 mb-4 line-clamp-1 text-xs">{activity.description}</p>
              
              <div className="flex gap-4 pt-4 border-t border-indigo-100">
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}