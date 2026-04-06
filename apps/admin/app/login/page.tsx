import { AdminAuthForm } from "@/components/admin/admin-auth-form";

export const metadata = {
    title: "Admin Login - Ummie's Essence",
    description: "Sign in to the Ummie's Essence admin dashboard.",
};

export default function AdminLoginPage() {
    return <AdminAuthForm mode="login" redirectPath="/" />;
}
