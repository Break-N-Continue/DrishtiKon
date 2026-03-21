import ProfileAvatar from './ProfileAvatar';
import ProfileInfo from './ProfileInfo';
import type { ProfileHeaderProps } from '@/hooks/profile/types';

export default function ProfileHeader({ name, year, about, onAboutChange }: ProfileHeaderProps) {
  return (
    <header className="mb-12">
      <div className="flex items-end gap-6 mb-6">
        <ProfileAvatar />
        <div className="pb-2 flex-1">
          <h1 className="font-headline text-4xl font-bold text-on-surface leading-tight">{name}</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-sm text-[10px] font-bold tracking-widest uppercase">Class of {year}</span>
            <span className="text-secondary text-sm font-medium">Computer Engineering</span>
          </div>
        </div>
      </div>
      <ProfileInfo name={name} year={year} about={about} onAboutChange={onAboutChange} />
    </header>
  );
}