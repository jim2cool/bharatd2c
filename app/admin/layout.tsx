
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { AdminLayoutClient } from "./AdminLayoutClient";

export const metadata = {
    title: "Admin | Bharat D2C",
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
