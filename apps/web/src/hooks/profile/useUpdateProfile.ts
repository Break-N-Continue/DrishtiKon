import { useState } from 'react';
import { updateUserAbout } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export function useUpdateProfile() {
  const { user } = useAuth();
  const [about, setAbout] = useState("Computer Science Student - VANET Enthusiast");
  const [isSavingAbout, setIsSavingAbout] = useState(false);

  const handleAboutChange = async (newAbout: string) => {
    if (!user) return;
    
    try {
      setIsSavingAbout(true);
      await updateUserAbout(user.id, newAbout);
      setAbout(newAbout);
      console.log('About saved successfully:', newAbout);
    } catch (error) {
      console.error('Failed to save about:', error);
    } finally {
      setIsSavingAbout(false);
    }
  };

  return { about, isSavingAbout, handleAboutChange };
}
