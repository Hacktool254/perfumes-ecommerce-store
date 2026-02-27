import { AuthForm } from "@/components/auth/auth-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign In | Ummie's Essence",
    description: "Sign in to your Ummie's Essence account.",
};

export default function LoginPage() {
    return <AuthForm mode="login" />;
}
