
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { AdminLayoutClient } from "./AdminLayoutClient";
import "./admin-pulse.css";

export const metadata = {
    title: "Admin | Easy D2C",
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
