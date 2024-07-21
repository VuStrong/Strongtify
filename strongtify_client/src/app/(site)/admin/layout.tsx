import { redirect } from "next/navigation";
import getUserSession from "@/services/getUserSession";
import AdminSideBar from "@/components/sideBars/AdminSideBar";

export default async function AdminSiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getUserSession();

    if (session?.user.role !== "ADMIN") {
        return redirect("/");
    }

    return (
        <>
            <AdminSideBar />

            <div className="w-full lg:w-10/12 lg:px-5 px-2 lg:ml-auto mt-10 lg:mt-0">
                {children}
            </div>
        </>
    );
}
