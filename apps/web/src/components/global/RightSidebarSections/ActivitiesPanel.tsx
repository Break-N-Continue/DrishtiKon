"use client";

import { useState } from "react";
import { MoreVertical } from "lucide-react";
import type { Activity, ActivitiesPanelProps } from "@/lib/types";

/**
 * ActivitiesPanel Component
 * ──────────────────────────
 * Displays user's activities (upvotes and comments) in the right sidebar
 * Includes view post and remove menu for each activity
 */
export default function ActivitiesPanel({ activities }: ActivitiesPanelProps) {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="space-y-4 p-4 pb-8">
        {/* Activities header section */}
        <div className="mb-6 pb-4 border-b-2 border-indigo-100">
          <h2 className="text-lg font-bold text-foreground">All Activities</h2>
          <p className="text-xs text-muted-foreground mt-1">View all your upvotes and comments</p>
        </div>

        {/* Activities list - each activity card with action menu */}
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="p-4 bg-cyan-50 border-2 border-indigo-200 rounded-lg shadow-sm hover:shadow-md hover:border-indigo-300 transition cursor-pointer relative"
          >
            {/* Activity title and action menu */}
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                {/* Activity type badge - upvote or comment */}
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${
                      activity.type === "upvote"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {activity.type === "upvote" ? "👍 Upvoted" : "💬 Commented"}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-800 line-clamp-2">
                  {activity.title}
                </h3>
              </div>
              <div className="relative ml-2">
                {/* More options button - opens view/remove menu */}
                <button
                  onClick={() => setOpenMenuId(openMenuId === activity.id ? null : activity.id)}
                  className="p-1 hover:bg-indigo-100 rounded-full transition"
                >
                  <MoreVertical size={16} className="text-slate-600" />
                </button>
                {/* Dropdown menu for actions */}
                {openMenuId === activity.id && (
                  <div className="absolute right-0 mt-2 bg-white border border-indigo-200 rounded-lg shadow-lg z-50 min-w-[110px]">
                    <button className="w-full text-left px-3 py-2 text-xs text-indigo-600 hover:bg-indigo-50 font-semibold transition">
                      View Post
                    </button>
                    <button className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-50 font-semibold transition border-t border-indigo-100">
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Activity description - limited to 2 lines */}
            <p className="text-xs text-slate-600 mb-3 line-clamp-2">
              {activity.description}
            </p>

            {/* Activity author and date */}
            <p className="text-xs text-slate-500 font-medium">
              by <span className="text-indigo-600 font-semibold">{activity.author}</span> •{" "}
              {activity.date}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
