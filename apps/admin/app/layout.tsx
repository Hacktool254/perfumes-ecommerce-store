import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AuthGuard } from "@/components/layout/auth-guard";
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
            <html lang="en">
                <body className={`${manrope.className} bg-background min-h-screen text-foreground`}>
                    <ConvexClientProvider>
                        <AuthGuard>
                            <div className="flex w-full min-h-screen">
                                {/* Sidebar - Visible for all admin routes */}
                                <AdminSidebar />
                                
                                {/* Main Content Area */}
                                <main className="flex-1 min-h-screen overflow-y-auto px-10 py-8 bg-surface">
                                    <div className="max-w-[1400px] mx-auto">
                                        {children}
                                    </div>
                                </main>
                            </div>
                        </AuthGuard>
                    </ConvexClientProvider>
                </body>
            </html>
        </ConvexAuthNextjsServerProvider>
    );
}
