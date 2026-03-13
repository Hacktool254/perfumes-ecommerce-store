import { AdminAuthForm } from "@/components/admin/admin-auth-form";

export const metadata = {
    title: "Admin Registration - Ummie's Essence",
    description: "Create an admin account for Ummie's Essence.",
};

export default function AdminRegisterPage() {
    return <AdminAuthForm mode="register" redirectPath="/admin" />;
}
