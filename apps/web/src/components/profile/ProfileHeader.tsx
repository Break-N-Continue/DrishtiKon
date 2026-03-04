import ProfileAvatar from './ProfileAvatar';
import ProfileInfo from './ProfileInfo';
import type { ProfileHeaderProps } from '@/lib/types';

export default function ProfileHeader({ name, year, about, onAboutChange }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center text-left w-full mb-8 pb-8 border-b-2 border-cyan-200">
      <ProfileAvatar />
      <ProfileInfo name={name} year={year} about={about} onAboutChange={onAboutChange} />
    </div>
  );
}