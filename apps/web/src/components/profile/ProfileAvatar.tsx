import { Pencil } from 'lucide-react';

export default function ProfileAvatar() {
  return (
    <div className="relative flex-shrink-0">
      <div className="w-32 h-32 bg-surface-container-highest rounded-xl shadow-sm ring-1 ring-outline-variant/20 flex items-center justify-center text-secondary">
        <span className="material-symbols-outlined text-6xl">person</span>
      </div>
      <button className="absolute -bottom-3 -right-3 p-2.5 bg-surface-container-high rounded-full shadow-md hover:bg-surface-container-highest hover:scale-110 transition-all duration-300 ring-1 ring-outline-variant/30 text-secondary hover:text-primary z-10 group">
        <Pencil size={18} className="text-secondary group-hover:text-primary transition-colors" />
      </button>
    </div>
  );
}
