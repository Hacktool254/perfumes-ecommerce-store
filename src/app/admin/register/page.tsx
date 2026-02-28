import { AuthForm } from "@/components/auth/auth-form";

export const metadata = {
    title: "Admin Registration - Ummie's Essence",
    description: "Create an admin account for Ummie's Essence.",
};

export default function AdminRegisterPage() {
    return <AuthForm mode="register" redirectPath="/admin" />;
}
