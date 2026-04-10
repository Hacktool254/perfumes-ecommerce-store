"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthActions } from "@convex-dev/auth/react";
import { useAuth } from "@/lib/auth-context";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

const forgotSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

const resetSchema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;
type ForgotValues = z.infer<typeof forgotSchema>;
type ResetValues = z.infer<typeof resetSchema>;

interface AuthFormProps {
    mode: "login" | "register" | "forgot" | "reset";
    redirectPath?: string;
}

export function AuthForm({ mode: initialMode, redirectPath = "/account/dashboard" }: AuthFormProps) {
    const { login, register, error: contextError, clearError } = useAuth();
    const { signIn } = useAuthActions(); 
    const router = useRouter();
    const [mode, setMode] = useState<"login" | "register" | "forgot" | "reset">(initialMode);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Clear local error too
    useEffect(() => {
        clearError();
        setServerError(null);
    }, [mode, clearError]);

    // ── Forms ──
    const loginForm = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const registerForm = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: { name: "", email: "", password: "" },
    });

    const forgotForm = useForm<ForgotValues>({
        resolver: zodResolver(forgotSchema),
        defaultValues: { email: "" },
    });

    const resetForm = useForm<ResetValues>({
        resolver: zodResolver(resetSchema),
        defaultValues: { password: "", confirmPassword: "" },
    });

    // ── Handlers ──

    async function handleLogin(values: LoginValues) {
        setIsLoading(true);
        try {
            await login(values.email, values.password);
        } catch {
            // Error is handled by context
        } finally {
            setIsLoading(false);
        }
    }

    async function handleRegister(values: RegisterValues) {
        setIsLoading(true);
        try {
            await register(values.name, values.email, values.password);
        } catch {
            // Error is handled by context
        } finally {
            setIsLoading(false);
        }
    }

    async function handleForgot(values: ForgotValues) {
        setServerError(null);
        setSuccessMessage(null);
        setIsLoading(true);
        try {
            await signIn("password", { flow: "reset", email: values.email });
            setSuccessMessage("If an account exists with this email, you will receive a reset link shortly.");
        } catch (error) {
            console.error(error);
            setServerError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleReset(values: ResetValues) {
        setServerError(null);
        setIsLoading(true);
        try {
            await signIn("password", { flow: "reset-password", password: values.password });
            setSuccessMessage("Password reset successfully! You can now sign in.");
            setMode("login");
        } catch (error) {
            console.error(error);
            setServerError("Reset link expired or invalid. Please request a new one.");
        } finally {
            setIsLoading(false);
        }
    }

    const isLogin = mode === "login";
    const isRegister = mode === "register";
    const isForgot = mode === "forgot";
    const isReset = mode === "reset";

    return (
        <>
            {/* ── Keyframe animations injected as a style tag ── */}
            <style>{`
        .auth-bg {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          position: relative;
          background: var(--background);
        }

        .circles-wrapper {
          position: absolute;
          inset: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          pointer-events: none;
        }

        .circles-container {
          position: relative;
          width: min(520px, 90vw);
          height: min(520px, 90vw);
        }

        .auth-circle {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 4px solid;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .auth-circle:nth-child(1) {
          border-color: color-mix(in srgb, var(--primary) 40%, transparent);
          animation: pulse1 3.5s ease-in-out infinite;
        }
        .auth-circle:nth-child(2) {
          border-color: color-mix(in srgb, var(--ring) 30%, transparent);
          animation: pulse2 3.5s ease-in-out infinite 0.6s;
        }
        .auth-circle:nth-child(3) {
          border-color: color-mix(in srgb, var(--background) 50%, var(--foreground) 10%);
          animation: pulse3 3.5s ease-in-out infinite 1.2s;
        }
        .auth-circle:nth-child(4) {
          border-color: color-mix(in srgb, var(--primary) 10%, transparent);
          animation: pulse4 3.5s ease-in-out infinite 1.8s;
        }

        @keyframes pulse1 {
          0%   { transform: translate(-50%,-50%) scale(0.95); opacity:.8; border-radius:45% 55% 48% 52% / 42% 48% 52% 58%; }
          25%  { transform: translate(-50%,-50%) scale(1.02); opacity:.9; border-radius:58% 42% 55% 45% / 48% 62% 38% 52%; }
          50%  { transform: translate(-50%,-50%) scale(1.06); opacity:1;  border-radius:52% 48% 62% 38% / 53% 45% 55% 47%; }
          75%  { transform: translate(-50%,-50%) scale(0.98); opacity:.9; border-radius:38% 62% 45% 55% / 58% 52% 48% 42%; }
          100% { transform: translate(-50%,-50%) scale(0.95); opacity:.8; border-radius:45% 55% 48% 52% / 42% 48% 52% 58%; }
        }
        @keyframes pulse2 {
          0%   { transform: translate(-50%,-50%) scale(0.92) rotate(12deg);  opacity:.75; border-radius:55% 45% 58% 42% / 52% 48% 52% 48%; }
          25%  { transform: translate(-50%,-50%) scale(1.00) rotate(12deg);  opacity:.85; border-radius:42% 58% 45% 55% / 48% 60% 40% 52%; }
          50%  { transform: translate(-50%,-50%) scale(1.08) rotate(12deg);  opacity:1;   border-radius:48% 52% 40% 60% / 55% 45% 55% 45%; }
          75%  { transform: translate(-50%,-50%) scale(1.00) rotate(12deg);  opacity:.85; border-radius:60% 40% 52% 48% / 42% 58% 42% 58%; }
          100% { transform: translate(-50%,-50%) scale(0.92) rotate(12deg);  opacity:.75; border-radius:55% 45% 58% 42% / 52% 48% 52% 48%; }
        }
        @keyframes pulse3 {
          0%   { transform: translate(-50%,-50%) scale(0.98) rotate(-12deg); opacity:.7;  border-radius:40% 60% 52% 48% / 45% 55% 45% 55%; }
          25%  { transform: translate(-50%,-50%) scale(1.05) rotate(-12deg); opacity:.8;  border-radius:52% 48% 45% 55% / 58% 42% 58% 42%; }
          50%  { transform: translate(-50%,-50%) scale(1.02) rotate(-12deg); opacity:.95; border-radius:60% 40% 58% 42% / 52% 48% 52% 48%; }
          75%  { transform: translate(-50%,-50%) scale(0.95) rotate(-12deg); opacity:.8;  border-radius:45% 55% 42% 58% / 40% 60% 40% 60%; }
          100% { transform: translate(-50%,-50%) scale(0.98) rotate(-12deg); opacity:.7;  border-radius:40% 60% 52% 48% / 45% 55% 45% 55%; }
        }
        @keyframes pulse4 {
          0%   { transform: translate(-50%,-50%) scale(1.00) rotate(6deg);   opacity:.65; border-radius:48% 52% 55% 45% / 50% 50% 50% 50%; }
          25%  { transform: translate(-50%,-50%) scale(1.08) rotate(6deg);   opacity:.75; border-radius:62% 38% 48% 52% / 45% 55% 45% 55%; }
          50%  { transform: translate(-50%,-50%) scale(1.12) rotate(6deg);   opacity:.9;  border-radius:50% 50% 38% 62% / 58% 42% 58% 42%; }
          75%  { transform: translate(-50%,-50%) scale(1.05) rotate(6deg);   opacity:.75; border-radius:38% 62% 52% 48% / 52% 48% 52% 48%; }
          100% { transform: translate(-50%,-50%) scale(1.00) rotate(6deg);   opacity:.65; border-radius:48% 52% 55% 45% / 50% 50% 50% 50%; }
        }

        .auth-card {
          position: relative;
          z-index: 20;
          background: color-mix(in srgb, var(--card) 60%, transparent);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid color-mix(in srgb, var(--border) 50%, white);
          border-radius: 24px;
          padding: 2.5rem 2.25rem;
          width: min(380px, 92vw);
          box-shadow:
            0 8px 32px color-mix(in srgb, var(--primary) 8%, transparent),
            0 2px 8px rgba(0,0,0,0.06),
            inset 0 1px 0 rgba(255,255,255,0.6);
          transition: padding 0.3s ease;
        }

        @media (max-width: 480px) {
          .auth-card {
            padding: 2rem 1.5rem;
            width: 95vw;
          }
        }

        .auth-input {
          width: 100%;
          padding: 0.7rem 1.1rem;
          border: 1.5px solid color-mix(in srgb, var(--input) 50%, transparent);
          border-radius: 999px;
          font-size: 0.875rem;
          background: var(--background);
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s;
          color: var(--foreground);
        }
        .auth-input::placeholder { color: var(--muted-foreground); }
        .auth-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 10%, transparent);
          background: var(--background);
        }

        .auth-btn {
          width: 100%;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 999px;
          background: var(--primary);
          color: var(--primary-foreground);
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          letter-spacing: 0.02em;
        }
        .auth-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px color-mix(in srgb, var(--primary) 25%, transparent);
        }
        .auth-btn:active:not(:disabled) { transform: translateY(0); }
        .auth-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .auth-error {
          background: color-mix(in srgb, var(--destructive) 10%, var(--background));
          border: 1px solid color-mix(in srgb, var(--destructive) 20%, transparent);
          border-radius: 12px;
          color: var(--destructive);
          font-size: 0.8125rem;
          padding: 0.6rem 0.9rem;
          text-align: center;
        }
        .field-error {
          color: var(--destructive);
          font-size: 0.75rem;
          margin-top: 0.25rem;
          padding-left: 0.75rem;
        }
      `}</style>

            <div className="auth-bg">
                {/* Animated circles */}
                <div className="circles-wrapper">
                    <div className="circles-container">
                        <div className="auth-circle" />
                        <div className="auth-circle" />
                        <div className="auth-circle" />
                        <div className="auth-circle" />
                    </div>
                </div>

                {/* Glassmorphism card */}
                <div className="auth-card">
                    {/* Brand header */}
                    <div className="text-center mb-7">
                        <Link href="/" className="inline-block">
                            <span
                                style={{
                                    fontFamily: "var(--font-monsta-fectro, serif)",
                                    fontSize: "1.35rem",
                                    color: "var(--primary)",
                                    letterSpacing: "0.04em",
                                    fontWeight: 600,
                                }}
                            >
                                Ummie&apos;s Essence
                            </span>
                        </Link>
                        <h1
                            style={{
                                fontSize: "1.5rem",
                                fontWeight: 700,
                                color: "var(--foreground)",
                                marginTop: "0.5rem",
                                fontFamily: "var(--font-monsta-fectro, serif)",
                                letterSpacing: "-0.01em",
                            }}
                        >
                            {isLogin ? "Welcome back" : isRegister ? "Create account" : isForgot ? "Reset password" : "Set new password"}
                        </h1>
                        <p style={{ fontSize: "0.8125rem", color: "var(--muted-foreground)", marginTop: "0.25rem" }}>
                            {isLogin
                                ? "Sign in to your account to continue"
                                : isRegister
                                    ? "Join us for the finest fragrances"
                                    : isForgot
                                        ? "Enter your email to receive a reset link"
                                        : "Please enter your new password"}
                        </p>
                    </div>

                    {/* Forms */}
                    {isLogin && (
                        <form onSubmit={loginForm.handleSubmit(handleLogin)} noValidate>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                <div>
                                    <input
                                        id="login-email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="Email address"
                                        className="auth-input"
                                        {...loginForm.register("email")}
                                    />
                                    {loginForm.formState.errors.email && (
                                        <p className="field-error">{loginForm.formState.errors.email.message}</p>
                                    )}
                                </div>

                                <div>
                                    <input
                                        id="login-password"
                                        type="password"
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        className="auth-input"
                                        {...loginForm.register("password")}
                                    />
                                    {loginForm.formState.errors.password && (
                                        <p className="field-error">{loginForm.formState.errors.password.message}</p>
                                    )}
                                </div>

                                {(contextError || serverError) && (
                                    <div className="auth-error">{contextError || serverError}</div>
                                )}

                                <button
                                    id="login-submit"
                                    type="submit"
                                    disabled={isLoading}
                                    className="auth-btn"
                                    style={{ marginTop: "0.25rem" }}
                                >
                                    {isLoading ? "Signing in…" : "Sign In"}
                                </button>

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginTop: "0.5rem",
                                        fontSize: "0.8125rem",
                                    }}
                                >
                                    <span style={{ color: "oklch(0.45 0.02 85)" }}>
                                        No account?{" "}
                                        <button
                                            type="button"
                                            onClick={() => setMode("register")}
                                            style={{ color: "var(--primary)", fontWeight: 600, border: "none", background: "none", cursor: "pointer", padding: 0 }}
                                        >
                                            Sign Up
                                        </button>
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setMode("forgot")}
                                        style={{ color: "var(--primary)", fontWeight: 500, border: "none", background: "none", cursor: "pointer", padding: 0 }}
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    {isRegister && (
                        <form onSubmit={registerForm.handleSubmit(handleRegister)} noValidate>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                <div>
                                    <input
                                        id="register-name"
                                        type="text"
                                        autoComplete="name"
                                        placeholder="Full name"
                                        className="auth-input"
                                        {...registerForm.register("name")}
                                    />
                                    {registerForm.formState.errors.name && (
                                        <p className="field-error">{registerForm.formState.errors.name.message}</p>
                                    )}
                                </div>

                                <div>
                                    <input
                                        id="register-email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="Email address"
                                        className="auth-input"
                                        {...registerForm.register("email")}
                                    />
                                    {registerForm.formState.errors.email && (
                                        <p className="field-error">{registerForm.formState.errors.email.message}</p>
                                    )}
                                </div>

                                <div>
                                    <input
                                        id="register-password"
                                        type="password"
                                        autoComplete="new-password"
                                        placeholder="••••••••"
                                        className="auth-input"
                                        {...registerForm.register("password")}
                                    />
                                    {registerForm.formState.errors.password && (
                                        <p className="field-error">{registerForm.formState.errors.password.message}</p>
                                    )}
                                </div>

                                {(contextError || serverError) && (
                                    <div className="auth-error">{contextError || serverError}</div>
                                )}

                                <button
                                    id="register-submit"
                                    type="submit"
                                    disabled={isLoading}
                                    className="auth-btn"
                                >
                                    {isLoading ? "Creating account…" : "Create Account"}
                                </button>

                                <p style={{ textAlign: "center", marginTop: "0.5rem", fontSize: "0.8125rem", color: "oklch(0.45 0.02 85)" }}>
                                    Already have an account?{" "}
                                    <button
                                        type="button"
                                        onClick={() => setMode("login")}
                                        style={{ color: "#8b1538", fontWeight: 600, border: "none", background: "none", cursor: "pointer", padding: 0 }}
                                    >
                                        Sign In
                                    </button>
                                </p>
                            </div>
                        </form>
                    )}

                    {isForgot && (
                        <form onSubmit={forgotForm.handleSubmit(handleForgot)} noValidate>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                <div>
                                    <input
                                        id="forgot-email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="Email address"
                                        className="auth-input"
                                        {...forgotForm.register("email")}
                                    />
                                    {forgotForm.formState.errors.email && (
                                        <p className="field-error">{forgotForm.formState.errors.email.message}</p>
                                    )}
                                </div>

                                {(contextError || serverError) && (
                                    <div className="auth-error">{contextError || serverError}</div>
                                )}
                                {successMessage && (
                                    <div style={{ background: "rgba(194, 154, 60, 0.1)", border: "1px solid rgba(194, 154, 60, 0.3)", borderRadius: "12px", color: "#c2993c", fontSize: "0.8125rem", padding: "0.6rem 0.9rem", textAlign: "center" }}>
                                        {successMessage}
                                    </div>
                                )}

                                <button
                                    id="forgot-submit"
                                    type="submit"
                                    disabled={isLoading}
                                    className="auth-btn"
                                >
                                    {isLoading ? "Sending link…" : "Send Reset Link"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setMode("login")}
                                    style={{ textAlign: "center", marginTop: "0.5rem", fontSize: "0.8125rem", color: "#8b1538", fontWeight: 600, border: "none", background: "none", cursor: "pointer" }}
                                >
                                    Back to Sign In
                                </button>
                            </div>
                        </form>
                    )}
                    {isReset && (
                        <form onSubmit={resetForm.handleSubmit(handleReset)} noValidate>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                <div>
                                    <input
                                        id="reset-password"
                                        type="password"
                                        placeholder="New password"
                                        className="auth-input"
                                        {...resetForm.register("password")}
                                    />
                                    {resetForm.formState.errors.password && (
                                        <p className="field-error">{resetForm.formState.errors.password.message}</p>
                                    )}
                                </div>

                                <div>
                                    <input
                                        id="reset-confirm-password"
                                        type="password"
                                        placeholder="Confirm new password"
                                        className="auth-input"
                                        {...resetForm.register("confirmPassword")}
                                    />
                                    {resetForm.formState.errors.confirmPassword && (
                                        <p className="field-error">{resetForm.formState.errors.confirmPassword.message}</p>
                                    )}
                                </div>

                                {(contextError || serverError) && (
                                    <div className="auth-error">{contextError || serverError}</div>
                                )}
                                {successMessage && (
                                    <div style={{ background: "rgba(194, 154, 60, 0.1)", border: "1px solid rgba(194, 154, 60, 0.3)", borderRadius: "12px", color: "#c2993c", fontSize: "0.8125rem", padding: "0.6rem 0.9rem", textAlign: "center" }}>
                                        {successMessage}
                                    </div>
                                )}

                                <button
                                    id="reset-submit"
                                    type="submit"
                                    disabled={isLoading}
                                    className="auth-btn"
                                >
                                    {isLoading ? "Resetting…" : "Reset Password"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
}
