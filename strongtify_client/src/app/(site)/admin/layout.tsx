import getUserSession from "@/services/getUserSession";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getUserSession();

    if (session?.user.role !== "ADMIN") {
        return redirect("/");
    }

    return <>{children}</>;
}
