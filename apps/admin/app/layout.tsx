import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { AuthProvider } from "@/lib/auth-context";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";
import { SidebarProvider } from "@/components/providers/sidebar-provider";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { AuthGuard } from "@/components/layout/auth-guard";
import { Toaster } from "sonner";
import './globals.css';

const manrope = Manrope({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Admin Portal | Ummies Essence',
    description: 'High-end editorial admin dashboard for managing Ummie\'s Essence.',
    icons: {
        icon: [
            { url: '/favicon_32x32.png', type: 'image/png' }
        ],
        shortcut: '/favicon_192x192.png',
        apple: '/favicon_180x180.png',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ConvexAuthNextjsServerProvider>
            <html lang="en" className="dark">
                <body className={`${manrope.className} bg-[#0A0D0B] min-h-screen text-foreground`}>
                    <ConvexClientProvider>
                        <AuthProvider>
                            <AuthGuard>
                                <SidebarProvider>
                                    <div className="flex flex-col lg:flex-row w-full min-h-screen overflow-x-hidden">
                                        {/* Sidebar Architecture */}
                                        <AdminSidebar />
                                        <MobileSidebar />

                                        {/* Content Stack */}
                                        <div className="flex-1 flex flex-col min-h-screen bg-surface overflow-x-hidden">
                                            <MobileHeader />

                                            {/* Main Content Area */}
                                            <main className="flex-1 overflow-y-auto transition-all duration-300">
                                                <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-8">
                                                    {children}
                                                </div>
                                            </main>
                                        </div>
                                    </div>
                                </SidebarProvider>
                            </AuthGuard>
                            <Toaster theme="dark" position="bottom-right" expand={false} richColors />
                        </AuthProvider>
                    </ConvexClientProvider>
                </body>
            </html>
        </ConvexAuthNextjsServerProvider>
    );
}
