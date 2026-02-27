import { AuthForm } from "@/components/auth/auth-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create Account | Ummie's Essence",
    description: "Create a new Ummie's Essence account.",
};

export default function RegisterPage() {
    return <AuthForm mode="register" />;
}
