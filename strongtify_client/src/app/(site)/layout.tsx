import { redirect } from "next/navigation";
import SideBar from "@/components/sideBars/SideBar";
import MobileHeader from "@/components/headers/MobileHeader";
import getUserSession from "@/services/getUserSession";
import Player from "@/components/player/Player";
import Footer from "@/components/Footer";

export default async function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getUserSession();

    // if email not confirmed, redirect to confirm page
    if (session?.user && !session.user.emailConfirmed) {
        redirect("/success-register");
    }

    return (
        <>
            <div className="bg-black min-h-screen py-2">
                <MobileHeader />
                <SideBar />
                <Player />

                <div className="w-full md:w-10/12 md:px-5 px-2 md:ml-auto">
                    {children}
                </div>
            </div>
            <div className="bg-black w-full md:w-10/12 md:px-5 px-2 md:ml-auto">
                <Footer />
            </div>
        </>
    );
}
