"use client";

import { 
    Lock, 
    Bell, 
    Globe, 
    Palette, 
    CreditCard, 
    LogOut, 
    ChevronRight, 
    Camera, 
    CheckCircle2, 
    Sparkles,
    Save,
    Loader2,
    ShieldCheck,
    Eye,
    EyeOff,
    Zap,
    Smartphone,
    MessageCircle,
    Bot
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useMutation, useQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { toast } from "sonner";
import Image from "next/image";

const settingGroups = [
    { name: "Brand Identity", icon: <Palette size={18} /> },
    { name: "Security & Access", icon: <Lock size={18} /> },
    { name: "Notifications", icon: <Bell size={18} /> },
    { name: "Billing & Plans", icon: <CreditCard size={18} /> },
    { name: "Global Settings", icon: <Globe size={18} /> },
];

export default function SettingsPage() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState("Brand Identity");

    // Queries for global state
    const preferences = useQuery(api.preferences.get);
    const siteSettings = useQuery(api.siteSettings.get);

    // Mutations
    const updatePreferences = useMutation(api.preferences.update);
    const updateSiteSettings = useMutation(api.siteSettings.update);

    const renderPanel = () => {
        switch (activeTab) {
            case "Brand Identity":
                return <BrandIdentityPanel user={user} />;
            case "Security & Access":
                return <SecurityAccessPanel />;
            case "Notifications":
                return <NotificationsPanel preferences={preferences} updatePreferences={updatePreferences} />;
            case "Billing & Plans":
                return <BillingPlansPanel siteSettings={siteSettings} updateSiteSettings={updateSiteSettings} />;
            case "Global Settings":
                return <GlobalSettingsPanel user={user} preferences={preferences} />;
            default:
                return null;
        }
    }

    return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Page Header */}
            <div className="flex items-end justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Admin / {activeTab}</p>
                    </div>
                    <h1 className="text-[42px] font-bold text-foreground leading-[1.1] tracking-tight">
                        System <span className="text-primary italic font-serif">Curations</span>
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12">
                {/* Sidebar Navigation */}
                <div className="space-y-2">
                    {settingGroups.map((group) => (
                        <button 
                            key={group.name}
                            onClick={() => setActiveTab(group.name)}
                            className={cn(
                                "w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group",
                                activeTab === group.name 
                                    ? "bg-surface-container-lowest text-primary shadow-sm" 
                                    : "text-muted-foreground hover:bg-surface-container-low hover:text-foreground"
                             )}
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                    activeTab === group.name ? "bg-primary/10 text-primary" : "bg-surface-container-low text-muted-foreground group-hover:text-foreground"
                                )}>
                                    {group.icon}
                                </div>
                                <span className={cn(
                                    "text-sm font-bold tracking-tight",
                                    activeTab === group.name ? "text-foreground" : "text-muted-foreground"
                                )}>
                                    {group.name}
                                </span>
                            </div>
                            <ChevronRight size={16} className={cn(
                                "transition-transform group-hover:translate-x-0.5",
                                activeTab === group.name ? "text-primary opacity-100" : "text-muted-foreground opacity-30"
                            )} />
                        </button>
                    ))}

                    <div className="pt-6 mt-6 border-t border-surface-container-highest/20">
                        <button 
                            onClick={logout}
                            className="w-full flex items-center gap-4 p-4 rounded-2xl text-rose-500 hover:bg-rose-500/10 transition-all font-bold text-sm group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center group-hover:bg-rose-500/20 transition-all">
                                <LogOut size={18} />
                            </div>
                            Terminate Session
                        </button>
                    </div>
                </div>

                {/* Main Settings Panel */}
                <div className="bg-surface-container-lowest rounded-[40px] p-6 md:p-12 shadow-sm relative overflow-hidden min-h-[600px]">
                    <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-all duration-500 pointer-events-none">
                        <Sparkles size={160} />
                    </div>
                    
                    <div className="relative z-10 animate-in fade-in slide-in-from-right-4 duration-500">
                        {renderPanel()}
                    </div>
                </div>
            </div>
        </div>
    );
}

