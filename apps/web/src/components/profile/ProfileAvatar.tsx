import { Pencil } from 'lucide-react';

export default function ProfileAvatar() {
  return (
    <div className="relative mb-8">
      <div className="w-28 h-28 bg-gradient-to-br from-indigo-100 via-cyan-100 to-indigo-100 rounded-full border-4 border-cyan-300 shadow-lg ring-2 ring-indigo-200" /> {/* Avatar Circle */}
      <button className="absolute bottom-0 right-0 p-2 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-full hover:shadow-lg hover:scale-110 transition-all duration-300 group">
        <Pencil size={16} className="text-white" />
      </button>
    </div>
  );
}
