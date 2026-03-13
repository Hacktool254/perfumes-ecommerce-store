import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign In | Ummie's Essence",
    description: "Sign in or create an account to access Ummie's Essence.",
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen w-full">
            {children}
        </div>
    );
}
