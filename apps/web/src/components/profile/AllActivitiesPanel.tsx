'use client';

import { useState } from 'react';
import { MoreVertical } from 'lucide-react';

export interface AllActivitiesProps {
  isVisible: boolean;
}

export default function AllActivitiesPanel({ isVisible }: AllActivitiesProps) {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const activities = [
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

  if (!isVisible) return null;

  return (
    <aside className="hidden lg:block lg:col-span-4 transition-all duration-700 ease-in-out">
      <div className="bg-gradient-to-br from-white via-indigo-50 to-white rounded-2xl p-6 shadow-lg border border-cyan-200 sticky top-24 max-h-[calc(100vh-100px)] overflow-y-auto backdrop-blur-sm">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-2">All Activities</h2>
        <p className="text-sm text-slate-500 mb-6 pb-4 border-b-2 border-indigo-100">View all your upvotes and comments</p>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="p-5 bg-gradient-to-br from-white to-cyan-50 border-2 border-indigo-200 rounded-lg shadow-md hover:shadow-lg hover:border-indigo-300 transition cursor-pointer relative backdrop-blur-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      activity.type === 'upvote' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {activity.type === 'upvote' ? '👍 Upvoted' : '💬 Commented'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-800 line-clamp-3">{activity.title}</h3>
                </div>
                <div className="relative ml-2">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === activity.id ? null : activity.id)}
                    className="p-1 hover:bg-indigo-100 rounded-full transition"
                  >
                    <MoreVertical size={18} className="text-slate-600" />
                  </button>
                  {openMenuId === activity.id && (
                    <div className="absolute right-0 mt-2 bg-white border border-indigo-200 rounded-lg shadow-lg z-50 min-w-[130px]">
                      <button className="w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 font-semibold transition">
                        View Post
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 font-semibold transition border-t border-indigo-100">
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-4 line-clamp-3">{activity.description}</p>
              <p className="text-sm text-slate-500 mb-2 font-medium">by <span className="text-indigo-600 font-semibold">{activity.author}</span> • {activity.date}</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