/** ─── Brand Identity Panel ─── */
function BrandIdentityPanel({ user }: { user: any }) {
    const [displayName, setDisplayName] = useState(user?.name || "");
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const updateImage = useMutation(api.users.updateImage);
    const updateProfile = useMutation(api.users.updateProfile);

    useEffect(() => {
        if (user) setDisplayName(user.name || "");
    }, [user]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        const toastId = toast.loading("Uploading high-fidelity avatar...");
        try {
            const postUrl = await generateUploadUrl();
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });
            if (!result.ok) throw new Error("Upload failed");
            const { storageId } = await result.json();
            await updateImage({ storageId });
            toast.success("Identity visual updated successfully.", { id: toastId });
        } catch (error) {
            toast.error("Failed to sync identity visual.", { id: toastId });
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        const toastId = toast.loading("Saving curator preferences...");
        try {
            const parts = displayName.trim().split(/\s+/);
            const firstName = parts[0] || "Admin";
            const lastName = parts.slice(1).join(" ") || "User";
            await updateProfile({ firstName, lastName });
            toast.success("Identity synchronized with core.", { id: toastId });
        } catch (error) {
            toast.error("Failed to save changes.", { id: toastId });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-[800px] space-y-12">
            <div className="flex items-center gap-8">
                <div className="relative group/avatar">
                    <div className="w-32 h-32 rounded-[32px] bg-surface-container overflow-hidden shadow-lg border-4 border-[#0d0d0e] relative">
                        {user?.image ? (
                            <Image src={user.image} fill className="object-cover" alt="Profile Avatar" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#414A37] to-[#2B3124]">
                                <Sparkles size={40} className="text-[#DBC2A6]" />
                            </div>
                        )}
                        {isUploading && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                                <Loader2 size={24} className="text-white animate-spin" />
                            </div>
                        )}
                        <div onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity cursor-pointer z-10">
                            <Camera size={24} className="text-white" />
                        </div>
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                </div>
                <div>
                    <h3 className="text-2xl font-extrabold text-foreground tracking-tight">{user?.name || "Administrative Curator"}</h3>
                    <div className="flex items-center gap-2 mt-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full w-fit border border-emerald-500/20">
                        <ShieldCheck size={12} /> Verified Identity
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground px-1">Display Name</label>
                    <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="h-14 w-full bg-surface-container-low border-none rounded-2xl px-6 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground px-1">Administrative Email</label>
                    <input type="email" disabled value={user?.email || ""} className="h-14 w-full bg-surface-container-low/50 border-none rounded-2xl px-6 text-sm font-bold opacity-60 cursor-not-allowed" />
                </div>
            </div>

            <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 h-14 px-10 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-xl shadow-primary/20 disabled:opacity-50 hover:translate-y-[-2px] transition-all">
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Save Identity
            </button>
        </div>
    );
}

/** ─── Security & Access Panel ─── */
function SecurityAccessPanel() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const updateSecurity = useMutation(api.users.updateSecurity);

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("New security keys do not match.");
            return;
        }
        setIsUpdating(true);
        const toastId = toast.loading("Updating security protocols...");
        try {
            await updateSecurity({ currentPassword, newPassword });
            toast.success("Security protocols updated successfully.", { id: toastId });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            toast.error(error.message || "Failed to update security key.", { id: toastId });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="max-w-[600px] space-y-10">
            <div>
                <h3 className="text-2xl font-extrabold text-foreground tracking-tight">Security Credentials</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">Rotate your administrative keys regularly to maintain edge security across the platform.</p>
            </div>

            <form onSubmit={handlePasswordUpdate} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground px-1">Current Security Key</label>
                    <div className="relative">
                        <input 
                            type={showPass ? "text" : "password"} 
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            className="h-14 w-full bg-surface-container-low border-none rounded-2xl px-6 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all pr-12 font-medium"
                        />
                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground px-1">New Security Key</label>
                    <input 
                        type={showPass ? "text" : "password"} 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="h-14 w-full bg-surface-container-low border-none rounded-2xl px-6 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground px-1">Confirm New Key</label>
                    <input 
                        type={showPass ? "text" : "password"} 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="h-14 w-full bg-surface-container-low border-none rounded-2xl px-6 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                </div>

                <button disabled={isUpdating} className="w-full h-14 bg-foreground text-background rounded-2xl font-bold flex items-center justify-center gap-3 hover:translate-y-[-2px] transition-all disabled:opacity-50 shadow-lg shadow-black/10">
                    {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
                    Update Security Protocols
                </button>
            </form>
        </div>
    );
}

