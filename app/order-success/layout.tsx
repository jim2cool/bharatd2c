import ThemeProvider from "@/components/ThemeProvider";
import { getActiveStore } from "@/lib/getActiveStore";
import { notFound } from "next/navigation";

export default async function OrderSuccessLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const store = await getActiveStore();

    if (!store) {
        return notFound();
    }

    return (
        <ThemeProvider storeConfig={store as any}>
            <main className="bg-[var(--bg-primary)] min-h-screen">
                {children}
            </main>
        </ThemeProvider>
    );
}
