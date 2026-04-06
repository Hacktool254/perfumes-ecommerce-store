import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ChatWidget } from "@/components/chat/chat-widget";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen font-sans w-full max-w-full">
            <Header />
            <main className="flex-1 w-full max-w-full bg-[#FAEDEE]">
                {children}
            </main>
            <Footer />
            <ChatWidget />
        </div>
    );
}
