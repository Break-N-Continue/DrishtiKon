'use client';

import { useState } from 'react';
import { Pencil, Save, X } from 'lucide-react';
import type { ProfileInfoProps } from '@/hooks/profile/types';

export default function ProfileInfo({ name, year, about, onAboutChange }: ProfileInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAbout, setEditedAbout] = useState(about);

  const handleSave = () => {
    // Call the parent callback if provided
    onAboutChange?.(editedAbout);
    console.log('About updated:', editedAbout);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedAbout(about);
    setIsEditing(false);
  };

  return (
    <div className="w-full space-y-4">
      <div className="p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
        <p><span className="font-bold text-indigo-700">Name:</span> <span className="text-slate-700 font-semibold">{name}</span></p>
      </div>
      <div className="p-4 bg-cyan-50 rounded-lg border-l-4 border-cyan-500">
        <p><span className="font-bold text-cyan-700">Year:</span> <span className="text-slate-700 font-semibold">{year}</span></p>
      </div>
      <div className="p-5 bg-indigo-50 rounded-lg border-l-4 border-indigo-500 relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="font-bold text-indigo-700 mb-3 text-lg">About</h3>
            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={editedAbout}
                  onChange={(e) => setEditedAbout(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-indigo-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-slate-700 placeholder-slate-400 resize-none"
                  rows={4}
                  placeholder="Write something about yourself..."
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 hover:shadow-lg transition-all font-semibold text-sm"
                  >
                    <Save size={16} />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400 transition-all font-semibold text-sm"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-slate-700 leading-relaxed text-sm">{editedAbout}</p>
            )}
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 hover:bg-indigo-100 rounded-lg transition-colors flex-shrink-0 group"
            >
              <Pencil size={18} className="text-indigo-600 group-hover:text-cyan-600 transition-colors" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
