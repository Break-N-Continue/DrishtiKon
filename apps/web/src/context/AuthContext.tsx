"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  fetchCurrentUser,
  logoutUser,
  requestOtp as apiRequestOtp,
  verifyOtp as apiVerifyOtp,
  type AuthUser,
} from "@/lib/api";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  // OTP flow
  requestOtp: (email: string) => Promise<string>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  requestOtp: async () => "",
  verifyOtp: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  const requestOtp = useCallback(async (email: string): Promise<string> => {
    const { message } = await apiRequestOtp(email);
    return message;
  }, []);

  const verifyOtp = useCallback(
    async (email: string, otp: string): Promise<void> => {
      const { user: loggedInUser } = await apiVerifyOtp(email, otp);
      setUser(loggedInUser);
    },
    [],
  );

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, requestOtp, verifyOtp, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
