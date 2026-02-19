"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

type Step = "email" | "otp";

export default function LoginButton() {
  const { requestOtp, verifyOtp } = useAuth();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setOpen(false);
    setStep("email");
    setEmail("");
    setOtp("");
    setError("");
    setInfo("");
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const msg = await requestOtp(email.toLowerCase().trim());
      setInfo(msg);
      setStep("otp");
    } catch (err: any) {
      setError(
        err?.response?.data?.error || "Failed to send OTP. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      await verifyOtp(email.toLowerCase().trim(), otp.trim());
      reset();
    } catch (err: any) {
      setError(
        err?.response?.data?.error || "Verification failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:opacity-90 transition-colors"
      >
        Sign In
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6 relative">
        <button
          onClick={reset}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground text-lg leading-none"
        >
          &times;
        </button>

        <h2 className="text-lg font-semibold mb-1">Sign in to DrishtiKon</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Use your <strong>@aitpune.edu.in</strong> email
        </p>

        {error && (
          <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </div>
        )}
        {info && (
          <div className="mb-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
            {info}
          </div>
        )}

        {step === "email" ? (
          <form onSubmit={handleRequestOtp} className="space-y-3">
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-medium mb-1"
              >
                College Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@aitpune.edu.in"
                required
                autoFocus
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 disabled:opacity-50 transition-colors"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit code sent to <strong>{email}</strong>
            </p>
            <div>
              <label
                htmlFor="login-otp"
                className="block text-sm font-medium mb-1"
              >
                OTP Code
              </label>
              <input
                id="login-otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                required
                autoFocus
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-center text-lg tracking-widest font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 disabled:opacity-50 transition-colors"
            >
              {loading ? "Verifying..." : "Verify & Sign In"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setOtp("");
                setError("");
                setInfo("");
              }}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Use a different email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
