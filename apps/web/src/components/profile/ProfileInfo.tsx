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
    <div className="w-full relative group">
      {isEditing ? (
        <div className="space-y-3 mt-4">
          <textarea
            value={editedAbout}
            onChange={(e) => setEditedAbout(e.target.value)}
            className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/40 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface placeholder:text-outline/50 font-body text-sm resize-none"
            rows={4}
            placeholder="Write something about yourself..."
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-lg hover:opacity-90 transition-all font-bold text-sm shadow-sm"
            >
              <Save size={16} />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-surface-container-high text-on-surface-variant rounded-lg hover:bg-surface-container-highest transition-all font-bold text-sm"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="relative pr-8 pl-6 py-2 border-l-2 border-primary/20">
          <p className="text-on-surface-variant leading-relaxed text-lg font-light italic serif">
            "{editedAbout || 'Add a bio quote...'}"
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-0 right-0 p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-surface-container-high transition-all text-secondary hover:text-primary focus:opacity-100"
            title="Edit Bio"
          >
            <Pencil size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
