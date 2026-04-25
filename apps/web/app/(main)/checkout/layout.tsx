import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Secure Checkout",
    description: "Complete your order securely with M-Pesa or card payment.",
    robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
