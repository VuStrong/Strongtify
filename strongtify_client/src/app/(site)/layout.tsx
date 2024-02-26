import { redirect } from "next/navigation";
import SideBar from "@/components/sideBars/SideBar";
import MobileHeader from "@/components/headers/MobileHeader";
import getUserSession from "@/services/getUserSession";
import Player from "@/components/player/Player";
import Footer from "@/components/Footer";
import { getAccount } from "@/services/api/me";
import UserFavsHandler from "@/handlers/UserFavsHandler";

export default async function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getUserSession();
    const account = session ? await getAccount(session.accessToken) : null;

    // if email not confirmed, redirect to confirm page
    if (account && account.emailConfirmed === false) {
        redirect("/success-register");
    }

    return (
        <>
            <div className="bg-black min-h-screen py-2">
                <MobileHeader />
                <SideBar />
                <Player />

                <div className="w-full lg:w-10/12 lg:px-5 px-2 lg:ml-auto mt-10 lg:mt-0">
                    {children}
                </div>

                <UserFavsHandler />
            </div>
            <div className="bg-black w-full lg:w-10/12 lg:px-5 px-2 lg:ml-auto">
                <Footer />
            </div>
        </>
    );
}
