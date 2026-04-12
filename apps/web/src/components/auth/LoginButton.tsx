"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ActionDialog } from "@/components/ActionDialog";

type Step = "email" | "otp";

interface LoginButtonProps {
  /** Show only an icon trigger (for collapsed sidebar) */
  compact?: boolean;
  /** Optional custom label for the non-compact trigger */
  label?: string;
  /** Optional class name for trigger button */
  className?: string;
  /** Callback fired when trigger is clicked */
  onTrigger?: () => void;
  /** Controlled open state */
  open?: boolean;
  /** Controlled open state setter */
  onOpenChange?: (open: boolean) => void;
  /** Hide trigger button and control only through open/onOpenChange */
  hideTrigger?: boolean;
}

export default function LoginButton({
  compact = false,
  label = "Sign In",
  className = "",
  onTrigger,
  open: controlledOpen,
  onOpenChange,
  hideTrigger = false,
}: LoginButtonProps) {
  const { requestOtp, verifyOtp } = useAuth();
  const [internalOpen, setInternalOpen] = useState(false);
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const setIsOpen = (nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  const dialogTitle = step === "email" ? "Login Required" : "Enter OTP";
  const dialogDescription =
    step === "email"
      ? "Welcome to the digital archive. Please authenticate to access the campus feed and research discourse."
      : `Enter the 6-digit code sent to ${email}`;

  const reset = () => {
    setIsOpen(false);
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

  if (!isOpen) {
    if (hideTrigger) {
      return null;
    }

    if (compact) {
      return (
        <button
          onClick={() => {
            onTrigger?.();
            setIsOpen(true);
          }}
          title="Sign In"
          className={`w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors ${className}`}
        >
          {/* person icon */}
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </button>
      );
    }
    return (
      <button
        onClick={() => {
          onTrigger?.();
          setIsOpen(true);
        }}
        className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors ${className}`}
      >
        <svg
          className="w-5 h-5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        {label}
      </button>
    );
  }

  return (
    <ActionDialog
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          reset();
          return;
        }
        setIsOpen(true);
      }}
      variant="single"
      showHeader
      showFooter={false}
      size="lg"
      headerAlign="center"
      title={dialogTitle}
      description={dialogDescription}
      backgroundColor="#ffffff"
      className="border border-outline-variant/30"
      contentClassName="max-w-[34rem]"
    >
      <div className="mx-auto w-full max-w-md space-y-4 pb-2">
        <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
          <span className="material-symbols-outlined text-3xl">
            {step === "email" ? "lock_open" : "password"}
          </span>
        </div>

        {error && (
          <div className="rounded-md border border-error/25 bg-error-container px-3 py-2 text-sm text-on-error-container">
            {error}
          </div>
        )}
        {info && (
          <div className="rounded-md border border-secondary/25 bg-secondary-container/40 px-3 py-2 text-sm text-on-surface-variant">
            {info}
          </div>
        )}

        {step === "email" ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="mb-1 block text-sm font-medium text-on-surface"
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
                className="w-full rounded-md border border-outline-variant px-3 py-3 text-on-surface placeholder:text-on-surface-variant/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-on-primary transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Sending..." : "Sign In"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label
                htmlFor="login-otp"
                className="mb-1 block text-sm font-medium text-on-surface"
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
                className="w-full rounded-md border border-outline-variant px-3 py-3 text-center font-mono text-xl tracking-[0.35em] text-on-surface placeholder:tracking-normal focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-on-primary transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Sign In"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("email");
                setOtp("");
                setError("");
                setInfo("");
              }}
              className="w-full text-sm font-medium text-secondary transition hover:text-primary"
            >
              Use a different email
            </button>
          </form>
        )}
      </div>
    </ActionDialog>
  );
}