/** ─── Notifications Panel ─── */
function NotificationsPanel({ preferences, updatePreferences }: { preferences: any, updatePreferences: any }) {
    const handleToggle = async (key: string, current: boolean) => {
        try {
            await updatePreferences({ [key]: !current });
            toast.success("Preferences updated.");
        } catch (error) {
            toast.error("Failed to sync preferences.");
        }
    };

    const toggles = [
        { key: "adminOrderAlerts", label: "New Order Alerts", sub: "Instant notification for incoming product orders." },
        { key: "adminDeliveryAlerts", label: "Delivery Tracking Hub", sub: "Get notified when orders reach milestone checkpoints." },
        { key: "adminStockAlerts", label: "Inventory Thresholds", sub: "Alert me when product stock falls below curation level." },
    ];

    return (
        <div className="max-w-[700px] space-y-10">
            <div>
                <h3 className="text-2xl font-extrabold text-foreground tracking-tight">System Notifications</h3>
                <p className="text-sm text-muted-foreground mt-1">Configure how you receive high-priority administrative alerts.</p>
            </div>

            <div className="space-y-4">
                {toggles.map((toggle) => (
                    <div key={toggle.key} className="flex items-center justify-between p-6 rounded-3xl bg-surface-container-low border border-transparent hover:border-surface-container-highest/20 transition-all">
                        <div>
                            <h4 className="font-bold text-sm tracking-tight">{toggle.label}</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">{toggle.sub}</p>
                        </div>
                        <button 
                            onClick={() => handleToggle(toggle.key, preferences?.[toggle.key] ?? true)}
                            className={cn(
                                "w-14 h-8 rounded-full transition-all relative flex items-center px-1",
                                (preferences?.[toggle.key] ?? true) ? "bg-primary" : "bg-surface-container-highest"
                            )}
                        >
                            <div className={cn(
                                "w-6 h-6 rounded-full shadow-sm transition-transform",
                                (preferences?.[toggle.key] ?? true) ? "translate-x-6 bg-white" : "translate-x-0 bg-white/60"
                            )} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

/** ─── Billing & Plans Panel ─── */
function BillingPlansPanel({ siteSettings, updateSiteSettings }: { siteSettings: any, updateSiteSettings: any }) {
    const [keys, setKeys] = useState({ resend: "", whatsapp: "", chatbot: "" });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (siteSettings) {
            setKeys({
                resend: siteSettings.resendApiKey || "",
                whatsapp: siteSettings.whatsappApiKey || "",
                chatbot: siteSettings.chatbotApiKey || ""
            });
        }
    }, [siteSettings]);

    const handleSave = async () => {
        setIsSaving(true);
        const toastId = toast.loading("Syncing enterprise keys...");
        try {
            await updateSiteSettings({
                resendApiKey: keys.resend,
                whatsappApiKey: keys.whatsapp,
                chatbotApiKey: keys.chatbot
            });
            toast.success("Integration vault updated.", { id: toastId });
        } catch (error) {
            toast.error("Failed to update vault.", { id: toastId });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-[800px] space-y-10">
            <div>
                <h3 className="text-2xl font-extrabold text-foreground tracking-tight">Enterprise Integrations</h3>
                <p className="text-sm text-muted-foreground mt-1">Manage global API keys for email, communication, and AI chatbot services.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 rounded-[32px] bg-surface-container-low border border-surface-container-highest/10 space-y-4 group hover:bg-surface-container transition-colors">
                    <div className="flex items-center gap-3 text-primary">
                        <Zap size={20} />
                        <h4 className="font-bold text-sm uppercase tracking-widest">Resend (Email Core)</h4>
                    </div>
                    <input 
                        type="password" 
                        placeholder="re_••••••••••••"
                        value={keys.resend}
                        onChange={(e) => setKeys({...keys, resend: e.target.value})}
                        className="w-full bg-background border-none rounded-xl h-12 px-4 text-xs font-mono focus:ring-1 focus:ring-primary/20"
                    />
                </div>

                <div className="p-8 rounded-[32px] bg-surface-container-low border border-surface-container-highest/10 space-y-4 group hover:bg-surface-container transition-colors">
                    <div className="flex items-center gap-3 text-emerald-500">
                        <MessageCircle size={20} />
                        <h4 className="font-bold text-sm uppercase tracking-widest">WhatsApp Business</h4>
                    </div>
                    <input 
                        type="password" 
                        placeholder="wa_••••••••••••"
                        value={keys.whatsapp}
                        onChange={(e) => setKeys({...keys, whatsapp: e.target.value})}
                        className="w-full bg-background border-none rounded-xl h-12 px-4 text-xs font-mono focus:ring-1 focus:ring-emerald-500/20"
                    />
                </div>

                <div className="p-8 rounded-[32px] bg-surface-container-low border border-surface-container-highest/10 space-y-4 group hover:bg-surface-container transition-colors">
                    <div className="flex items-center gap-3 text-blue-500">
                        <Bot size={20} />
                        <h4 className="font-bold text-sm uppercase tracking-widest">AI Chatbot API</h4>
                    </div>
                    <input 
                        type="password" 
                        placeholder="sk_••••••••••••"
                        value={keys.chatbot}
                        onChange={(e) => setKeys({...keys, chatbot: e.target.value})}
                        className="w-full bg-background border-none rounded-xl h-12 px-4 text-xs font-mono focus:ring-1 focus:ring-blue-500/20"
                    />
                </div>
            </div>

            <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 h-14 px-10 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-xl shadow-primary/20 hover:translate-y-[-2px] transition-all">
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Apply Configuration
            </button>
        </div>
    );
}

/** ─── Global Settings Panel ─── */
function GlobalSettingsPanel({ user, preferences }: { user: any, preferences: any }) {
    return (
        <div className="max-w-[800px] space-y-12">
            <div>
                <h3 className="text-2xl font-extrabold text-foreground tracking-tight">Global Overview</h3>
                <p className="text-sm text-muted-foreground mt-1">Snapshot of your administrative profile and security status across the global core.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 rounded-[40px] bg-surface-container-low border border-surface-container-highest/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 text-primary opacity-5 group-hover:scale-110 transition-transform duration-700">
                        <ShieldCheck size={80} />
                    </div>
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Curator Status</h4>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-sm">{user?.name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Super Administrator</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 rounded-[40px] bg-surface-container-low border border-surface-container-highest/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 text-emerald-500 opacity-5 group-hover:scale-110 transition-transform duration-700">
                        <Bell size={80} />
                    </div>
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Notification Health</h4>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <Bell size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-sm">Active Alerts</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">System Tunnels Monitored</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-10 rounded-[40px] bg-primary/5 border border-primary/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 text-primary opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <Zap size={80} />
                </div>
                <h4 className="font-bold text-lg tracking-tight mb-2">High-Fidelity Operations</h4>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[500px]">
                    Your administrative profile is synchronized with the global core. All security protocols are active, and enterprise integrations are monitored 24/7 for optimal delivery.
                </p>
            </div>
        </div>
    );
}
