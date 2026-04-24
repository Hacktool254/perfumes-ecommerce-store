"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/lib/auth-context";
import { Sparkles, LayoutGrid, Package, Receipt, Users, ShieldCheck, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

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

interface AdminAuthFormProps {
    mode: "login" | "register" | "forgot" | "reset";
    redirectPath?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AdminAuthForm({ mode: initialMode, redirectPath = "/" }: AdminAuthFormProps) {
    const { login, register, error: authError, clearError } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [mode, setMode] = useState<"login" | "register" | "forgot" | "reset">(
        initialMode === "register" ? "register" : initialMode === "forgot" ? "forgot" : initialMode === "reset" ? "reset" : "login"
    );
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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

    // Sync auth context error with local state
    useState(() => {
        if (authError) setServerError(authError);
    });

    async function handleLogin(values: LoginValues) {
        setServerError(null);
        clearError();
        setIsLoading(true);
        try {
            await login(values.email, values.password);
            // AuthGuard handles redirect to dashboard
        } catch (err: any) {
            console.error("Login error:", err);
            const msg = err?.message || "";
            
            if (msg.includes("InvalidAccountId")) {
                setServerError("Security Update Required: This account hasn't been onboarded to the new system. Please click 'Register' below once to initialize your administrative profile.");
            } else {
                setServerError(msg || "Invalid email or password. Please try again.");
            }
            setIsLoading(false);
        }
    }

    async function handleRegister(values: RegisterValues) {
        setServerError(null);
        clearError();
        setIsLoading(true);
        try {
            await register(values.name, values.email, values.password);
            // AuthGuard handles redirect to dashboard
        } catch (err: any) {
            console.error("Registration error:", err);
            const msg = err?.message || "";
            if (msg.toLowerCase().includes("already")) {
                setServerError("An account already exists with this email. Please sign in instead.");
            } else {
                setServerError(msg || "Could not create account. Please try again.");
            }
            setIsLoading(false);
        }
    }

    async function handleForgot(values: ForgotValues) {
        setServerError(null);
        setSuccessMessage(null);
        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: values.email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setSuccessMessage(data.message || "If an account exists, you will receive a reset link shortly.");
        } catch (error: any) {
            setServerError(error.message || "An error occurred.");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleReset(values: ResetValues) {
        setServerError(null);
        setIsLoading(true);
        try {
            const token = searchParams?.get("token");
            if (!token) throw new Error("Missing reset token.");
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword: values.password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setSuccessMessage("Password reset successfully!");
            setTimeout(() => setMode("login"), 2000);
        } catch (error: any) {
            setServerError(error.message || "Reset link expired or invalid.");
        } finally {
            setIsLoading(false);
        }
    }

    const isLogin = mode === "login";
    const isRegister = mode === "register";
    const isForgot = mode === "forgot";
    const isReset = mode === "reset";

    return (
        <div className="fixed inset-0 z-50 bg-[#0A0D0B] flex flex-col items-center justify-center font-sans">
            {/* Background Ambient Glows to match Ummie's brand colors faintly in a dark UI */}
            <div className="fixed inset-0 pointer-events-none flex justify-center items-center overflow-hidden">
                <div className="w-[800px] h-[800px] bg-[#414A37]/10 rounded-full blur-[120px] absolute -top-[20%]" />
                <div className="w-[600px] h-[600px] bg-[#99744A]/5 rounded-full blur-[100px] absolute -bottom-[10%]" />
            </div>

            <div className="z-10 w-full max-w-[600px] px-6">
                
                {/* Header Logo & Title */}
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="w-20 h-20 rounded-[24px] bg-gradient-to-br from-[#414A37] to-[#2B3124] shadow-[0_0_40px_#414a374d] border border-[#414A37]/50 flex items-center justify-center mb-6">
                        <Sparkles className="w-10 h-10 text-[#DBC2A6]" />
                    </div>
                    
                    <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-2">
                        UMMIES <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DBC2A6] to-[#99744A] italic font-serif font-medium">ADMIN</span>
                        <div className="w-2 h-2 rounded-full bg-[#DBC2A6] ml-1 self-end mb-2" />
                    </h1>
                    <p className="text-[10px] font-bold text-[#DBC2A6]/60 uppercase tracking-[0.4em] mt-2">
                        Command Center
                    </p>
                </div>

                {/* Main Auth Container */}
                <div className="bg-[#111412]/80 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 md:p-12 shadow-[0_8px_32px_#00000066]">
                    <p className="text-sm text-gray-400 text-center mb-8 leading-relaxed max-w-md mx-auto">
                        Welcome to the internal management system. Please log in with your administrative credentials to manage inventory, monitor orders, and configure platform settings.
                    </p>

                    {isLogin ? (
                        <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                            <div>
                                <input
                                    type="email"
                                    placeholder="Administrator Email"
                                    className="w-full bg-[#1A1E1C] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#414A37] focus:ring-1 focus:ring-[#414A37] transition-all"
                                    {...loginForm.register("email")}
                                />
                                {loginForm.formState.errors.email && (
                                    <p className="text-red-400 text-xs mt-2 pl-4">{loginForm.formState.errors.email.message}</p>
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Secure Password"
                                    className="w-full bg-[#1A1E1C] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#414A37] focus:ring-1 focus:ring-[#414A37] transition-all pr-12"
                                    {...loginForm.register("password")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#DBC2A6] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                                {loginForm.formState.errors.password && (
                                    <p className="text-red-400 text-xs mt-2 pl-4">{loginForm.formState.errors.password.message}</p>
                                )}
                            </div>

                            {serverError && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl text-center">
                                    {serverError}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#DBC2A6] hover:bg-[#E5D5C5] text-[#111412] font-bold text-sm py-4 rounded-2xl transition-all flex items-center justify-center gap-2 group mt-6"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        ACCESS DASHBOARD
                                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            <div className="pt-4 flex justify-between">
                                <button type="button" onClick={() => setMode("register")} className="text-xs text-gray-500 hover:text-[#DBC2A6] transition-colors">
                                    Need an account? Register
                                </button>
                                <button type="button" onClick={() => setMode("forgot")} className="text-xs text-gray-500 hover:text-[#DBC2A6] transition-colors">
                                    Forgot password?
                                </button>
                            </div>
                        </form>
                    ) : isRegister ? (
                        <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full bg-[#1A1E1C] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#414A37] focus:ring-1 focus:ring-[#414A37] transition-all"
                                    {...registerForm.register("name")}
                                />
                                {registerForm.formState.errors.name && (
                                    <p className="text-red-400 text-xs mt-2 pl-4">{registerForm.formState.errors.name.message}</p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="email"
                                    placeholder="Administrator Email"
                                    className="w-full bg-[#1A1E1C] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#414A37] focus:ring-1 focus:ring-[#414A37] transition-all"
                                    {...registerForm.register("email")}
                                />
                                {registerForm.formState.errors.email && (
                                    <p className="text-red-400 text-xs mt-2 pl-4">{registerForm.formState.errors.email.message}</p>
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Secure Password"
                                    className="w-full bg-[#1A1E1C] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#414A37] focus:ring-1 focus:ring-[#414A37] transition-all pr-12"
                                    {...registerForm.register("password")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#DBC2A6] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                                {registerForm.formState.errors.password && (
                                    <p className="text-red-400 text-xs mt-2 pl-4">{registerForm.formState.errors.password.message}</p>
                                )}
                            </div>

                            {serverError && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl text-center">
                                    {serverError}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#DBC2A6] hover:bg-[#E5D5C5] text-[#111412] font-bold text-sm py-4 rounded-2xl transition-all flex items-center justify-center gap-2 group mt-6"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        INITIALIZE ACCOUNT
                                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            <div className="pt-4 text-center">
                                <button type="button" onClick={() => setMode("login")} className="text-xs text-gray-500 hover:text-[#DBC2A6] transition-colors">
                                    Already initialized? Return to login
                                </button>
                            </div>
                        </form>
                    ) : isForgot ? (
                        <form onSubmit={forgotForm.handleSubmit(handleForgot)} className="space-y-4">
                            <div>
                                <input type="email" placeholder="Administrator Email" className="w-full bg-[#1A1E1C] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#414A37] focus:ring-1 focus:ring-[#414A37] transition-all" {...forgotForm.register("email")} />
                                {forgotForm.formState.errors.email && <p className="text-red-400 text-xs mt-2 pl-4">{forgotForm.formState.errors.email.message}</p>}
                            </div>
                            {serverError && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl text-center">{serverError}</div>}
                            {successMessage && <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm p-4 rounded-xl text-center">{successMessage}</div>}
                            <button type="submit" disabled={isLoading} className="w-full bg-[#DBC2A6] hover:bg-[#E5D5C5] text-[#111412] font-bold text-sm py-4 rounded-2xl transition-all flex items-center justify-center gap-2 group mt-6">
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>SEND RESET LINK<ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" /></>}
                            </button>
                            <div className="pt-4 text-center"><button type="button" onClick={() => setMode("login")} className="text-xs text-gray-500 hover:text-[#DBC2A6] transition-colors">Back to login</button></div>
                        </form>
                    ) : isReset ? (
                        <form onSubmit={resetForm.handleSubmit(handleReset)} className="space-y-4">
                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} placeholder="New Password" className="w-full bg-[#1A1E1C] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#414A37] focus:ring-1 focus:ring-[#414A37] transition-all pr-12" {...resetForm.register("password")} />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#DBC2A6] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                                {resetForm.formState.errors.password && <p className="text-red-400 text-xs mt-2 pl-4">{resetForm.formState.errors.password.message}</p>}
                            </div>
                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} placeholder="Confirm Password" className="w-full bg-[#1A1E1C] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#414A37] focus:ring-1 focus:ring-[#414A37] transition-all pr-12" {...resetForm.register("confirmPassword")} />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#DBC2A6] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                                {resetForm.formState.errors.confirmPassword && <p className="text-red-400 text-xs mt-2 pl-4">{resetForm.formState.errors.confirmPassword.message}</p>}
                            </div>
                            {serverError && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl text-center">{serverError}</div>}
                            {successMessage && <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm p-4 rounded-xl text-center">{successMessage}</div>}
                            <button type="submit" disabled={isLoading} className="w-full bg-[#DBC2A6] hover:bg-[#E5D5C5] text-[#111412] font-bold text-sm py-4 rounded-2xl transition-all flex items-center justify-center gap-2 group mt-6">
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>RESET PASSWORD<ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" /></>}
                            </button>
                            <div className="pt-4 text-center"><button type="button" onClick={() => setMode("login")} className="text-xs text-gray-500 hover:text-[#DBC2A6] transition-colors">Back to login</button></div>
                        </form>
                    ) : null}
                </div>

                {/* Info Pills */}
                <div className="grid grid-cols-4 gap-4 mt-8">
                    <div className="bg-[#111412]/50 backdrop-blur-sm border border-white/5 rounded-2xl py-4 flex flex-col items-center justify-center gap-2 hover:bg-[#1A1E1C] transition-colors">
                        <LayoutGrid className="w-5 h-5 text-[#414A37]" />
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Insights</span>
                    </div>
                    <div className="bg-[#111412]/50 backdrop-blur-sm border border-white/5 rounded-2xl py-4 flex flex-col items-center justify-center gap-2 hover:bg-[#1A1E1C] transition-colors">
                        <Package className="w-5 h-5 text-[#414A37]" />
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Inventory</span>
                    </div>
                    <div className="bg-[#111412]/50 backdrop-blur-sm border border-white/5 rounded-2xl py-4 flex flex-col items-center justify-center gap-2 hover:bg-[#1A1E1C] transition-colors">
                        <Receipt className="w-5 h-5 text-[#414A37]" />
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Orders</span>
                    </div>
                    <div className="bg-[#111412]/50 backdrop-blur-sm border border-white/5 rounded-2xl py-4 flex flex-col items-center justify-center gap-2 hover:bg-[#1A1E1C] transition-colors">
                        <Users className="w-5 h-5 text-[#414A37]" />
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Customers</span>
                    </div>
                </div>

                {/* Footer Component */}
                <div className="mt-16 text-center flex items-center justify-center gap-2 opacity-40">
                    <ShieldCheck className="w-4 h-4 text-gray-300" />
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">Secure Administrative Access Only</span>
                </div>

            </div>
        </div>
    );
}
