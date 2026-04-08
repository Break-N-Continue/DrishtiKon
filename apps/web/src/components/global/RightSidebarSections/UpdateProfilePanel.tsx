"use client";

import { useState } from "react";
import { X, Send } from "lucide-react";

interface UpdateProfilePanelProps {
  // Current user profile data - shows what needs to be updated
  currentName?: string;
  currentYear?: string;
  onClose?: () => void;
}

/**
 * UpdateProfilePanel Component
 * ────────────────────────────
 * Displays profile update request form in the right sidebar
 * Allows users to request name and year changes
 */
export default function UpdateProfilePanel({
  currentName = "Student",
  currentYear = "2026",
  onClose,
}: UpdateProfilePanelProps) {
  const [name, setName] = useState("");
  const [year, setYear] = useState("");

  // Handle form submission for profile update
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Update request submitted:", { name, year });
    // Reset form
    setName("");
    setYear("");
    // Close panel after submission
    onClose?.();
  };

  return (
    <div className="h-full overflow-y-auto bg-surface-container-low">
      <div className="p-6 pb-8">
        {/* Header with close button */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-outline-variant/20">
          <h2 className="text-xl font-headline font-bold text-on-surface">Update Profile</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-surface-container-highest rounded-full transition-colors text-secondary hover:text-error"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-secondary mb-8">
          Request updates to your profile information
        </p>

        {/* Update form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name update field */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-primary tracking-wide uppercase">
              Update Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter new name"
              className="w-full px-4 py-2.5 bg-surface border border-outline-variant/30 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-sm text-on-surface placeholder:text-outline/40 shadow-sm"
            />
            <p className="text-xs text-secondary mt-2">
              Current: <span className="font-semibold text-primary">{currentName}</span>
            </p>
          </div>

          {/* Year update field */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-primary tracking-wide uppercase">
              Update Year
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-4 py-2.5 bg-surface border border-outline-variant/30 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-sm text-on-surface appearance-none cursor-pointer shadow-sm"
            >
              <option value="">Select year</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
            </select>
            <p className="text-xs text-secondary mt-2">
              Current: <span className="font-semibold text-primary">{currentYear}</span>
            </p>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={!name && !year}
            className="w-full mt-8 bg-gradient-to-br from-primary to-primary-container text-on-primary px-4 py-3 rounded-lg font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            <Send size={16} />
            Submit Request
          </button>

          {/* Info box */}
          <div className="mt-6 p-4 bg-surface-container-highest border-l-4 border-primary rounded-r-lg">
            <p className="text-xs text-on-surface-variant leading-relaxed">
              <span className="font-bold text-primary">Note:</span> Your update request will be carefully reviewed by
              administrators.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
