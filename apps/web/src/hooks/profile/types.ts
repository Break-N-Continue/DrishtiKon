import { PostWithDate, Activity } from "@/lib/types";

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  regNo?: string;
  about?: string;
  year?: string;
  role: string;
  displayName?: string;
}

export interface UpdateProfileData {
  currentName: string;
  currentYear: string;
}

export interface ProfileUpdateRequest {
  name?: string;
  year?: string;
  about?: string;
}

export interface ProfileHeaderProps {
  name: string;
  year: string;
  about: string;
  onAboutChange?: (about: string) => void;
  actionLabel: string;
  onActionClick: () => void;
}

export interface ProfileInfoProps {
  name: string;
  year: string;
  about: string;
  onAboutChange?: (about: string) => void;
}

export interface UpdateRequestPanelProps {
  isVisible: boolean;
  onClose: () => void;
  currentName?: string;
  currentYear?: string;
}

export interface UpdateRequestFormProps {
  currentName?: string;
  currentYear?: string;
  onClose?: () => void;
}

export interface ActivityCardProps {
  onShowAllChange?: (showAll: boolean) => void;
  isShowingAll?: boolean;
}

export interface UserPostsProps {
  onShowAllChange?: (showAll: boolean) => void;
  isShowingAll?: boolean;
  posts?: PostWithDate[];
}
