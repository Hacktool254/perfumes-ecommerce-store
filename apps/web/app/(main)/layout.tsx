import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-[#F8DFE1]/30 p-2 md:p-4 font-sans w-full min-h-screen max-w-full overflow-hidden">
            <div className="relative w-full rounded-[2rem] overflow-x-hidden overflow-y-auto bg-white/40 backdrop-blur-md shadow-2xl h-[calc(100vh-16px)] md:h-[calc(100vh-32px)] border border-white/50 flex flex-col items-center">
                <Header />
                <main className="flex-1 w-full max-w-full">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
}
