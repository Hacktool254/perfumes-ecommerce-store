import { AuthForm } from "@/components/auth/auth-form";

export const metadata = {
    title: "Admin Login - Ummie's Essence",
    description: "Sign in to the Ummie's Essence admin dashboard.",
};

export default function AdminLoginPage() {
    return <AuthForm mode="login" redirectPath="/admin" />;
}
