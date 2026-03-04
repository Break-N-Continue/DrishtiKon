'use client';

import { useState } from 'react';
import { X, Send } from 'lucide-react';
import type { UpdateRequestPanelProps } from '@/lib/types';

export default function UpdateRequestPanel({ isVisible, onClose, currentName = 'Student', currentYear = '2026' }: UpdateRequestPanelProps) {
  const [name, setName] = useState('');
  const [year, setYear] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle the update request submission here
    console.log('Update request submitted:', { name, year });
    // Reset form
    setName('');
    setYear('');
    // Optionally close the panel
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <aside className="hidden lg:block lg:col-span-4 transition-all duration-700 ease-in-out">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-cyan-200 sticky top-24 max-h-[calc(100vh-100px)] overflow-y-auto">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-indigo-700">
            Update Request
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-indigo-100 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>
        <p className="text-sm text-slate-500 mb-6 pb-4 border-b-2 border-indigo-100">
          Request updates to your profile information
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Update Field */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-indigo-700">
              Update Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter new name"
                className="w-full px-4 py-3 bg-indigo-50 border-2 border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all text-slate-700 placeholder-slate-400"
              />
            </div>
            <p className="text-xs text-slate-500 ml-1">
              Your current name: <span className="font-semibold text-indigo-600">{currentName}</span>
            </p>
          </div>

          {/* Year Update Field */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-cyan-700">
              Update Year
            </label>
            <div className="relative">
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-4 py-3 bg-cyan-50 border-2 border-cyan-200 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 transition-all text-slate-700 appearance-none cursor-pointer"
              >
                <option value="">Select year</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-slate-500 ml-1">
              Your current year: <span className="font-semibold text-cyan-600">{currentYear}</span>
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!name && !year}
            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            <Send size={18} />
            Submit Request
          </button>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-lg">
            <p className="text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-indigo-700">Note:</span> Your update request will be reviewed by administrators. 
              You'll be notified once your changes are approved.
            </p>
          </div>
        </form>
      </div>
    </aside>
  );
}
