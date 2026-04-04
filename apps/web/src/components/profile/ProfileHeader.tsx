import ProfileAvatar from './ProfileAvatar';
import ProfileInfo from './ProfileInfo';
import type { ProfileHeaderProps } from '@/hooks/profile/types';

export default function ProfileHeader({
  name,
  year,
  about,
  onAboutChange,
  actionLabel,
  onActionClick,
}: ProfileHeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between mb-6">
        <div className="flex items-end gap-6 min-w-0">
          <ProfileAvatar />
          <div className="pb-2 flex-1 min-w-0">
            <h1 className="font-headline text-4xl font-bold text-on-surface leading-tight">{name}</h1>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-sm text-[10px] font-bold tracking-widest uppercase">Class of {year}</span>
              <span className="text-secondary text-sm font-medium">Computer Engineering</span>
            </div>
          </div>
        </div>

        <button
          onClick={onActionClick}
          className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2 rounded-lg font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all duration-200 whitespace-nowrap flex items-center gap-2 self-start"
        >
          {actionLabel}
        </button>
      </div>
      <ProfileInfo name={name} year={year} about={about} onAboutChange={onAboutChange} />
    </header>
  );
}