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
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 min-w-0 w-full md:w-auto">
          <ProfileAvatar />
          <div className="pb-2 flex-1 min-w-0 w-full flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="font-headline text-3xl md:text-4xl font-bold text-on-surface leading-tight">{name}</h1>
            <div className="flex justify-center md:justify-start items-center gap-3 mt-2 md:mt-1 flex-wrap">
              <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-sm text-[10px] font-bold tracking-widest uppercase">Class of {year}</span>
              <span className="text-secondary text-sm font-medium">Computer Engineering</span>
            </div>
          </div>
        </div>

        <button
          onClick={onActionClick}
          className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2 rounded-lg font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all duration-200 whitespace-nowrap flex items-center justify-center gap-2 w-full md:w-auto md:self-start"
        >
          {actionLabel}
        </button>
      </div>
      <ProfileInfo name={name} year={year} about={about} onAboutChange={onAboutChange} />
    </header>
  );
}