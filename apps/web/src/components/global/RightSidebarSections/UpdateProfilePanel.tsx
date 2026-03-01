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
    <div className="h-full overflow-y-auto bg-white">
      <div className="p-4 pb-8">
        {/* Header with close button */}
        <div className="flex justify-between items-center mb-4 pb-4 border-b-2 border-indigo-100">
          <h2 className="text-lg font-bold text-foreground">Update Profile</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-indigo-100 rounded-full transition-colors"
          >
            <X size={18} className="text-slate-600" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground mb-6">
          Request updates to your profile information
        </p>

        {/* Update form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name update field */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-indigo-600">
              Update Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter new name"
              className="w-full px-3 py-2 bg-indigo-50 border-2 border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all text-sm text-slate-700 placeholder-slate-400"
            />
            <p className="text-xs text-slate-500">
              Current: <span className="font-semibold text-indigo-600">{currentName}</span>
            </p>
          </div>

          {/* Year update field */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-cyan-600">
              Update Year
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-3 py-2 bg-cyan-50 border-2 border-cyan-200 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 transition-all text-sm text-slate-700 appearance-none cursor-pointer"
            >
              <option value="">Select year</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
            </select>
            <p className="text-xs text-slate-500">
              Current: <span className="font-semibold text-cyan-600">{currentYear}</span>
            </p>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={!name && !year}
            className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-3 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:from-indigo-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            <Send size={14} />
            Submit Request
          </button>

          {/* Info box */}
          <div className="mt-4 p-3 bg-indigo-100 border-l-4 border-indigo-500 rounded">
            <p className="text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-indigo-700">Note:</span> Your update request will be reviewed by
              administrators.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
