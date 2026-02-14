// Authentication related types
export interface LoginRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otpCode: string;
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  token: string;
  refreshToken?: string;
}

export interface JwtPayload {
  sub: string; // user ID
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface OtpVerification {
  id: number;
  email: string;
  otpCode: string;
  expiresAt: string;
  isVerified: boolean;
  createdAt: string;
}

export interface SendOtpRequest {
  email: string;
}

export interface SendOtpResponse {
  message: string;
  email: string;
  expiresIn: number; // minutes
}
